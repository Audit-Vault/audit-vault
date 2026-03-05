# AuditVault
**Automated server security scanning for small businesses and non-technical teams**

AuditVault lets you scan any Linux server for common security vulnerabilities with speed — no security expertise required. Run a single command on your server, and AuditVault's AI-powered analysis will surface misconfigurations, explain each issue in plain language, and tell you exactly how to fix them.

---

## How It Works

```
1. Sign up → 2. Name your server → 3. Run one curl command → 4. View your report
```

1. **Sign up** with Google via the AuditVault dashboard.
2. **Register a server** — give it a name to generate a unique installation command.
3. **Run the command** on your server (requires root/sudo). The lightweight agent installs itself as a systemd service.
4. **View your report** — the agent collects security data, sends it to the backend, and Gemini AI returns a structured report with severity ratings and actionable remediations

The agent continues running in the background, polling for on-demand scan requests triggered from the dashboard.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│              React + TypeScript Dashboard                │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS (REST API)
┌────────────────────────▼────────────────────────────────┐
│                  AuditVault Backend                      │
│           Node.js / Express / TypeScript                 │
│           MongoDB  ·  Firebase Auth                      │
│           Gemini AI (vulnerability analysis)             │
└────────────────────────▲────────────────────────────────┘
                         │ HTTPS (chunked upload)
┌────────────────────────┴────────────────────────────────┐
│               AuditVault Agent (Python)                  │
│         Runs as a systemd service on target server       │
│         Zero external dependencies (stdlib only)         │
└─────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Firebase project with Google sign-in enabled
- Google Gemini API key

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, FIREBASE credentials, GEMINI_API_KEY
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_BACKEND_BASE_URL
npm run dev
```