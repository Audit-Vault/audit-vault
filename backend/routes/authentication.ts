import express from "express";
import {
	getCurrentUser,
	signInWithGoogle,
	logout
} from "../controllers/authentication";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

router.post("/google/sign-in", signInWithGoogle);
router.get("/current-user", isAuthenticated, getCurrentUser);
router.post("/logout", logout);

export default router;
