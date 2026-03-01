import { useNavigate } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";
import { Button } from "./ui/button";

export function MainHeader() {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/logout`, {
				method: "POST",
				credentials: "include"
			});
			localStorage.removeItem("userToken");
			navigate("/");
		} catch (error) {
			console.error("Error logging out:", error);
			// Still navigate away even if the API call fails
			localStorage.removeItem("userToken");
			navigate("/");
		}
	};

	return (
		<div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
			<div className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<a
						href="/"
						className="inline-flex items-center text-white text-lg font-bold"
					>
						<div className="flex items-center gap-3">
							<Shield className="w-8 h-8 text-blue-400" />
							<h1 className="text-2xl font-bold text-white">AuditVault</h1>
						</div>
					</a>
					<Button
						onClick={handleLogout}
						variant="ghost"
						className="text-slate-300 hover:text-white hover:bg-slate-800/50"
					>
						<LogOut className="w-4 h-4 mr-2" />
						Logout
					</Button>
				</div>
			</div>
		</div>
	);
}
