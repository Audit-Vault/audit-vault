import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		_id: {
			type: String
		},
		picture: {
			type: String
		},
		email: {
			type: String,
			unique: true
		},
		name: {
			type: String
		}
	},
	{
		timestamps: true
	}
);

export const User = mongoose.model("User", userSchema);
