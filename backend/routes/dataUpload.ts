import express from "express";
import {
	initializeUpload,
	uploadScanData,
	finalizeUpload,
	getServer,
	getAllServers,
	cancelUpload,
	getScanReport,
	registerServer
} from "../controllers/dataUpload";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

// Register a new server (protected)
router.post("/register-server", isAuthenticated, registerServer);

// Initialize a new upload session (agent endpoint - no auth required, uses serverId)
router.post("/initialize", initializeUpload);

// Upload scan data in parts (agent endpoint)
router.post("/upload", uploadScanData);

// Finalize the upload and save to database (agent endpoint)
router.post("/finalize", finalizeUpload);

// Cancel an upload session
router.post("/cancel", cancelUpload);

// Get server information by ID (protected)
router.get("/server/:serverId", isAuthenticated, getServer);

// Get all servers (protected)
router.get("/servers", isAuthenticated, getAllServers);

// Poll for scan report readiness by server name
router.get("/report/by-name/:serverName", getScanReport);

export default router;
