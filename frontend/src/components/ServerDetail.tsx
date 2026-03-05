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
	RefreshCw,
	Terminal
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
	report?: {
		score: number;
		riskLevel: string;
		summary: string;
		issues: Array<{
			title: string;
			severity: string;
			description: string;
			recommendation: string;
		}>;
		actionPlan: string[];
		remediationScript?: string;
	};
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
	low: { bg: "rgba(251, 191, 36, 0.1)", border: "rgba(251, 191, 36, 0.3)", text: "#f59e0b" },
	medium: { bg: "rgba(249, 115, 22, 0.1)", border: "rgba(249, 115, 22, 0.3)", text: "#f97316" },
	high: { bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.3)", text: "#dc2626" },
	critical: { bg: "rgba(168, 85, 247, 0.1)", border: "rgba(168, 85, 247, 0.3)", text: "#a855f7" }
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

	const handleExecuteRemediation = async (command: string) => {
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
						type: "execute_command",
						description: "Execute remediation script",
						data: { command }
					})
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				console.error("API Error:", response.status, errorData);
				throw new Error(errorData?.message || `Server returned ${response.status}`);
			}

			const data = await response.json();
			console.log("Execute command instruction created:", data);

			setInstructionMessage({
				type: "success",
				text: "Remediation script queued for execution! The agent will execute it shortly."
			});

			// Refresh instructions list
			fetchInstructions();

			// Clear success message after 5 seconds
			setTimeout(() => {
				setInstructionMessage(null);
			}, 5000);
		} catch (err) {
			console.error("Error creating execute instruction:", err);
			const errorMessage = err instanceof Error ? err.message : "Failed to queue remediation script. Please try again.";
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

	const getSeverityStyle = (severity: string) => {
		const normalized = severity.toLowerCase();
		return (
			severityColors[normalized as keyof typeof severityColors] ||
			severityColors.low
		);
	};

	if (loading) {
		return (
			<div style={{
				minHeight: "100vh",
				background: "#f5ebe0",
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			}}>
				<div style={{
					width: 48,
					height: 48,
					border: "3px solid #e8e3dd",
					borderTop: "3px solid #6B625E",
					borderRadius: "50%",
					animation: "spin 0.8s linear infinite"
				}}></div>
				<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
			</div>
		);
	}

	if (error || !server) {
		return (
			<div style={{
				minHeight: "100vh",
				background: "#f5ebe0",
				padding: 24,
				fontFamily: "'DM Sans', system-ui, sans-serif"
			}}>
				<div style={{
					maxWidth: 1200,
					margin: "0 auto"
				}}>
					<button
						onClick={() => navigate("/dashboard")}
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							padding: "8px 16px",
							borderRadius: 8,
							background: "transparent",
							border: "none",
							color: "#666",
							fontSize: 14,
							fontWeight: 600,
							cursor: "pointer",
							marginBottom: 24,
							fontFamily: "inherit"
						}}
					>
						<ArrowLeft style={{ width: 16, height: 16 }} />
						Back to Dashboard
					</button>
					<div style={{
						background: "rgba(240, 92, 110, 0.1)",
						border: "2px solid rgba(240, 92, 110, 0.3)",
						borderRadius: 16,
						padding: 48,
						textAlign: "center"
					}}>
						<AlertTriangle style={{
							width: 64,
							height: 64,
							color: "#dc2626",
							margin: "0 auto 16px"
						}} />
						<h3 style={{
							fontSize: 20,
							fontWeight: 600,
							color: "#444",
							marginBottom: 8
						}}>Error</h3>
						<p style={{ color: "#dc2626" }}>{error || "Server not found"}</p>
					</div>
				</div>
			</div>
		);
	}

	const healthScore =
		server.vulnerabilities.length === 0
			? 100
			: Math.max(0, 100 - server.vulnerabilities.length * 5);

	return (
		<div style={{
			minHeight: "100vh",
			background: "#f5ebe0",
			padding: 24,
			fontFamily: "'DM Sans', system-ui, sans-serif"
		}}>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
				@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
				@keyframes spin { to { transform: rotate(360deg); } }
				.action-btn { transition: all 0.2s; }
				.action-btn:hover { transform: scale(1.05); }
				.action-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
			`}</style>

			<div style={{
				maxWidth: 1200,
				margin: "0 auto"
			}}>
				{/* Header */}
				<div style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 32,
					flexWrap: "wrap",
					gap: 16
				}}>
					<button
						onClick={() => navigate("/dashboard")}
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							padding: "8px 16px",
							borderRadius: 8,
							background: "transparent",
							border: "none",
							color: "#666",
							fontSize: 14,
							fontWeight: 600,
							cursor: "pointer",
							fontFamily: "inherit"
						}}
					>
						<ArrowLeft style={{ width: 16, height: 16 }} />
						Back to Dashboard
					</button>
					<div style={{
						display: "flex",
						gap: 12
					}}>
						<button
							className="action-btn"
							onClick={handleTriggerScan}
							disabled={isCreatingInstruction}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								padding: "10px 20px",
								borderRadius: 12,
								background: "#10b981",
								border: "none",
								color: "#fff",
								fontSize: 14,
								fontWeight: 600,
								cursor: "pointer",
								fontFamily: "inherit"
							}}
						>
							{isCreatingInstruction ? (
								<>
									<div style={{
										width: 16,
										height: 16,
										border: "2px solid rgba(255,255,255,0.3)",
										borderTop: "2px solid #fff",
										borderRadius: "50%",
										animation: "spin 0.8s linear infinite"
									}}></div>
									Creating...
								</>
							) : (
								<>
									<RefreshCw style={{ width: 16, height: 16 }} />
									New Scan
								</>
							)}
						</button>
						<button
							className="action-btn"
							onClick={handleDownload}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								padding: "10px 20px",
								borderRadius: 12,
								background: "#d5bdaf",
								border: "none",
								color: "#fff",
								fontSize: 14,
								fontWeight: 600,
								cursor: "pointer",
								fontFamily: "inherit"
							}}
						>
							<Download style={{ width: 16, height: 16 }} />
							Download Report
						</button>
					</div>
				</div>

				{/* Instruction Message */}
				{instructionMessage && (
					<div style={{
						marginBottom: 24,
						padding: 16,
						borderRadius: 12,
						background: instructionMessage.type === "success"
							? "rgba(16, 185, 129, 0.1)"
							: "rgba(240, 92, 110, 0.1)",
						border: instructionMessage.type === "success"
							? "2px solid rgba(16, 185, 129, 0.3)"
							: "2px solid rgba(240, 92, 110, 0.3)"
					}}>
						<p style={{
							textAlign: "center",
							color: instructionMessage.type === "success" ? "#10b981" : "#dc2626"
						}}>
							{instructionMessage.text}
						</p>
					</div>
				)}

				{/* Server Header */}
				<div style={{ marginBottom: 32 }}>
					<div style={{
						display: "flex",
						alignItems: "center",
						gap: 12,
						marginBottom: 8
					}}>
						<Shield style={{ width: 32, height: 32, color: "#6B625E" }} />
						<h1 style={{
							fontSize: 30,
							fontWeight: 700,
							color: "#444",
							fontFamily: "monospace"
						}}>{server.name}</h1>
					</div>
					<p style={{
						fontSize: 14,
						color: "#888"
					}}>
						Server ID: {server._id} • Last updated:{" "}
						{formatDate(server.updatedAt)}
					</p>
				</div>

				{/* Stats Grid */}
				<div style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
					gap: 24,
					marginBottom: 32
				}}>
					<div style={{
						background: "#ffffffaa",
						border: "2px solid #d6ccc2",
						borderRadius: 16,
						padding: 24
					}}>
						<div style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between"
						}}>
							<div>
								<p style={{
									fontSize: 13,
									color: "#888",
									marginBottom: 8
								}}>Health Score</p>
								<p style={{
									fontSize: 32,
									fontWeight: 700,
									color: healthScore >= 80 ? "#10b981" : healthScore >= 60 ? "#f59e0b" : "#dc2626"
								}}>
									{healthScore}
								</p>
							</div>
							<CheckCircle2 style={{
								width: 48,
								height: 48,
								color: healthScore >= 80 ? "#10b981" : healthScore >= 60 ? "#f59e0b" : "#dc2626"
							}} />
						</div>
					</div>

					<div style={{
						background: "#ffffffaa",
						border: "2px solid #d6ccc2",
						borderRadius: 16,
						padding: 24
					}}>
						<div style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between"
						}}>
							<div>
								<p style={{
									fontSize: 13,
									color: "#888",
									marginBottom: 8
								}}>Vulnerabilities</p>
								<p style={{
									fontSize: 32,
									fontWeight: 700,
									color: server.vulnerabilities.length === 0 ? "#10b981" : "#dc2626"
								}}>
									{server.vulnerabilities.length}
								</p>
							</div>
							<AlertTriangle style={{
								width: 48,
								height: 48,
								color: server.vulnerabilities.length === 0 ? "#10b981" : "#dc2626"
							}} />
						</div>
					</div>

					<div style={{
						background: "#ffffffaa",
						border: "2px solid #d6ccc2",
						borderRadius: 16,
						padding: 24
					}}>
						<div style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between"
						}}>
							<div>
								<p style={{
									fontSize: 13,
									color: "#888",
									marginBottom: 8
								}}>Total Scans</p>
								<p style={{
									fontSize: 32,
									fontWeight: 700,
									color: "#6B625E"
								}}>
									{server.scans.length}
								</p>
							</div>
							<Server style={{
								width: 48,
								height: 48,
								color: "#6B625E"
							}} />
						</div>
					</div>
				</div>

				{/* Vulnerabilities Section */}
				<div style={{ marginBottom: 32 }}>
					<h2 style={{
						fontSize: 24,
						fontWeight: 700,
						color: "#444",
						marginBottom: 16,
						fontFamily: "monospace"
					}}>
						Vulnerabilities
					</h2>
					{server.vulnerabilities.length === 0 ? (
						<div style={{
							background: "rgba(16, 185, 129, 0.1)",
							border: "2px solid rgba(16, 185, 129, 0.3)",
							borderRadius: 16,
							padding: 32,
							textAlign: "center"
						}}>
							<CheckCircle2 style={{
								width: 48,
								height: 48,
								color: "#10b981",
								margin: "0 auto 12px"
							}} />
							<p style={{
								color: "#10b981",
								fontSize: 17
							}}>
								No vulnerabilities detected!
							</p>
						</div>
					) : (
						<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
							{server.vulnerabilities.map((vuln, index) => {
								const severityStyle = getSeverityStyle(vuln.severity);
								return (
									<div
										key={index}
										style={{
											background: severityStyle.bg,
											border: `2px solid ${severityStyle.border}`,
											borderRadius: 16,
											padding: 24
										}}
									>
										<div style={{
											display: "flex",
											alignItems: "flex-start",
											justifyContent: "space-between",
											marginBottom: 8
										}}>
											<h3 style={{
												fontSize: 18,
												fontWeight: 600,
												color: "#444"
											}}>{vuln.name}</h3>
											<span style={{
												padding: "4px 12px",
												borderRadius: 999,
												fontSize: 11,
												fontWeight: 600,
												textTransform: "uppercase",
												border: `2px solid ${severityStyle.border}`,
												color: severityStyle.text
											}}>
												{vuln.severity}
											</span>
										</div>
										<p style={{ color: "#666", fontSize: 14 }}>{vuln.description}</p>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Remediation Script Section */}
				{server.scans.length > 0 && server.scans[server.scans.length - 1].report?.remediationScript && (
					<div style={{ marginBottom: 32 }}>
						<h2 style={{
							fontSize: 24,
							fontWeight: 700,
							color: "#444",
							marginBottom: 16,
							fontFamily: "monospace"
						}}>
							Automated Remediation
						</h2>
						<div style={{
							background: "#ffffffaa",
							border: "2px solid #d6ccc2",
							borderRadius: 16,
							padding: 24
						}}>
							<div style={{
								display: "flex",
								alignItems: "flex-start",
								justifyContent: "space-between",
								marginBottom: 16,
								flexWrap: "wrap",
								gap: 16
							}}>
								<div style={{
									display: "flex",
									alignItems: "center",
									gap: 8
								}}>
									<Terminal style={{ width: 20, height: 20, color: "#10b981" }} />
									<h3 style={{
										fontSize: 17,
										fontWeight: 600,
										color: "#444"
									}}>
										Remediation Script
									</h3>
								</div>
								<button
									className="action-btn"
									onClick={() => handleExecuteRemediation(server.scans[server.scans.length - 1].report!.remediationScript!)}
									disabled={isCreatingInstruction}
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: 8,
										padding: "8px 16px",
										borderRadius: 10,
										background: "#10b981",
										border: "none",
										color: "#fff",
										fontSize: 14,
										fontWeight: 600,
										cursor: "pointer",
										fontFamily: "inherit"
									}}
								>
									{isCreatingInstruction ? (
										<>
											<div style={{
												width: 16,
												height: 16,
												border: "2px solid rgba(255,255,255,0.3)",
												borderTop: "2px solid #fff",
												borderRadius: "50%",
												animation: "spin 0.8s linear infinite"
											}}></div>
											Queueing...
										</>
									) : (
										<>
											<Terminal style={{ width: 16, height: 16 }} />
											Execute Script
										</>
									)}
								</button>
							</div>
							<div style={{
								background: "#2d3748",
								borderRadius: 12,
								padding: 16,
								overflowX: "auto"
							}}>
								<pre style={{
									fontSize: 13,
									color: "#68d391",
									fontFamily: "monospace",
									margin: 0
								}}>
									{server.scans[server.scans.length - 1].report!.remediationScript}
								</pre>
							</div>
							<p style={{
								fontSize: 13,
								color: "#888",
								marginTop: 16
							}}>
								⚠️ Review the script carefully before executing. This will create an instruction for the agent to run these commands on your server.
							</p>
						</div>
					</div>
				)}

				{/* Pending Instructions Section */}
				<div style={{ marginBottom: 32 }}>
					<h2 style={{
						fontSize: 24,
						fontWeight: 700,
						color: "#444",
						marginBottom: 16,
						fontFamily: "monospace"
					}}>
						Pending Instructions
					</h2>
					{loadingInstructions ? (
						<div style={{
							background: "#ffffffaa",
							border: "2px solid #d6ccc2",
							borderRadius: 16,
							padding: 32,
							textAlign: "center"
						}}>
							<div style={{
								width: 32,
								height: 32,
								border: "3px solid #e8e3dd",
								borderTop: "3px solid #6B625E",
								borderRadius: "50%",
								animation: "spin 0.8s linear infinite",
								margin: "0 auto"
							}}></div>
						</div>
					) : instructions.filter((inst) => inst.status === "pending").length === 0 ? (
						<div style={{
							background: "#ffffffaa",
							border: "2px solid #d6ccc2",
							borderRadius: 16,
							padding: 32,
							textAlign: "center"
						}}>
							<CheckCircle2 style={{
								width: 48,
								height: 48,
								color: "#d5bdaf",
								margin: "0 auto 12px"
							}} />
							<p style={{ color: "#888" }}>No pending instructions</p>
						</div>
					) : (
						<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
							{instructions
								.filter((inst) => inst.status === "pending")
								.map((instruction) => (
									<div
										key={instruction.id}
										style={{
											background: "rgba(59, 130, 246, 0.1)",
											border: "2px solid rgba(59, 130, 246, 0.3)",
											borderRadius: 16,
											padding: 24
										}}
									>
										<div style={{
											display: "flex",
											alignItems: "flex-start",
											justifyContent: "space-between",
											flexWrap: "wrap",
											gap: 16
										}}>
											<div style={{ flex: 1 }}>
												<div style={{
													display: "flex",
													alignItems: "center",
													gap: 8,
													marginBottom: 8
												}}>
													<RefreshCw style={{ width: 20, height: 20, color: "#3b82f6" }} />
													<h3 style={{
														fontSize: 17,
														fontWeight: 600,
														color: "#444"
													}}>
														{instruction.type.replace(/_/g, " ").toUpperCase()}
													</h3>
												</div>
												<p style={{
													color: "#666",
													marginBottom: 8,
													fontSize: 14
												}}>
													{instruction.description}
												</p>
												<p style={{
													color: "#888",
													fontSize: 13
												}}>
													Created: {formatDate(instruction.createdAt)}
												</p>
											</div>
											<span style={{
												padding: "4px 12px",
												borderRadius: 999,
												fontSize: 11,
												fontWeight: 600,
												textTransform: "uppercase",
												background: "rgba(251, 191, 36, 0.2)",
												color: "#f59e0b",
												border: "2px solid rgba(251, 191, 36, 0.3)"
											}}>
												Pending
											</span>
										</div>
									</div>
								))}
						</div>
					)}
				</div>

				{/* Scans Section */}
				<div>
					<h2 style={{
						fontSize: 24,
						fontWeight: 700,
						color: "#444",
						marginBottom: 16,
						fontFamily: "monospace"
					}}>Scan History</h2>
					{server.scans.length === 0 ? (
						<div style={{
							background: "#ffffffaa",
							border: "2px solid #d6ccc2",
							borderRadius: 16,
							padding: 32,
							textAlign: "center"
						}}>
							<Clock style={{
								width: 48,
								height: 48,
								color: "#d5bdaf",
								margin: "0 auto 12px"
							}} />
							<p style={{ color: "#888" }}>No scans available yet</p>
						</div>
					) : (
						<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
							{server.scans.map((scan, index) => (
								<div
									key={index}
									style={{
										background: "#fff",
										border: "2px solid #d6ccc2",
										borderRadius: 16,
										padding: 24
									}}
								>
									<div style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										flexWrap: "wrap",
										gap: 12
									}}>
										<div style={{
											display: "flex",
											alignItems: "center",
											gap: 12
										}}>
											<Clock style={{ width: 20, height: 20, color: "#6B625E" }} />
											<span style={{
												color: "#444",
												fontWeight: 600,
												fontSize: 15
											}}>
												Scan #{server.scans.length - index}
											</span>
										</div>
										<span style={{
											color: "#888",
											fontSize: 14
										}}>
											{formatDate(scan.date)}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
