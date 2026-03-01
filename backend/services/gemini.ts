import { GoogleGenerativeAI } from "@google/generative-ai";

interface ScanData {
	filePermissions?: any;
	logs?: any;
	users?: any;
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
}

export async function analyzeScanWithGemini(
	scanData: ScanData,
	vulnerabilities: Vulnerability[]
): Promise<GeminiReport> {
	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
	const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

	const prompt = `You are a cybersecurity expert. Analyze this server security scan data and return a JSON security report.

Server scan data:
File Permissions: ${JSON.stringify(scanData.filePermissions || {}, null, 2)}
System Logs: ${JSON.stringify(scanData.logs || {}, null, 2)}
Users: ${JSON.stringify(scanData.users || {}, null, 2)}
Detected Issues: ${JSON.stringify(vulnerabilities || [], null, 2)}

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
  "actionPlan": ["<prioritized step 1>", "<step 2>", ...]
}`;

	const result = await model.generateContent(prompt);
	const text = result.response.text().trim();

	// Strip markdown code fences if Gemini wraps the response
	const jsonText = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();

	return JSON.parse(jsonText) as GeminiReport;
}
