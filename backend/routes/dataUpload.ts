import express from "express";
import {
	initializeUpload,
	uploadScanData,
	finalizeUpload,
	getServer,
	getAllServers,
	cancelUpload
} from "../controllers/dataUpload";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

// Initialize a new upload session
router.post("/initialize", initializeUpload);

// Upload scan data in parts
router.post("/upload", uploadScanData);

// Finalize the upload and save to database
router.post("/finalize", finalizeUpload);

// Cancel an upload session
router.post("/cancel", cancelUpload);

// Get server information by ID (protected)
router.get("/server/:serverId", isAuthenticated, getServer);

// Get all servers (protected)
router.get("/servers", isAuthenticated, getAllServers);

export default router;
