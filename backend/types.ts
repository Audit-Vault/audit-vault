import mongoose from "mongoose";

type User = {
	_id: string;
	picture: string;
	email: string;
	name: string;
};

type Instruction = {
	_id: string;
	type: string;
	description: string;
	data: any;
	status: "pending" | "completed" | "failed";
	createdAt: Date;
	completedAt: Date;
	result: any;
	error: string;
};

type Vulnerability = {
	name: string;
	description: string;
	severity: string;
	data: any; // includes logs and permissions related to it
};

type Scan = {
	date: Date;
	filePermissions: any;
	logs: any;
	users: any;
};

type Server = {
	name: string;
	uuid: string;
	instructions: Instruction[];
	vulnerabilities: Vulnerability[];
	scans: Scan[];
};

type UserDoc = User & mongoose.Document;

export { User, Instruction, Vulnerability, Scan, Server, UserDoc };
