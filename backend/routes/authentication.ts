import express from "express";
import { getCurrentUser, signInWithGoogle } from "../controllers/authentication";

const router = express.Router();

router.post("/google/sign-in", signInWithGoogle);
router.get("/current-user", getCurrentUser);

export default router;
