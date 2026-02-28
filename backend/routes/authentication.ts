import express from "express";
import { signInWithGoogle } from "../controllers/authentication";

const router = express.Router();

router.post("/google/sign-in", signInWithGoogle);

export default router;
