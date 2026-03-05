import mongoose from "mongoose";

const serverSchema = new mongoose.Schema(
	{
		_id: {
			type: String // Server's unique identifier (agent token/UUID)
		},
		name: {
			type: String
		},
		userId: {
			type: String,
			required: false // User ID who owns this server (optional for agent uploads)
		},
		instructions: [
			{
				type: {
					type: String
				},
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
			}
		],
		vulnerabilities: [
			{
				name: String,
				description: String,
				severity: String,
				recommendation: String,
				data: mongoose.Schema.Types.Mixed // includes logs and permissions related to it
			}
		],
		scans: [
			{
				date: Date,
				filePermissions: mongoose.Schema.Types.Mixed,
				logs: mongoose.Schema.Types.Mixed,
				users: mongoose.Schema.Types.Mixed,
				report: {
					score: Number,
					riskLevel: String,
					summary: String,
					issues: [
						{
							title: String,
							severity: String,
							description: String,
							recommendation: String
						}
					],
					actionPlan: [String],
					remediationScript: String
				}
			}
		]
	},
	{
		timestamps: true
	}
);

export const Server = mongoose.model("Server", serverSchema);
