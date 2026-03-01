import express from "express";
import {
	initializeUpload,
	uploadScanData,
	finalizeUpload,
	getServer,
	getAllServers,
	cancelUpload,
	getScanReport
} from "../controllers/dataUpload";

const router = express.Router();

// Initialize a new upload session
router.post("/initialize", initializeUpload);

// Upload scan data in parts
router.post("/upload", uploadScanData);

// Finalize the upload and save to database
router.post("/finalize", finalizeUpload);

// Cancel an upload session
router.post("/cancel", cancelUpload);

// Get server information by ID
router.get("/server/:serverId", getServer);

// Get all servers
router.get("/servers", getAllServers);

// Poll for scan report readiness by server name
router.get("/report/by-name/:serverName", getScanReport);

export default router;
