import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import colors from "colors";
import authRoutes from "./routes/authentication";
import cors from "cors";

dotenv.config();
colors.enable();

const app = express();

const MONGO_URI: string = process.env.MONGO_URI!;
const PORT: string | number = process.env.PORT! || 3000;

const corsOptions = {
	origin: process.env.FRONTEND_URL, // <-- if your frontend port is different, change it
	credentials: true,
	optionSuccessStatus: 200
};

// Middleware:
app.use(cors(corsOptions)); // <-- for CORS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

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
