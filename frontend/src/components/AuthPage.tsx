import { useState } from "react";
import useGoogleAuth from "./hooks/useGoogleAuth";

const ShieldIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		style={{ width: "100%", height: "100%" }}
	>
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
	</svg>
);

const GoogleIcon = () => (
	<svg viewBox="0 0 24 24" style={{ width: 20, height: 20, flexShrink: 0 }}>
		<path
			fill="#4285F4"
			d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
		/>
		<path
			fill="#34A853"
			d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
		/>
		<path
			fill="#FBBC05"
			d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
		/>
		<path
			fill="#EA4335"
			d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
		/>
	</svg>
);

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
interface AuthPageProps {
	onAuthComplete: (token: string) => void;
}

export function AuthPage({ onAuthComplete }: AuthPageProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const { googleSignInMutation } = useGoogleAuth();

	const handleGoogleSignIn = async () => {
		setLoading(true);
		setError("");
		try {
			const token = await googleSignInMutation();
			// Authentication successful, call onAuthComplete if provided
			if (onAuthComplete && token) {
				onAuthComplete(token);
			}
		} catch (err: any) {
			console.error("Authentication error:", err);
			setError(err.message || "Failed to sign in. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 24,
				background:
					"linear-gradient(135deg, #020818 0%, #0c1325 50%, #050d1f 100%)",
				fontFamily: "'DM Sans', system-ui, sans-serif"
			}}
		>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .auth-card { animation: fadeUp 0.5s ease both; }
        .google-btn:hover { background: rgba(255,255,255,0.1) !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important; }
        .google-btn:active { transform: translateY(0); }
        .google-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
      `}</style>

			<div className="auth-card" style={{ width: "100%", maxWidth: 420 }}>
				{/* Logo */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 12,
						marginBottom: 36
					}}
				>
					<div style={{ position: "relative", width: 44, height: 44 }}>
						<div
							style={{
								position: "absolute",
								inset: 0,
								background: "#38bdf8",
								borderRadius: 11,
								filter: "blur(10px)",
								opacity: 0.5,
								animation: "pulse-glow 3s ease-in-out infinite"
							}}
						/>
						<div
							style={{
								position: "relative",
								width: 44,
								height: 44,
								background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
								borderRadius: 11,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								padding: 10,
								color: "#fff"
							}}
						>
							<ShieldIcon />
						</div>
					</div>
					<span
						style={{
							fontFamily: "'Syne', sans-serif",
							fontSize: 26,
							fontWeight: 800,
							background: "linear-gradient(90deg, #7dd3fc, #38bdf8)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent"
						}}
					>
						AuditVault
					</span>
				</div>

				{/* Card */}
				<div
					style={{
						background: "rgba(15, 23, 42, 0.7)",
						backdropFilter: "blur(16px)",
						border: "1px solid rgba(255,255,255,0.08)",
						borderRadius: 20,
						padding: "36px 32px",
						boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
					}}
				>
					<h2
						style={{
							fontFamily: "'Syne', sans-serif",
							fontSize: 22,
							fontWeight: 800,
							color: "#f1f5f9",
							textAlign: "center",
							marginBottom: 8
						}}
					>
						Welcome to AuditVault
					</h2>
					<p
						style={{
							fontSize: 14,
							color: "#64748b",
							textAlign: "center",
							marginBottom: 32,
							lineHeight: 1.6
						}}
					>
						Sign in to run security audits on your servers and get AI-powered
						reports.
					</p>

					{/* Google Button */}
					<button
						className="google-btn"
						onClick={handleGoogleSignIn}
						disabled={loading}
						style={{
							width: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 12,
							padding: "14px 20px",
							borderRadius: 12,
							background: "rgba(255,255,255,0.06)",
							border: "1px solid rgba(255,255,255,0.12)",
							color: "#f1f5f9",
							fontSize: 15,
							fontWeight: 600,
							cursor: "pointer",
							transition: "all 0.2s",
							boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
							fontFamily: "inherit"
						}}
					>
						{loading ? (
							<>
								<div
									style={{
										width: 20,
										height: 20,
										borderRadius: "50%",
										border: "2px solid rgba(255,255,255,0.2)",
										borderTopColor: "#38bdf8",
										animation: "spin 0.7s linear infinite",
										flexShrink: 0
									}}
								/>
								<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
								Signing in...
							</>
						) : (
							<>
								<GoogleIcon />
								Continue with Google
							</>
						)}
					</button>

					{/* Error */}
					{error && (
						<div
							style={{
								marginTop: 16,
								padding: "10px 14px",
								borderRadius: 8,
								background: "rgba(240,92,110,0.1)",
								border: "1px solid rgba(240,92,110,0.3)",
								color: "#fca5a5",
								fontSize: 13,
								textAlign: "center"
							}}
						>
							{error}
						</div>
					)}

					{/* Divider */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 12,
							margin: "24px 0",
							color: "#334155"
						}}
					>
						<div
							style={{
								flex: 1,
								height: 1,
								background: "rgba(255,255,255,0.06)"
							}}
						/>
						<span
							style={{ fontSize: 12, color: "#475569", whiteSpace: "nowrap" }}
						>
							what you get
						</span>
						<div
							style={{
								flex: 1,
								height: 1,
								background: "rgba(255,255,255,0.06)"
							}}
						/>
					</div>

					{/* Benefits */}
					{[
						"AI-powered plain-English security reports",
						"One-command server agent deployment",
						"Risk scores & prioritized action plans"
					].map((benefit, i) => (
						<div
							key={i}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 10,
								marginBottom: i < 2 ? 10 : 0
							}}
						>
							<div
								style={{
									width: 20,
									height: 20,
									borderRadius: "50%",
									flexShrink: 0,
									background: "rgba(56,189,248,0.15)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 11,
									color: "#38bdf8",
									fontWeight: 700
								}}
							>
								✓
							</div>
							<span style={{ fontSize: 13, color: "#94a3b8" }}>{benefit}</span>
						</div>
					))}
				</div>

				{/* Footer note */}
				<p
					style={{
						textAlign: "center",
						fontSize: 12,
						color: "#334155",
						marginTop: 20,
						lineHeight: 1.6
					}}
				>
					By signing in you agree to our{" "}
					<span style={{ color: "#38bdf8", cursor: "pointer" }}>
						Terms of Service
					</span>{" "}
					and{" "}
					<span style={{ color: "#38bdf8", cursor: "pointer" }}>
						Privacy Policy
					</span>
				</p>
			</div>
		</div>
	);
}
