import { GoogleGenerativeAI } from "@google/generative-ai";

interface ScanData {
	filePermissions?: any;
	sshConfig?: any;
	openPorts?: any;
	users?: any;
	services?: any;
	hostname?: string;
	logs?: any;
}

interface Vulnerability {
	name: string;
	description: string;
	severity: string;
	data?: any;
}

export interface GeminiReport {
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
	remediationScript?: string;
}

export async function analyzeScanWithGemini(
	scanData: ScanData,
	vulnerabilities: Vulnerability[]
): Promise<GeminiReport> {
	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
	const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

	// Extract data from logs object if it exists, otherwise use direct fields
	const logsData = scanData.logs || {};
	const sshConfig = scanData.sshConfig || logsData.sshConfig || {};
	const openPorts = scanData.openPorts || logsData.openPorts || [];
	const services = scanData.services || logsData.services || [];
	const hostname = scanData.hostname || logsData.hostname || "Unknown";

	const prompt = `You are a cybersecurity expert. Analyze this server security scan data and return a JSON security report.

Server: ${hostname}

Security scan data:
File Permissions: ${JSON.stringify(scanData.filePermissions || {}, null, 2)}
SSH Configuration: ${JSON.stringify(sshConfig, null, 2)}
Open Network Ports: ${JSON.stringify(openPorts, null, 2)}
User Accounts: ${JSON.stringify(scanData.users || [], null, 2)}
Running Services: ${JSON.stringify(services, null, 2)}
Additional Logs: ${JSON.stringify(logsData, null, 2)}
Previously Detected Issues: ${JSON.stringify(vulnerabilities || [], null, 2)}

Analyze the following security aspects:
1. File permissions on sensitive files (/etc/shadow, /etc/sudoers, SSH keys, etc.)
2. SSH configuration (PermitRootLogin, PasswordAuthentication, etc.)
3. Open ports bound to 0.0.0.0 that could be exposed to the internet
4. User accounts with sudo access or unusual login shells
5. Running services that may be unnecessary or insecure
6. Any previously detected vulnerabilities

Return ONLY valid JSON (no markdown fences, no explanation) in this exact format:
{
  "score": <integer 0-100, higher is more secure>,
  "riskLevel": <"low"|"medium"|"high"|"critical">,
  "summary": "<2-3 sentence executive summary>",
  "issues": [
    {
      "title": "<short issue title>",
      "severity": <"low"|"medium"|"high"|"critical">,
      "description": "<what the issue is and why it matters>",
      "recommendation": "<specific actionable fix>"
    }
  ],
  remediationScript: "<bash script to automatically fix issues>",
  "actionPlan": ["<prioritized step 1>", "<step 2>", ...]
}`;

	const result = await model.generateContent(prompt);
	const text = result.response.text().trim();

	// Strip markdown code fences if Gemini wraps the response
	const jsonText = text
		.replace(/^```json?\n?/, "")
		.replace(/\n?```$/, "")
		.trim();

	return JSON.parse(jsonText) as GeminiReport;
}
