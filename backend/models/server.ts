import mongoose from "mongoose";

const serverSchema = new mongoose.Schema({
	name: String,
	uuid: String, // uuid

	instructions: [{
		type: String,
		description: String,
		data: mongoose.Schema.Types.Mixed,
		status: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending"
		},
		createdAt: Date,
		completedAt: Date,
		result: mongoose.Schema.Types.Mixed,
		error: String
	}],
	vulnerabilities: [{
		name: String,
		description: String,
		severity: String,
		data: mongoose.Schema.Types.Mixed // includes logs and permissions related to it
	}],
	scans: [{
		date: Date,
		filePermissions: mongoose.Schema.Types.Mixed,
		logs: mongoose.Schema.Types.Mixed,
		users: mongoose.Schema.Types.Mixed
	}]
}, {
	timestamps: true
});

export const Server = mongoose.model("Server", serverSchema);
