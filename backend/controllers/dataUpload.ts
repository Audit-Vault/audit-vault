import { Request, Response } from "express";
import { Server } from "../models/server";
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import { analyzeScanWithGemini } from "../services/gemini";

// Temporary storage for partial uploads
const uploadSessions = new Map<
	string,
	{
		serverId: string;
		serverName: string;
		scanData: {
			filePermissions?: any;
			logs?: any;
			users?: any;
		};
		vulnerabilities?: any[];
		lastActivity: Date;
	}
>();

// Clean up old sessions (older than 1 hour)
setInterval(
	() => {
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
		for (const [sessionId, session] of uploadSessions.entries()) {
			if (session.lastActivity < oneHourAgo) {
				uploadSessions.delete(sessionId);
			}
		}
	},
	5 * 60 * 1000
); // Run every 5 minutes

/**
 * Initialize a new upload session
 */
export const initializeUpload = async (req: Request, res: Response) => {
	try {
		const { serverName, serverId: providedServerId } = req.body;

		if (!serverName) {
			return res.status(400).json({
				success: false,
				message: "serverName is required"
			});
		}

		// Check if server already exists (by name or provided ID)
		let existingServer;
		if (providedServerId) {
			existingServer = await Server.findOne({ uuid: providedServerId });
		} else {
			existingServer = await Server.findOne({ name: serverName });
		}

		// Use existing server ID or generate a new UUID
		const serverId = existingServer?.uuid || providedServerId || randomUUID();

		// Generate a unique session ID
		const sessionId = new mongoose.Types.ObjectId().toString();

		// Initialize upload session
		uploadSessions.set(sessionId, {
			serverId,
			serverName,
			scanData: {},
			vulnerabilities: [],
			lastActivity: new Date()
		});

		res.status(200).json({
			success: true,
			sessionId,
			serverId,
			isNewServer: !existingServer,
			message: "Upload session initialized"
		});
	} catch (error) {
		console.error("Error initializing upload:", error);
		res.status(500).json({
			success: false,
			message: "Failed to initialize upload session",
			error: (error as Error).message
		});
	}
};

/**
 * Upload scan data in parts
 */
export const uploadScanData = async (req: Request, res: Response) => {
	try {
		const { sessionId, dataType, data } = req.body;

		if (!sessionId || !dataType || !data) {
			return res.status(400).json({
				success: false,
				message: "sessionId, dataType, and data are required"
			});
		}

		// Get the upload session
		const session = uploadSessions.get(sessionId);
		if (!session) {
			return res.status(404).json({
				success: false,
				message: "Upload session not found or expired"
			});
		}

		// Update session activity
		session.lastActivity = new Date();

		// Store data based on type
		switch (dataType) {
			case "filePermissions":
				session.scanData.filePermissions = data;
				break;
			case "logs":
				session.scanData.logs = data;
				break;
			case "users":
				session.scanData.users = data;
				break;
			case "vulnerabilities":
				session.vulnerabilities = data;
				break;
			default:
				return res.status(400).json({
					success: false,
					message: `Unknown dataType: ${dataType}. Valid types: filePermissions, logs, users, vulnerabilities`
				});
		}

		res.status(200).json({
			success: true,
			message: `${dataType} data uploaded successfully`,
			session: {
				serverId: session.serverId,
				serverName: session.serverName,
				uploadedParts: {
					filePermissions: !!session.scanData.filePermissions,
					logs: !!session.scanData.logs,
					users: !!session.scanData.users,
					vulnerabilities:
						!!session.vulnerabilities && session.vulnerabilities.length > 0
				}
			}
		});
	} catch (error) {
		console.error("Error uploading scan data:", error);
		res.status(500).json({
			success: false,
			message: "Failed to upload scan data",
			error: (error as Error).message
		});
	}
};

/**
 * Finalize the upload and save to database
 */
export const finalizeUpload = async (req: Request, res: Response) => {
	try {
		const { sessionId } = req.body;
		// Note: uuid is optional for agent uploads (not authenticated)
		// Server can be linked to a user later through the UI
		const uuid = req.cookies.decoded_uid || null;

		if (!sessionId) {
			return res.status(400).json({
				success: false,
				message: "sessionId is required"
			});
		}

		// Get the upload session
		const session = uploadSessions.get(sessionId);
		if (!session) {
			return res.status(404).json({
				success: false,
				message: "Upload session not found or expired"
			});
		}

		// Check if we have any data to save
		const hasData =
			session.scanData.filePermissions ||
			session.scanData.logs ||
			session.scanData.users ||
			(session.vulnerabilities && session.vulnerabilities.length > 0);

		if (!hasData) {
			return res.status(400).json({
				success: false,
				message: "No data uploaded in this session"
			});
		}

		// Find or create server (by server ID, not user ID)
		let server = await Server.findById(session.serverId);

		if (!server) {
			server = new Server({
				_id: session.serverId,
				name: session.serverName,
				uuid, // User ID (optional for agent uploads)
				vulnerabilities: session.vulnerabilities || [],
				scans: []
			});
		}

		// Add new scan if we have scan data
		if (
			session.scanData.filePermissions ||
			session.scanData.logs ||
			session.scanData.users
		) {
			server.scans.push({
				date: new Date(),
				filePermissions: session.scanData.filePermissions || {},
				logs: session.scanData.logs || {},
				users: session.scanData.users || {}
			} as any);
		}

		// Update vulnerabilities if provided
		if (session.vulnerabilities && session.vulnerabilities.length > 0) {
			server.vulnerabilities = session.vulnerabilities as any;
		}

		await server.save();

		// Capture identifiers needed for async update
		const serverId = server._id ? server._id.toString() : null;
		const scanIndex = server.scans.length - 1;
		const scanData = { ...session.scanData };
		const vulnerabilities = [...(session.vulnerabilities || [])];

		// Clean up session before async work
		uploadSessions.delete(sessionId);

		// Kick off Gemini analysis asynchronously so the response isn't blocked
		analyzeScanWithGemini(scanData, vulnerabilities)
			.then(async report => {
				await Server.findByIdAndUpdate(serverId, {
					$set: {
						[`scans.${scanIndex}.report`]: report,
						vulnerabilities: report.issues.map(issue => ({
							name: issue.title,
							description: issue.description,
							severity: issue.severity,
							recommendation: issue.recommendation
						}))
					}
				});
				console.log(
					`Gemini analysis complete for server: ${session.serverName}`
				);
			})
			.catch(err => console.error("Gemini analysis failed:", err));

		res.status(200).json({
			success: true,
			message: "Upload finalized. Analysis in progress.",
			server: {
				_id: server._id,
				name: server.name,
				totalScans: server.scans.length,
				totalVulnerabilities: server.vulnerabilities.length
			}
		});
	} catch (error) {
		console.error("Error finalizing upload:", error);
		res.status(500).json({
			success: false,
			message: "Failed to finalize upload",
			error: (error as Error).message
		});
	}
};

