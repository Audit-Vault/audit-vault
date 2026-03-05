import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function AddServer() {
	const navigate = useNavigate();
	const [serverName, setServerName] = useState("");
	const [serverId, setServerId] = useState("");
	const [copied, setCopied] = useState(false);
	const [showInstructions, setShowInstructions] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const curlCommand = `curl -sL https://nextcloud.hnasheralneam.dev/index.php/s/install-auditvault/download | bash -s -- ${serverId}`;

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(curlCommand);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			const textArea = document.createElement("textarea");
			textArea.value = curlCommand;
			textArea.style.position = "fixed";
			textArea.style.left = "-999999px";
			textArea.style.top = "-999999px";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				document.execCommand("copy");
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch (err2) {
				console.error("Failed to copy text:", err2);
				alert(
					"Unable to copy automatically. Please manually select and copy the command."
				);
			}
			document.body.removeChild(textArea);
		}
	};

	const handleGenerateCommand = async () => {
		if (serverName.trim()) {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/data/register-server`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						credentials: "include",
						body: JSON.stringify({ serverName: serverName.trim() })
					}
				);

				if (!response.ok) {
					throw new Error("Failed to register server");
				}

				const data = await response.json();
				setServerId(data.serverId);
				setShowInstructions(true);
			} catch (err) {
				console.error("Error registering server:", err);
				setError("Failed to register server. Please try again.");
			} finally {
				setLoading(false);
			}
		}
	};

	const handleContinue = () => {
		navigate("/dashboard");
	};

	return (
		<div style={{
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: 24,
			background: "#f5ebe0",
			fontFamily: "'DM Sans', system-ui, sans-serif"
		}}>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
				@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
				.add-server-card { animation: fadeUp 0.5s ease both; }
				.continue-btn:hover { transform: scale(1.02); }
				.continue-btn:active { transform: translateY(0); }
				.continue-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
				.back-btn:hover { opacity: 0.9; }
			`}</style>

			<div className="add-server-card" style={{ width: "100%", maxWidth: 520 }}>
				{/* Header */}
				<div style={{ textAlign: "center", marginBottom: 36 }}>
					<h2 style={{
						fontFamily: "monospace",
						fontSize: 32,
						fontWeight: 800,
						color: "#444",
						marginBottom: 12
					}}>
						Add Your Server
					</h2>
					<p style={{
						fontSize: 15,
						color: "#64748b",
						lineHeight: 1.6
					}}>
						{showInstructions
							? "Install the AuditVault agent on your server"
							: "Name your server to get started"}
					</p>
				</div>

				{/* Main Card */}
				<div style={{
					border: "2px solid #d6ccc2",
					borderRadius: 20,
					padding: "36px 32px"
				}}>
					{!showInstructions ? (
						<>
							{/* Server Name Input */}
							<div style={{ marginBottom: 32 }}>
								<Label htmlFor="serverName" style={{
									display: "block",
									marginBottom: 8,
									fontSize: 15,
									fontWeight: 600,
									color: "#444"
								}}>
									Server Name
								</Label>
								<Input
									id="serverName"
									type="text"
									placeholder="e.g., production-web-01"
									value={serverName}
									onChange={e => setServerName(e.target.value)}
									style={{
										width: "100%",
										padding: "12px 16px",
										borderRadius: 12,
										border: "2px solid #d6ccc2",
										fontSize: 15,
										color: "#444",
										background: "#fff",
										outline: "none",
										transition: "all 0.2s"
									}}
									onKeyDown={e => {
										if (e.key === "Enter" && serverName.trim()) {
											handleGenerateCommand();
										}
									}}
								/>
							</div>

							{/* Error Message */}
							{error && (
								<div style={{
									marginBottom: 20,
									padding: "10px 14px",
									borderRadius: 8,
									background: "rgba(240,92,110,0.1)",
									border: "1px solid rgba(240,92,110,0.3)",
									color: "#dc2626",
									fontSize: 13
								}}>
									{error}
								</div>
							)}

							<button
								className="continue-btn"
								onClick={handleGenerateCommand}
								disabled={!serverName.trim() || loading}
								style={{
									width: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: 8,
									padding: "14px 20px",
									borderRadius: 12,
									background: "#d5bdaf",
									border: "none",
									color: "#fff",
									fontSize: 15,
									fontWeight: 600,
									cursor: "pointer",
									transition: "all 0.2s",
									fontFamily: "inherit",
									opacity: (!serverName.trim() || loading) ? 0.6 : 1
								}}
							>
								{loading ? "Registering..." : "Continue"}
								{!loading && <ArrowRight style={{ width: 20, height: 20 }} />}
							</button>
						</>
					) : (
						<>
							{/* Server Name Display */}
							<div style={{
								marginBottom: 24,
								padding: 16,
								background: "#f5ebe0",
								border: "2px solid #d6ccc2",
								borderRadius: 12
							}}>
								<p style={{
									fontSize: 13,
									color: "#64748b",
									marginBottom: 4
								}}>Server Name</p>
								<p style={{
									fontSize: 17,
									color: "#444",
									fontWeight: 600
								}}>{serverName}</p>
							</div>

							{/* Curl Command */}
							<div style={{ marginBottom: 24 }}>
								<Label style={{
									display: "block",
									marginBottom: 8,
									fontSize: 15,
									fontWeight: 600,
									color: "#444"
								}}>
									Installation Command
								</Label>
								<div style={{ position: "relative" }}>
									<div style={{
										background: "#2d3748",
										border: "2px solid #d6ccc2",
										borderRadius: 12,
										padding: 16,
										paddingRight: 60,
										overflowX: "auto"
									}}>
										<code style={{
											color: "#68d391",
											fontFamily: "monospace",
											fontSize: 13,
											wordBreak: "break-all"
										}}>
											{curlCommand}
										</code>
									</div>
									<button
										onClick={handleCopy}
										style={{
											position: "absolute",
											right: 8,
											top: "50%",
											transform: "translateY(-50%)",
											display: "flex",
											alignItems: "center",
											gap: 4,
											padding: "8px 12px",
											background: "#d5bdaf",
											border: "none",
											borderRadius: 8,
											color: "#fff",
											fontSize: 13,
											fontWeight: 600,
											cursor: "pointer",
											transition: "all 0.2s"
										}}
									>
										{copied ? (
											<>
												<Check style={{ width: 16, height: 16 }} />
												Copied
											</>
										) : (
											<>
												<Copy style={{ width: 16, height: 16 }} />
												Copy
											</>
										)}
									</button>
								</div>
							</div>

							{/* Instructions */}
							<div style={{
								background: "#e8f4f8",
								border: "2px solid #b3d9e6",
								borderRadius: 12,
								padding: 24,
								marginBottom: 32
							}}>
								<h3 style={{
									color: "#444",
									fontWeight: 600,
									marginBottom: 12,
									display: "flex",
									alignItems: "center",
									gap: 8,
									fontSize: 14
								}}>
									<span style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: 24,
										height: 24,
										background: "#6B625E",
										color: "#fff",
										borderRadius: "50%",
										fontSize: 12
									}}>
										1
									</span>
									Access your server
								</h3>
								<h3 style={{
									color: "#444",
									fontWeight: 600,
									marginBottom: 12,
									display: "flex",
									alignItems: "center",
									gap: 8,
									fontSize: 14
								}}>
									<span style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: 24,
										height: 24,
										background: "#6B625E",
										color: "#fff",
										borderRadius: "50%",
										fontSize: 12
									}}>
										2
									</span>
									Paste and run the command above
								</h3>
								<h3 style={{
									color: "#444",
									fontWeight: 600,
									display: "flex",
									alignItems: "center",
									gap: 8,
									fontSize: 14
								}}>
									<span style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: 24,
										height: 24,
										background: "#6B625E",
										color: "#fff",
										borderRadius: "50%",
										fontSize: 12
									}}>
										3
									</span>
									The agent will automatically report to AuditVault
								</h3>
							</div>

							{/* Continue Button */}
							<button
								className="continue-btn"
								onClick={handleContinue}
								style={{
									width: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: 8,
									padding: "14px 20px",
									borderRadius: 12,
									background: "#d5bdaf",
									border: "none",
									color: "#fff",
									fontSize: 15,
									fontWeight: 600,
									cursor: "pointer",
									transition: "all 0.2s",
									fontFamily: "inherit"
								}}
							>
								Done
								<ArrowRight style={{ width: 20, height: 20 }} />
							</button>
						</>
					)}
				</div>

				{/* Back Button */}
				<div style={{ marginTop: 24, textAlign: "center" }}>
					<button
						className="back-btn"
						onClick={() => navigate("/dashboard")}
						style={{
							padding: "12px 24px",
							borderRadius: 12,
							fontSize: 15,
							fontWeight: 600,
							background: "#d5bdaf",
							border: "none",
							color: "#fff",
							cursor: "pointer",
							transition: "all 0.2s",
							fontFamily: "inherit",
							display: "inline-flex",
							alignItems: "center",
							gap: 8
						}}
					>
						<ArrowLeft style={{ width: 20, height: 20 }} />
						Back to Dashboard
					</button>
				</div>
			</div>
		</div>
	);
}
