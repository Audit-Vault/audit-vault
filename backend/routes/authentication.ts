import express from "express";
import {
	getCurrentUser,
	signInWithGoogle
} from "../controllers/authentication";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

router.post("/google/sign-in", signInWithGoogle);
router.get("/current-user", isAuthenticated, getCurrentUser);

export default router;
