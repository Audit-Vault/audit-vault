import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { ConnectServer } from "./components/ConnectServer";
import { ProcessingScreen } from "./components/ProcessingScreen";
import { ExecutiveDashboard } from "./components/ExecutiveDashboard";
import { OrganizationDashboard } from "./components/OrganizationDashboard";
import { useCurrentUser } from "./components/hooks/useCurrentUser";

export type Screen =
	| "landing"
	| "auth"
	| "connect"
	| "processing"
	| "dashboard"
	| "home";

export interface AuditReport {
	score: number;
	riskLevel: "low" | "medium" | "high" | "critical";
	summary: string;
	issues: Array<{
		title: string;
		severity: "low" | "medium" | "high" | "critical";
		description: string;
		recommendation: string;
	}>;
	actionPlan: string[];
}

function App() {
	const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
	const [serverName, setServerName] = useState("");
	const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
	const [userToken, setUserToken] = useState("");

	// Assuming your hook returns { data, isLoading } or similar
	const { data: currUserData, isLoading } = useCurrentUser();

	// --- PERSISTENCE LOGIC ---
	useEffect(() => {
		// If we have user data and we are currently on a "logged out" screen,
		// move them into the app automatically.
		if (
			currUserData &&
			(currentScreen === "landing" || currentScreen === "auth")
		) {
			setCurrentScreen("home");
		}
	}, [currUserData]); // This fires whenever the user data object changes/loads

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				Loading...
			</div>
		);
	}
	// -------------------------

	const handleAuthComplete = (token: string) => {
		setUserToken(token);
		setCurrentScreen("home");
	};

	// ... rest of your handlers stay the same

	const renderScreen = () => {
		switch (currentScreen) {
			case "landing":
				return <LandingPage onGetStarted={() => setCurrentScreen("auth")} />;
			case "auth":
				return <AuthPage onAuthComplete={handleAuthComplete} />;
			case "home":
				return (
					<OrganizationDashboard
						onStartNewAudit={() => setCurrentScreen("connect")}
					/>
				);
			case "connect":
				return (
					<ConnectServer
						userToken={userToken}
						onServerConnected={(serverName: string) => {
							setServerName(serverName);
							setCurrentScreen("processing");
						}}
						onBack={() => setCurrentScreen("home")}
					/>
				);
			case "processing":
				return (
					<ProcessingScreen
						serverName={serverName}
						onComplete={(auditReport: AuditReport) => {
							setAuditReport(auditReport);
							setCurrentScreen("dashboard");
						}}
					/>
				);
			case "dashboard":
				return (
					<ExecutiveDashboard
						report={auditReport!}
						serverName={serverName}
						onBack={() => setCurrentScreen("home")}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
			{renderScreen()}
		</div>
	);
}

export default App;
