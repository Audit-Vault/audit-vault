import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import colors from "colors";

dotenv.config();
colors.enable();

const app = express();

const MONGO_URI: string = process.env.MONGO_URI!;
const PORT: string | number = process.env.PORT! || 3000;

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.listen(PORT, () => {
	const connectToMongoDB = async () => {
		try {
			const conn = await mongoose.connect(MONGO_URI!);
			console.log(
				"Successfully connected to MongoDB on host:".yellow,
				`${conn.connection.host}`.green.bold
			);
			console.log(`Server listening on port ${PORT}!`.yellow.bold);
		} catch (error) {
			console.error((error as Error).toString().red.bold);
		}
	};

	connectToMongoDB();
});
