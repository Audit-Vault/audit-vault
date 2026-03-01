import { Request, Response } from "express";
import admin from "../config/firebase";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { UserDoc, User as UserType } from "../types";

function createCookie(user_id: string, res: Response) {
	const payload = {
		user_id
	};
	const secretKey: string = Math.floor(
		Math.random() * Number(new Date())
	).toString();
	const token = jwt.sign(payload, secretKey, { expiresIn: "3d" });
	res.cookie("auth-session", token, { httpOnly: true, maxAge: 259200000 }); // 3 days in milliseconds
}

const signInWithGoogle = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers.authorization;

		if (authHeader) {
			const decodedToken = await admin
				.auth()
				.verifyIdToken(authHeader.replace("Bearer ", ""));

			// first check if a new user exists on MongoDB
			const user: UserType | null = await User.findOne({
				_id: decodedToken.uid
			});
			if (user) return createCookie(user._id, res);

			// if not, create a new user
			const newUser: UserDoc = new User({
				_id: decodedToken.uid,
				email: decodedToken.email,
				name: decodedToken.name,
				picture: decodedToken.picture
			}) as unknown as UserDoc;
			await newUser.save();

			createCookie(newUser._id, res);
			return res
				.status(200)
				.json({ message: "User signed in successfully", user: newUser });
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

const getCurrentUser = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.user._id);
		if (user) {
			return res.status(200).json({ user });
		} else {
			return res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		console.error(
			"Error fetching current user:",
			(error as Error).toString().red.bold
		);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export { signInWithGoogle, getCurrentUser };
