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
router.get("/pending/:serverId", getPendingInstructions);
router.post("/complete/:serverId/:instructionId", completeInstruction);

// Admin endpoints - for creating and viewing instructions
router.post("/create/:serverId", isAuthenticated, createInstruction);
router.get("/history/:serverId", getInstructionHistory);

export default router;