/**
 * Poll for scan report readiness by server name
 */
export const getScanReport = async (req: Request, res: Response) => {
	try {
		const { serverName } = req.params;

		const server = await Server.findOne({ name: serverName });
		if (!server || server.scans.length === 0) {
			return res.status(200).json({ ready: false });
		}

		const latestScan = server.scans[server.scans.length - 1] as any;
		if (!latestScan.report || !latestScan.report.score) {
			return res.status(200).json({ ready: false });
		}

		return res.status(200).json({
			ready: true,
			report: latestScan.report
		});
	} catch (error) {
		console.error("Error getting scan report:", error);
		res.status(500).json({
			success: false,
			message: "Failed to get scan report",
			error: (error as Error).message
		});
	}
};

/**
 * Get server information
 */
export const getServer = async (req: Request, res: Response) => {
	try {
		const uuid = req.cookies.decoded_uid;
		const { serverId } = req.params;

		const server = await Server.findOne({ _id: serverId, uuid: uuid });

		if (!server) {
			return res.status(404).json({
				success: false,
				message: "Server not found"
			});
		}

		res.status(200).json({
			success: true,
			server
		});
	} catch (error) {
		console.error("Error getting server:", error);
		res.status(500).json({
			success: false,
			message: "Failed to get server information",
			error: (error as Error).message
		});
	}
};

/**
 * Get all servers
 */
export const getAllServers = async (req: Request, res: Response) => {
	try {
		const uuid = req.cookies.decoded_uid;
		const servers = await Server.find({ uuid }).select(
			"uuid name vulnerabilities scans"
		);

		res.status(200).json({
			success: true,
			count: servers.length,
			servers: servers.map(server => ({
				id: server._id,
				uuid: server.uuid,
				name: server.name,
				totalScans: server.scans.length,
				totalVulnerabilities: server.vulnerabilities.length,
				lastScan:
					server.scans.length > 0
						? server.scans[server.scans.length - 1].date
						: null
			}))
		});
	} catch (error) {
		console.error("Error getting servers:", error);
		res.status(500).json({
			success: false,
			message: "Failed to get servers",
			error: (error as Error).message
		});
	}
};

/**
 * Cancel an upload session
 */
export const cancelUpload = async (req: Request, res: Response) => {
	try {
		const { sessionId } = req.body;

		if (!sessionId) {
			return res.status(400).json({
				success: false,
				message: "sessionId is required"
			});
		}

		const existed = uploadSessions.delete(sessionId);

		if (!existed) {
			return res.status(404).json({
				success: false,
				message: "Upload session not found or already expired"
			});
		}

		res.status(200).json({
			success: true,
			message: "Upload session cancelled"
		});
	} catch (error) {
		console.error("Error cancelling upload:", error);
		res.status(500).json({
			success: false,
			message: "Failed to cancel upload session",
			error: (error as Error).message
		});
	}
};

/**
 * Register a new server and return its UUID
 */
export const registerServer = async (req: Request, res: Response) => {
	try {
		const { serverName } = req.body;
		const uuid = req.cookies.decoded_uid;

		if (!serverName) {
			return res.status(400).json({
				success: false,
				message: "serverName is required"
			});
		}

		// Check if server with this name already exists
		const existingServer = await Server.findOne({ name: serverName });

		if (existingServer) {
			return res.status(200).json({
				success: true,
				serverId: existingServer.uuid,
				serverName: existingServer.name,
				message: "Server already exists"
			});
		}

		// Create new server with a UUID
		const serverId = randomUUID();
		const server = new Server({
			_id: serverId,
			name: serverName,
			uuid,
			vulnerabilities: [],
			scans: [],
			instructions: []
		});

		await server.save();

		res.status(201).json({
			success: true,
			serverId: server.uuid,
			serverName: server.name,
			message: "Server registered successfully"
		});
	} catch (error) {
		console.error("Error registering server:", error);
		res.status(500).json({
			success: false,
			message: "Failed to register server",
			error: (error as Error).message
		});
	}
};
