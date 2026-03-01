import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import colors from "colors";
import authRoutes from "./routes/authentication";
import cors from "cors";
import instructionsRoutes from "./routes/instructions";
import dataUploadRoutes from "./routes/dataUpload";

dotenv.config();
colors.enable();

const app = express();

const MONGO_URI: string = process.env.MONGO_URI!;
const PORT: string | number = process.env.PORT! || 4000;

const corsOptions = {
	origin: process.env.FRONTEND_URL,
	credentials: true,
	optionSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/instructions", instructionsRoutes);
app.use("/api/data", dataUploadRoutes);

app.get("/", (req, res) => {
	res.json({
		message: "Welcome to the backend API",
		endpoints: {
			"/api/auth": "Authentication routes",
			"/api/instructions": "Instructions routes",
			"/api/data": "Data upload routes"
		}
	});
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
