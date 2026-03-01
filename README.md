# AuditVault

> Automated server security scanning for small businesses and non-technical teams.

AuditVault lets you scan any Linux server for common security vulnerabilities in under a minute — no security expertise required. Run a single command on your server, and AuditVault's AI-powered analysis will surface misconfigurations, explain each issue in plain language, and tell you exactly how to fix them.

---

## How It Works

```
1. Sign up → 2. Name your server → 3. Run one curl command → 4. View your report
```

1. **Sign up** with Google via the AuditVault dashboard.
2. **Register a server** — give it a friendly name to generate a unique installation command.
3. **Run the command** on your server (requires root/sudo). The lightweight agent installs itself as a systemd service.
4. **View your report** — the agent collects security data, sends it to the backend, and Gemini AI returns a structured report with severity ratings and actionable remediations within ~30 seconds.

The agent continues running in the background, polling for on-demand scan requests triggered from the dashboard.

---

## What Gets Scanned

| Category | Details |
|---|---|
| **File Permissions** | Checks critical files like `/etc/shadow`, `/etc/sudoers`, `/root/.ssh/authorized_keys`, and `/etc/crontab` for insecure ownership or world-readable permissions |
| **SSH Configuration** | Parses `/etc/ssh/sshd_config` for dangerous settings: root login enabled, password authentication, empty passwords, weak `MaxAuthTries` |
| **Open Ports** | Lists all TCP/UDP ports currently listening, flagging services bound to `0.0.0.0` (internet-reachable) and high-risk ports like 3306, 5432, 6379, 27017 |
| **User Accounts** | Enumerates all accounts with interactive login shells and flags which users have `sudo` privileges |
| **Running Services** | Lists all active systemd services to identify unnecessary attack surface (e.g. unused FTP or Telnet daemons) |

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

## Tech Stack

### Frontend
- **React 18** + **TypeScript** — component-based UI
- **Vite** — fast dev server and build tooling
- **Tailwind CSS** + **shadcn/ui** — utility-first styling with accessible component primitives
- **Recharts** — vulnerability trend charts and risk score visualizations
- **React Router** — client-side routing
- **TanStack Query** — server state management and polling

### Backend
- **Node.js** + **Express** + **TypeScript** — REST API server
- **MongoDB** + **Mongoose** — stores servers, scan sessions, and audit reports
- **Firebase Admin SDK** — Google OAuth token verification and session management
- **Google Gemini API** — AI-powered analysis of raw scan data into structured vulnerability reports

### Agent
- **Python 3** (standard library only — no pip install required) — collects security data on the target server
- **systemd** — runs the agent as a persistent background service, enabling on-demand scans from the dashboard
- Chunked upload protocol: `initialize → upload parts → finalize` to support large payloads reliably

---

## Project Structure

```
audit-vault/
├── frontend/          # React + Vite application
│   └── src/
│       ├── components/    # Page and UI components
│       ├── types.ts       # Shared TypeScript interfaces (AuditReport, etc.)
│       └── App.tsx        # Route definitions
│
├── backend/           # Express API server
│   ├── controllers/       # Request handlers (auth, data upload, instructions)
│   ├── models/            # Mongoose schemas (User, Server, Scan)
│   ├── routes/            # Route declarations
│   ├── middleware/        # Auth middleware (isAuthenticated)
│   ├── services/          # Gemini AI integration
│   └── server.ts          # App entry point
│
└── agent/             # Target server agent
    ├── agent.py           # Security data collection + backend submission
    └── install.sh         # One-line installer (installs Python, registers systemd service)
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

### Agent (on a Linux target server)

The installer is distributed as a one-line curl command generated by the dashboard. Internally it:

1. Installs Python 3 via `apt` or `dnf`
2. Downloads `agent.py` to `/usr/bin/auditvault-agent`
3. Writes the server's unique ID to `/var/auditvault/server-id`
4. Registers and starts the `auditvault-agent` systemd service

To run the agent manually (for development/testing):

```bash
python3 agent/agent.py <server-id>
```

---

## Security & Privacy

- The agent collects **configuration metadata only** — it never reads file contents, captures passwords, or exfiltrates application data.
- All communication between the agent and backend uses **HTTPS**.
- Dashboard access is protected by **Google OAuth** via Firebase; all sensitive API endpoints require a valid session token.
- The agent runs as **root** solely to read protected system files (e.g. `/etc/shadow` permissions). It makes no changes to your server.

---

## Vulnerability Report Format

Each scan produces a structured `AuditReport`:

```typescript
{
  score: number;                // 0–100 security score
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  summary: string;              // Plain-language overview
  issues: Array<{
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;        // What the issue is and why it matters
    recommendation: string;     // Exact steps to remediate
  }>;
  actionPlan: string[];         // Prioritized remediation checklist
}
```
