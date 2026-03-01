import { Request, Response } from "express";
import admin from "../config/firebase";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { UserDoc, User as UserType } from "../types";

function createCookie(user_id: string, res: Response) {
	const token = jwt.sign({ user_id }, process.env.JWT_SECRET!, {
		expiresIn: "15d"
	});
	res.cookie("auth-session", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV !== "development"
	});
}

const signInWithGoogle = async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers.authorization;

		if (authHeader) {
			const decodedToken = await admin
				.auth()
				.verifyIdToken(authHeader.replace("Bearer ", ""));

			// check if a new user exists on MongoDB
			const user: UserType | null = (await User.findOne({
				_id: decodedToken.uid
			})
				.select("-__v")
				.lean()) as UserType | null;

			if (user) {
				createCookie(user._id, res);
				return res.status(200).json({ user });
			}

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
		const user = await User.findById({ _id: req.cookies.decoded_uid });
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
