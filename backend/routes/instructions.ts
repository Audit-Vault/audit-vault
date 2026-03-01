import express from "express";
import {
	getPendingInstructions,
	completeInstruction,
	createInstruction,
	getInstructionHistory
} from "../controllers/instructions";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

// Agent endpoints - for the agent to poll and update instructions
// Note: No authentication required - agents use serverId for identification
router.get("/pending/:serverId", getPendingInstructions);
router.post("/complete/:serverId/:instructionId", completeInstruction);

// Admin endpoints - for creating and viewing instructions
router.post("/create/:serverId", isAuthenticated, createInstruction);
router.get("/history/:serverId", isAuthenticated, getInstructionHistory);

export default router;
