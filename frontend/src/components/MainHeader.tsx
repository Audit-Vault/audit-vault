import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
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
		<nav style={{
          padding:  "20px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 50,
          background: "#e3d5ca",
			 color: "#fff"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 36, height: 36 }}>
              <div style={{ position: "relative", width: 36, height: 36, background: "linear-gradient(135deg, #6B625E, #67493c)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
                <Shield />
              </div>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 26, fontWeight: 800, color: "#6B625E", }}>
              AuditVault
            </span>
          </div>
			<Button
				onClick={handleLogout}
				variant="ghost"
				style={{
				padding: "20px 22px", borderRadius: 9, fontSize: 14, fontWeight: 600,
			background: "#d5bdaf",
			border: "solid 2px #f5ebe0", color: "#fff", cursor: "pointer",
			transition: "all 0.2s",
			fontFamily: "inherit",
				}}
			>
				Logout
			</Button>
        </nav>
	);
}




// <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
// 	<div className="container mx-auto px-6 py-4">
// 		<div className="flex items-center justify-between">
// 			<a
// 				href="/"
// 				className="inline-flex items-center text-white text-lg font-bold"
// 			>
// 				<div className="flex items-center gap-3">
// 					<Shield className="w-8 h-8 text-blue-400" />
// 					<h1 className="text-2xl font-bold text-white">AuditVault</h1>
// 				</div>
// 			</a>

// 		</div>
// 	</div>
// </div>
