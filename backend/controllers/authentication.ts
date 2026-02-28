import { Request, Response } from "express";
import admin from "../config/firebase";

const signInWithGoogle = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers.authorization;

		if (authHeader) {
			const decodedToken = await admin
				.auth()
				.verifyIdToken(authHeader.replace("Bearer ", ""));

			console.log(decodedToken);
		} else {
			return res.status(401).json({ message: "No token provided" });
		}
	} catch (error) {
		console.error(
			"Error during Google sign-in inside of signInWithGoogle function:",
			(error as Error).toString().red.bold
		);
	}
};

export { signInWithGoogle };
