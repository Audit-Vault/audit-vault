import { Request, Response } from "express";
import { Server } from "../models/server";
import { Instruction } from "../types";

/**
 * Get pending instructions for a server
 */
export const getPendingInstructions = async (req: Request, res: Response) => {
	try {
		const { serverId } = req.params;
		const uuid = req.cookies.decoded_uid;

		if (!serverId) {
			return res.status(400).json({
				success: false,
				message: "serverId is required"
			});
		}

		// Find the server
		const server = await Server.findOne({ uuid: serverId });

		if (!server) {
			return res.status(404).json({
				success: false,
				message: "Server not found"
			});
		}

		// Get pending instructions (not executed yet)
		const pendingInstructions = (server.instructions || []).filter(
			(instruction: any) => instruction.status === "pending"
		);

		res.status(200).json({
			success: true,
			serverId: server._id,
			uuid,
			serverName: server.name,
			instructions: pendingInstructions.map((inst: any) => ({
				id: inst._id,
				type: inst.type,
				description: inst.description,
				data: inst.data,
				createdAt: inst.createdAt
			}))
		});
	} catch (error) {
		console.error("Error getting pending instructions:", error);
		res.status(500).json({
			success: false,
			message: "Failed to get pending instructions",
			error: (error as Error).message
		});
	}
};

/**
 * Mark an instruction as completed
 */
export const completeInstruction = async (req: Request, res: Response) => {
	try {
		const { serverId, instructionId } = req.params;
		const { result, error } = req.body;

		if (!serverId || !instructionId) {
			return res.status(400).json({
				success: false,
				message: "serverId and instructionId are required"
			});
		}

		// Find the server and update the instruction status
		const server = await Server.findOne({ uuid: serverId });

		if (!server) {
			return res.status(404).json({
				success: false,
				message: "Server not found"
			});
		}

		// Find the instruction and update it
		const instruction: Instruction = server.instructions?.find(
			(inst: any) => inst._id.toString() === instructionId
		) as unknown as Instruction;

		if (!instruction) {
			return res.status(404).json({
				success: false,
				message: "Instruction not found"
			});
		}

		instruction.status = error ? "failed" : "completed";
		instruction.completedAt = new Date();
		instruction.result = result;
		if (error) {
			instruction.error = error;
		}

		await server.save();

		res.status(200).json({
			success: true,
			message: "Instruction marked as completed",
			instruction: {
				id: instruction._id,
				status: instruction.status,
				completedAt: instruction.completedAt
			}
		});
	} catch (error) {
		console.error("Error completing instruction:", error);
		res.status(500).json({
			success: false,
			message: "Failed to complete instruction",
			error: (error as Error).message
		});
	}
};

/**
 * Create a new instruction for a server (admin endpoint)
 */
export const createInstruction = async (req: Request, res: Response) => {
	try {
		const { serverId } = req.params;
		const { type, description, data } = req.body;

		if (!serverId || !type) {
			return res.status(400).json({
				success: false,
				message: "serverId and type are required"
			});
		}

		// Validate instruction type
		const validTypes = [
			"trigger_scan",
			"update_config",
			"restart_agent",
			"collect_logs"
		];
		if (!validTypes.includes(type)) {
			return res.status(400).json({
				success: false,
				message: `Invalid instruction type. Valid types: ${validTypes.join(", ")}`
			});
		}

		// Find the server
		const server = await Server.findOne({ _id: serverId });

		if (!server) {
			return res.status(404).json({
				success: false,
				message: "Server not found"
			});
		}

		// Create new instruction
		const newInstruction = {
			type,
			description: description || `Execute ${type}`,
			data: data || {},
			status: "pending",
			createdAt: new Date()
		};

		if (!server.instructions) {
			server.instructions = [] as any;
		}

		server.instructions.push(newInstruction as any);
		await server.save();

		// Get the last added instruction (with its _id)
		const addedInstruction: Instruction = server.instructions[
			server.instructions.length - 1
		] as unknown as Instruction;

		res.status(201).json({
			success: true,
			message: "Instruction created successfully",
			instruction: {
				id: addedInstruction._id,
				type: addedInstruction.type,
				description: addedInstruction.description,
				data: addedInstruction.data,
				status: addedInstruction.status,
				createdAt: addedInstruction.createdAt
			}
		});
	} catch (error) {
		console.error("Error creating instruction:", error);
		res.status(500).json({
			success: false,
			message: "Failed to create instruction",
			error: (error as Error).message
		});
	}
};

/**
 * Get instruction history for a server
 */
export const getInstructionHistory = async (req: Request, res: Response) => {
	try {
		const { serverId } = req.params;
		const uuid = req.cookies.decoded_uid;
		const { limit = "50" } = req.query;

		if (!serverId) {
			return res.status(400).json({
				success: false,
				message: "serverId is required"
			});
		}

		// Find the server
		const server = await Server.findOne({ uuid: serverId });

		if (!server) {
			return res.status(404).json({
				success: false,
				message: "Server not found"
			});
		}

		// Get all instructions, sorted by creation date (newest first)
		const allInstructions = (server.instructions || [])
			.slice(-parseInt(limit as string))
			.reverse();

		res.status(200).json({
			success: true,
			serverId: server._id,
			uuid,
			serverName: server.name,
			total: allInstructions.length,
			instructions: allInstructions.map((inst: any) => ({
				id: inst._id,
				type: inst.type,
				description: inst.description,
				status: inst.status,
				createdAt: inst.createdAt,
				completedAt: inst.completedAt,
				result: inst.result,
				error: inst.error
			}))
		});
	} catch (error) {
		console.error("Error getting instruction history:", error);
		res.status(500).json({
			success: false,
			message: "Failed to get instruction history",
			error: (error as Error).message
		});
	}
};
