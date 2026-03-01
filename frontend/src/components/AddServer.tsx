import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Server, Copy, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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

	// 1. Define the mutation at the top level of your component
	const { mutate } = useMutation({
		mutationFn: async () => {
			const res = await axios.post(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/api/instructions/${serverId}`,
				{},
				{ withCredentials: true }
			);
			return res.data;
		},
		onSuccess: () => {
			navigate("/dashboard");
		},
		onError: error => {
			console.error("Mutation failed:", error);
		}
	});

	// 2. Use the mutate function inside your event handler
	const handleContinue = () => {
		mutate();
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
			<div className="w-full max-w-3xl">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl mb-6">
						<Server className="w-8 h-8 text-blue-400" />
					</div>
					<h2 className="text-4xl font-bold text-white mb-4">
						Add Your Server
					</h2>
					<p className="text-lg text-slate-400 max-w-xl mx-auto">
						{showInstructions
							? "Install the AuditVault agent on your server"
							: "Name your server to get started"}
					</p>
				</div>

				{/* Main Card */}
				<div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
					{!showInstructions ? (
						<>
							{/* Server Name Input */}
							<div className="space-y-2 mb-8">
								<Label htmlFor="serverName" className="text-slate-300 text-lg">
									Server Name
								</Label>
								<Input
									id="serverName"
									type="text"
									placeholder="e.g., production-web-01"
									value={serverName}
									onChange={e => setServerName(e.target.value)}
									className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 text-lg py-6"
									onKeyDown={e => {
										if (e.key === "Enter" && serverName.trim()) {
											handleGenerateCommand();
										}
									}}
								/>
							</div>

							{/* Error Message */}
							{error && (
								<div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
									{error}
								</div>
							)}

							<Button
								onClick={handleGenerateCommand}
								disabled={!serverName.trim() || loading}
								className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-6 text-lg rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
							>
								{loading ? "Registering..." : "Continue"}
								{!loading && (
									<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
								)}
							</Button>
						</>
					) : (
						<>
							{/* Server Name Display */}
							<div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
								<p className="text-slate-400 text-sm mb-1">Server Name</p>
								<p className="text-white text-lg font-semibold">{serverName}</p>
							</div>

							{/* Curl Command */}
							<div className="space-y-2 mb-6">
								<Label className="text-slate-300 text-lg">
									Installation Command
								</Label>
								<div className="relative">
									<div className="bg-slate-950 border border-slate-700/50 rounded-xl p-4 pr-14 overflow-x-auto">
										<code className="text-green-400 font-mono text-sm break-all">
											{curlCommand}
										</code>
									</div>
									<Button
										onClick={handleCopy}
										className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
										size="sm"
									>
										{copied ? (
											<>
												<Check className="w-4 h-4 mr-1" />
												Copied
											</>
										) : (
											<>
												<Copy className="w-4 h-4 mr-1" />
												Copy
											</>
										)}
									</Button>
								</div>
							</div>

							{/* Instructions */}
							<div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
								<h3 className="text-white font-semibold mb-3 flex items-center gap-2">
									<span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">
										1
									</span>
									Access you server
								</h3>
								<h3 className="text-white font-semibold mb-3 flex items-center gap-2">
									<span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">
										2
									</span>
									Paste and run the command above
								</h3>
								<h3 className="text-white font-semibold flex items-center gap-2">
									<span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">
										3
									</span>
									The agent will automatically report to AuditVault
								</h3>
							</div>

							{/* Continue Button */}
							<Button
								onClick={handleContinue}
								className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-6 text-lg rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 group"
							>
								Done
								<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Button>
						</>
					)}
				</div>

				{/* Info Note */}
				<div className="mt-6 text-center">
					<p className="text-sm text-slate-500">
						The agent is read-only and makes no changes to your server
					</p>
				</div>

				{/* Back Button */}
				<div className="mt-6">
					<Button
						onClick={() => navigate("/dashboard")}
						variant="ghost"
						className="w-full text-slate-300 hover:text-white hover:bg-slate-800/50"
					>
						<ArrowLeft className="mr-2 w-5 h-5" />
						Back to Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
}
