import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Server,
	Shield,
	AlertTriangle,
	CheckCircle2,
	Clock,
	Download,
	RefreshCw
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Vulnerability {
	name: string;
	description: string;
	severity: string;
	data: any;
}

interface Scan {
	date: string;
	filePermissions: any;
	logs: any;
	users: any;
}

interface Instruction {
	id: string;
	type: string;
	description: string;
	status: "pending" | "completed" | "failed";
	createdAt: string;
	completedAt?: string;
	result?: any;
	error?: string;
}

interface ServerData {
	_id: string;
	name: string;
	userId: string;
	vulnerabilities: Vulnerability[];
	scans: Scan[];
	createdAt: string;
	updatedAt: string;
}

const severityColors = {
	low: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
	medium: "bg-orange-500/10 border-orange-500/30 text-orange-400",
	high: "bg-red-500/10 border-red-500/30 text-red-400",
	critical: "bg-purple-500/10 border-purple-500/30 text-purple-400"
};

export function ServerDetail() {
	const { serverId } = useParams<{ serverId: string }>();
	const navigate = useNavigate();
	const [server, setServer] = useState<ServerData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isCreatingInstruction, setIsCreatingInstruction] = useState(false);
	const [instructionMessage, setInstructionMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [instructions, setInstructions] = useState<Instruction[]>([]);
	const [loadingInstructions, setLoadingInstructions] = useState(false);

	useEffect(() => {
		if (serverId) {
			fetchServerDetails();
		}
	}, [serverId]);

	useEffect(() => {
		if (server) {
			fetchInstructions();
		}
	}, [server?._id]);

	const fetchServerDetails = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/api/data/server/${serverId}`,
				{
					credentials: "include"
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch server details");
			}

			const data = await response.json();
			setServer(data.server);
		} catch (err) {
			console.error("Error fetching server details:", err);
			setError("Failed to load server details");
		} finally {
			setLoading(false);
		}
	};

	const fetchInstructions = async () => {
		if (!server) return;
		
		try {
			setLoadingInstructions(true);
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/api/instructions/history/${server._id}`,
				{
					credentials: "include"
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch instructions");
			}

			const data = await response.json();
			setInstructions(data.instructions || []);
		} catch (err) {
			console.error("Error fetching instructions:", err);
		} finally {
			setLoadingInstructions(false);
		}
	};

	const handleDownload = () => {
		if (!server) return;

		const reportContent = `AuditVault Security Report
Server: ${server.name}
Generated: ${new Date().toLocaleString()}

=== VULNERABILITIES ===
Total: ${server.vulnerabilities.length}

${server.vulnerabilities
	.map(
		(vuln, idx) => `
${idx + 1}. ${vuln.name} [${vuln.severity.toUpperCase()}]
   ${vuln.description}
`
	)
	.join("\n")}

=== SCANS ===
Total Scans: ${server.scans.length}
${server.scans
	.map(
		(scan, idx) => `
Scan ${idx + 1}: ${new Date(scan.date).toLocaleString()}
`
	)
	.join("\n")}
`;

		const blob = new Blob([reportContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `auditvault-${server.name}-report.txt`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleTriggerScan = async () => {
		if (!server) return;

		try {
			setIsCreatingInstruction(true);
			setInstructionMessage(null);

			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/api/instructions/create/${server._id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					credentials: "include",
					body: JSON.stringify({
						type: "trigger_scan",
						description: "Trigger a new security scan",
						data: {}
					})
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				console.error("API Error:", response.status, errorData);
				throw new Error(errorData?.message || `Server returned ${response.status}`);
			}

			const data = await response.json();
			console.log("Scan instruction created:", data);

			setInstructionMessage({
				type: "success",
				text: "Scan instruction created successfully! The agent will process it shortly."
			});

			// Refresh instructions list
			fetchInstructions();

			// Clear success message after 5 seconds
			setTimeout(() => {
				setInstructionMessage(null);
			}, 5000);
		} catch (err) {
			console.error("Error creating scan instruction:", err);
			const errorMessage = err instanceof Error ? err.message : "Failed to create scan instruction. Please try again.";
			setInstructionMessage({
				type: "error",
				text: errorMessage
			});

			// Clear error message after 5 seconds
			setTimeout(() => {
				setInstructionMessage(null);
			}, 5000);
		} finally {
			setIsCreatingInstruction(false);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	};

	const getSeverityClass = (severity: string) => {
		const normalized = severity.toLowerCase();
		return (
			severityColors[normalized as keyof typeof severityColors] ||
			severityColors.low
		);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
			</div>
		);
	}

	if (error || !server) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
				<div className="container mx-auto max-w-6xl">
					<Button
						onClick={() => navigate("/dashboard")}
						variant="ghost"
						className="mb-6 text-slate-300 hover:text-white hover:bg-slate-800/50"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Dashboard
					</Button>
					<Card className="bg-red-500/10 border-red-500/30 p-12 text-center">
						<AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-white mb-2">Error</h3>
						<p className="text-red-400">{error || "Server not found"}</p>
					</Card>
				</div>
			</div>
		);
	}

	const healthScore =
		server.vulnerabilities.length === 0
			? 100
			: Math.max(0, 100 - server.vulnerabilities.length * 5);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
			<div className="container mx-auto max-w-6xl">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<Button
						onClick={() => navigate("/dashboard")}
						variant="ghost"
						className="text-slate-300 hover:text-white hover:bg-slate-800/50"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Dashboard
					</Button>
					<div className="flex gap-3">
						<Button
							onClick={handleTriggerScan}
							disabled={isCreatingInstruction}
							className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/30"
						>
							{isCreatingInstruction ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Creating...
								</>
							) : (
								<>
									<RefreshCw className="w-4 h-4 mr-2" />
									New Scan
								</>
							)}
						</Button>
						<Button
							onClick={handleDownload}
							className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
						>
							<Download className="w-4 h-4 mr-2" />
							Download Report
						</Button>
					</div>
				</div>

				{/* Instruction Message */}
				{instructionMessage && (
					<Card
						className={`mb-6 p-4 ${instructionMessage.type === "success" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}
					>
						<p
							className={`text-center ${instructionMessage.type === "success" ? "text-green-400" : "text-red-400"}`}
						>
							{instructionMessage.text}
						</p>
					</Card>
				)}

				{/* Server Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<Shield className="w-8 h-8 text-blue-400" />
						<h1 className="text-3xl font-bold text-white">{server.name}</h1>
					</div>
					<p className="text-slate-400">
						Server ID: {server._id} • Last updated:{" "}
						{formatDate(server.updatedAt)}
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card className="bg-slate-900/50 border-slate-700/50 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-400 text-sm mb-1">Health Score</p>
								<p
									className={`text-3xl font-bold ${healthScore >= 80 ? "text-green-400" : healthScore >= 60 ? "text-yellow-400" : "text-red-400"}`}
								>
									{healthScore}
								</p>
							</div>
							<CheckCircle2
								className={`w-12 h-12 ${healthScore >= 80 ? "text-green-400" : healthScore >= 60 ? "text-yellow-400" : "text-red-400"}`}
							/>
						</div>
					</Card>

					<Card className="bg-slate-900/50 border-slate-700/50 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-400 text-sm mb-1">Vulnerabilities</p>
								<p
									className={`text-3xl font-bold ${server.vulnerabilities.length === 0 ? "text-green-400" : "text-red-400"}`}
								>
									{server.vulnerabilities.length}
								</p>
							</div>
							<AlertTriangle
								className={`w-12 h-12 ${server.vulnerabilities.length === 0 ? "text-green-400" : "text-red-400"}`}
							/>
						</div>
					</Card>

					<Card className="bg-slate-900/50 border-slate-700/50 p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-slate-400 text-sm mb-1">Total Scans</p>
								<p className="text-3xl font-bold text-blue-400">
									{server.scans.length}
								</p>
							</div>
							<Server className="w-12 h-12 text-blue-400" />
						</div>
					</Card>
				</div>

				{/* Vulnerabilities Section */}
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-white mb-4">
						Vulnerabilities
					</h2>
					{server.vulnerabilities.length === 0 ? (
						<Card className="bg-green-500/10 border-green-500/30 p-8 text-center">
							<CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
							<p className="text-green-400 text-lg">
								No vulnerabilities detected!
							</p>
						</Card>
					) : (
						<div className="space-y-4">
							{server.vulnerabilities.map((vuln, index) => (
								<Card
									key={index}
									className={`border p-6 ${getSeverityClass(vuln.severity)}`}
								>
									<div className="flex items-start justify-between mb-2">
										<h3 className="text-xl font-semibold">{vuln.name}</h3>
										<span className="px-3 py-1 rounded-full text-xs font-semibold uppercase border">
											{vuln.severity}
										</span>
									</div>
									<p className="text-slate-300">{vuln.description}</p>
								</Card>
							))}
						</div>
					)}
				</div>

				{/* Pending Instructions Section */}
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-white mb-4">
						Pending Instructions
					</h2>
					{loadingInstructions ? (
						<Card className="bg-slate-900/50 border-slate-700/50 p-8 text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
						</Card>
					) : instructions.filter((inst) => inst.status === "pending").length === 0 ? (
						<Card className="bg-slate-900/50 border-slate-700/50 p-8 text-center">
							<CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
							<p className="text-slate-400">No pending instructions</p>
						</Card>
					) : (
						<div className="space-y-4">
							{instructions
								.filter((inst) => inst.status === "pending")
								.map((instruction) => (
									<Card
										key={instruction.id}
										className="bg-blue-500/10 border-blue-500/30 p-6"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<RefreshCw className="w-5 h-5 text-blue-400" />
													<h3 className="text-lg font-semibold text-white">
														{instruction.type.replace(/_/g, " ").toUpperCase()}
													</h3>
												</div>
												<p className="text-slate-300 mb-2">
													{instruction.description}
												</p>
												<p className="text-slate-400 text-sm">
													Created: {formatDate(instruction.createdAt)}
												</p>
											</div>
											<span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
												Pending
											</span>
										</div>
									</Card>
								))}
						</div>
					)}
				</div>

				{/* Scans Section */}
				<div>
					<h2 className="text-2xl font-bold text-white mb-4">Scan History</h2>
					{server.scans.length === 0 ? (
						<Card className="bg-slate-900/50 border-slate-700/50 p-8 text-center">
							<Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
							<p className="text-slate-400">No scans available yet</p>
						</Card>
					) : (
						<div className="space-y-4">
							{server.scans.map((scan, index) => (
								<Card
									key={index}
									className="bg-slate-900/50 border-slate-700/50 p-6"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<Clock className="w-5 h-5 text-blue-400" />
											<span className="text-white font-medium">
												Scan #{server.scans.length - index}
											</span>
										</div>
										<span className="text-slate-400">
											{formatDate(scan.date)}
										</span>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
