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
		recommendation: String,
		data: mongoose.Schema.Types.Mixed // includes logs and permissions related to it
	}],
	scans: [{
		date: Date,
		filePermissions: mongoose.Schema.Types.Mixed,
		sshConfig: mongoose.Schema.Types.Mixed,
		openPorts: mongoose.Schema.Types.Mixed,
		users: mongoose.Schema.Types.Mixed,
		services: mongoose.Schema.Types.Mixed,
		hostname: String,
		scanTimestamp: String,
		logs: mongoose.Schema.Types.Mixed,
		report: {
			score: Number,
			riskLevel: String,
			summary: String,
			issues: [{
				title: String,
				severity: String,
				description: String,
				recommendation: String
			}],
			actionPlan: [String]
		}
	}]
}, {
	timestamps: true
});

export const Server = mongoose.model("Server", serverSchema);
