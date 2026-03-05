import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Server, Plus, AlertTriangle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MainHeader } from "./MainHeader";

interface ServerItem {
	id: string;
	name: string;
	totalScans: number;
	totalVulnerabilities: number;
	lastScan: string | null;
}

export function Dashboard() {
	const navigate = useNavigate();
	const [servers, setServers] = useState<ServerItem[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchServers();
	}, []);

	const fetchServers = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/api/data/servers`,
				{
					credentials: "include"
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch servers");
			}

			const data = await response.json();
			setServers(data.servers || []);
		} catch (err) {
			console.error("Error fetching servers:", err);
			setError("Failed to load servers");
		}
	};

	const getSeverityColor = (count: number) => {
		if (count === 0) return "text-green-400";
		if (count < 5) return "text-yellow-400";
		if (count < 10) return "text-orange-400";
		return "text-red-400";
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "Never";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	};

	return (
		<div style={{
			minHeight: "100vh",
			background: "#f5ebe0",
			color: "#444",
			fontFamily: "'DM Sans', system-ui, sans-serif"
		}}>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
				@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
				.dashboard-card { animation: fadeUp 0.5s ease both; }
				.server-card { 
					transition: all 0.2s; 
					cursor: pointer;
				}
				.server-card:hover { 
					transform: scale(1.02);
					box-shadow: 0 8px 24px rgba(0,0,0,0.1);
				}
				.add-server-btn:hover { 
					transform: scale(1.05); 
				}
			`}</style>

			<MainHeader />

			{/* Main Content */}
			<div style={{
				maxWidth: 1200,
				margin: "0 auto",
				padding: "80px 24px"
			}}>
				<div style={{ marginBottom: 32 }}>
					<h2 style={{
						fontFamily: "monospace",
						fontSize: 32,
						fontWeight: 700,
						color: "#444",
						marginBottom: 8
					}}>
						Your Servers
					</h2>
				</div>

				{error ? (
					<div style={{
						background: "rgba(240, 92, 110, 0.1)",
						border: "2px solid rgba(240, 92, 110, 0.3)",
						borderRadius: 16,
						padding: 24,
						textAlign: "center"
					}}>
						<AlertTriangle style={{
							width: 48,
							height: 48,
							color: "#dc2626",
							margin: "0 auto 12px"
						}} />
						<p style={{ color: "#dc2626", fontSize: 15 }}>{error}</p>
					</div>
				) : servers.length === 0 ? (
					<div className="dashboard-card" style={{
						border: "2px solid #d6ccc2",
						borderRadius: 20,
						padding: 48,
						textAlign: "center"
					}}>
						<Server style={{
							width: 64,
							height: 64,
							color: "#d5bdaf",
							margin: "0 auto 16px"
						}} />
						<h3 style={{
							fontSize: 22,
							fontWeight: 600,
							color: "#444",
							marginBottom: 8
						}}>
							No servers yet
						</h3>
						<p style={{
							fontSize: 15,
							color: "#888",
							marginBottom: 24
						}}>
							Get started by adding your first server to monitor
						</p>
						<button
							className="add-server-btn"
							onClick={() => navigate("/add-server")}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								padding: "12px 24px",
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
							<Plus style={{ width: 18, height: 18 }} />
							Add Server
						</button>
					</div>
				) : (
					<>
						<div style={{
							display: "flex",
							justifyContent: "flex-end",
							marginBottom: 24
						}}>
							<button
								className="add-server-btn"
								onClick={() => navigate("/add-server")}
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 8,
									padding: "12px 24px",
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
								<Plus style={{ width: 18, height: 18 }} />
								Add Server
							</button>
						</div>

						<div style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
							gap: 24
						}}>
							{servers.map(server => (
								<div
									key={server.id}
									className="server-card"
									onClick={() => navigate(`/server/${server.id}`)}
									style={{
										background: "#ffffffaa",
										border: "2px solid #d6ccc2",
										borderRadius: 16,
										padding: 24
									}}
								>
									<div style={{
										display: "flex",
										alignItems: "flex-start",
										justifyContent: "space-between",
										marginBottom: 20
									}}>
										<div style={{
											display: "flex",
											alignItems: "center",
											gap: 12
										}}>
											<div style={{
												padding: 10,
												background: "#f5ebe0",
												borderRadius: 10
											}}>
												<Server style={{
													width: 24,
													height: 24,
													color: "#6B625E"
												}} />
											</div>
											<div>
												<h3 style={{
													fontSize: 17,
													fontWeight: 600,
													color: "#444"
												}}>
													{server.name}
												</h3>
											</div>
										</div>
									</div>

									<div>
										<div style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											paddingTop: 12,
											paddingBottom: 12,
											borderTop: "1px solid #e8e3dd"
										}}>
											<span style={{
												color: "#888",
												fontSize: 14
											}}>
												Vulnerabilities
											</span>
											<span style={{
												fontWeight: 600,
												fontSize: 15,
												color: server.totalVulnerabilities === 0 ? "#10b981" :
													server.totalVulnerabilities < 5 ? "#f59e0b" :
													server.totalVulnerabilities < 10 ? "#f97316" : "#dc2626"
											}}>
												{server.totalVulnerabilities}
											</span>
										</div>

										<div style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											paddingTop: 12,
											paddingBottom: 12,
											borderTop: "1px solid #e8e3dd"
										}}>
											<span style={{
												color: "#888",
												fontSize: 14
											}}>
												Total Scans
											</span>
											<span style={{
												color: "#444",
												fontWeight: 600,
												fontSize: 15
											}}>
												{server.totalScans}
											</span>
										</div>

										<div style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											paddingTop: 12,
											paddingBottom: 12,
											borderTop: "1px solid #e8e3dd"
										}}>
											<span style={{
												color: "#888",
												fontSize: 14,
												display: "flex",
												alignItems: "center",
												gap: 8
											}}>
												<Clock style={{ width: 16, height: 16 }} />
												Last Scan
											</span>
											<span style={{
												color: "#666",
												fontSize: 14
											}}>
												{formatDate(server.lastScan)}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
