import { Request, Response } from "express";

const signInWithGoogle = async (req: Request, res: Response) => {
	try {
	} catch (error) {
		console.error(
			"Error during Google sign-in inside of signInWithGoogle function:",
			(error as Error).toString().red.bold
		);
	}
};

export { signInWithGoogle };
