#!/usr/bin/python

#                        _ _ ___      __         _ _                              _
#         /\            | (_) \ \    / /        | | |       /\                   | |
#        /  \  _   _  __| |_| |\ \  / /_ _ _   _| | |_     /  \   __ _  ___ _ __ | |_
#       / /\ \| | | |/ _` | | __\ \/ / _` | | | | | __|   / /\ \ / _` |/ _ \ '_ \| __|
#      / ____ \ |_| | (_| | | |_ \  / (_| | |_| | | |_   / ____ \ (_| |  __/ | | | |_
#     /_/    \_\__,_|\__,_|_|\__| \/ \__,_|\__,_|_|\__| /_/    \_\__, |\___|_| |_|\__|
#                                                                 __/ |
#                                                                |___/

"""
Audit Vault Agent - Server Security Scanner

Collects security-related data from a Linux server and sends it to the Audit
Vault backend for AI-powered analysis. Data collected includes:

  - File permissions on critical system files (/etc/shadow, /etc/sudoers, etc.)
  - SSH server configuration (/etc/ssh/sshd_config)
  - Open network ports and listening services (via ss)
  - System user accounts that have a real login shell
  - Running systemd services

The collected data is sent as a single JSON POST request to the backend. The
backend saves it to MongoDB, triggers Gemini AI analysis, and stores the
resulting security audit report. The frontend polls for the report.

No third-party libraries required — only Python standard library.

Configuration (in priority order):
  1. Command-line argument:   python3 agent.py <token>
  2. Environment variable:    AUDIT_VAULT_TOKEN=avt_xxx python3 agent.py
  3. Config file:             /var/auditvault/config.json  { "token": "avt_xxx" }
"""

import json
import os
import pwd
import grp
import subprocess
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime, UTC
from pathlib import Path

# ---------------------------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------------------------

# Backend API URL — override with AUDIT_VAULT_SERVER env variable
BACKEND_URL = os.getenv("AUDIT_VAULT_SERVER", "https://backend.auditvault.tech")

# Path where the installer stores the user token on first run
CONFIG_FILE = "/var/auditvault/server-id"

# How often it checks for new scans/commands
POLL_INTERVAL = int(os.getenv("AUDIT_VAULT_POLL_INTERVAL", "30"))  # every 30 seconds

# Key used to identify this server with the backend (loaded at runtime)
SERVER_ID = None

def load_token():
    # 1. CLI argument
    if len(sys.argv) > 1:
        return sys.argv[1]

    # 2. Environment variable
    if os.getenv("AUDIT_VAULT_TOKEN"):
        return os.getenv("AUDIT_VAULT_TOKEN")

    # 3. Plain text file (Simplified)
    try:
        with open(CONFIG_FILE, "r") as f:
            return f.read().strip() # Just read the string and trim whitespace
    except OSError:
        pass

    return None


# ---------------------------------------------------------------------------
# DATA COLLECTION
# ---------------------------------------------------------------------------

def collect_file_permissions():
    """
    Stat a list of security-sensitive files and return their metadata.

    These files are common targets in privilege escalation and lateral movement
    attacks, so their permissions and ownership matter a lot:

      /etc/shadow           — hashed passwords (should be root:shadow 640)
      /etc/sudoers          — sudo rules (should be root:root 440)
      /etc/ssh/sshd_config  — SSH daemon settings
      /root/.ssh/authorized_keys — root SSH keys
      /etc/passwd           — user account list (world-readable is normal)
      /etc/group            — group definitions
      /etc/crontab          — system-wide cron jobs
      /etc/hosts.allow/deny — TCP wrapper rules

    Returns a list of dicts, one per file that exists.
    """
    results = []

    critical_files = [
        "/etc/ssh/sshd_config",
        "/etc/passwd",
        "/etc/shadow",
        "/etc/group",
        "/etc/sudoers",
        "/root/.ssh/authorized_keys",
        "/etc/crontab",
        "/etc/hosts.allow",
        "/etc/hosts.deny",
    ]

    for path in critical_files:
        try:
            p = Path(path)
            if not p.exists():
                continue

            s = p.stat()
            results.append({
                "path": str(p),
                # Last 4 octal digits, e.g. "0644"
                "permissions": oct(s.st_mode)[-4:],
                # Resolve numeric UID/GID to names
                "owner": pwd.getpwuid(s.st_uid).pw_name,
                "group": grp.getgrgid(s.st_gid).gr_name,
                "size": s.st_size,
                "modified": datetime.fromtimestamp(s.st_mtime).isoformat(),
            })
        except (OSError, KeyError, PermissionError) as e:
            # Not fatal — log and move on
            print(f"  [!] Could not stat {path}: {e}", file=sys.stderr)

    return results


def collect_ssh_config():
    """
    Parse /etc/ssh/sshd_config into a key-value dict.

    Skips blank lines and comments. Key security settings to look for:

      PermitRootLogin       — should be "no"
      PasswordAuthentication — should be "no" (force key-based auth)
      Port                  — non-standard port reduces automated scans
      X11Forwarding         — should be "no" unless needed
      PermitEmptyPasswords  — must be "no"
      MaxAuthTries          — lower values reduce brute-force risk

    Returns a dict, or an empty dict if the file is unreadable.
    """
    config = {}
    config_path = "/etc/ssh/sshd_config"

    try:
        with open(config_path, "r") as f:
            for line in f:
                line = line.strip()
                # Skip comments and blank lines
                if not line or line.startswith("#"):
                    continue
                # Split into key and value on first whitespace
                parts = line.split(None, 1)
                if len(parts) == 2:
                    config[parts[0]] = parts[1]
    except (OSError, PermissionError) as e:
        print(f"  [!] Could not read SSH config: {e}", file=sys.stderr)

    return config


def collect_open_ports():
    """
    List all TCP/UDP ports currently listening for connections.

    Uses `ss -tuln` (socket statistics), the modern replacement for netstat:
      -t  TCP sockets
      -u  UDP sockets
      -l  listening sockets only
      -n  numeric output (don't resolve port names)

    Key things Gemini looks for:
      - Ports bound to 0.0.0.0 are reachable from the internet
      - Common risky exposed ports: 3306 (MySQL), 5432 (Postgres),
        6379 (Redis), 27017 (MongoDB), 8080 (admin UIs)
      - Port 22 on 0.0.0.0 is common but can indicate SSH hardening gaps

    Returns a list of dicts with protocol, state, and local address.
    """
    ports = []

    try:
        result = subprocess.run(
            ["ss", "-tuln"],
            capture_output=True,
            text=True,
            timeout=10,
        )
        # First line is a header — skip it
        for line in result.stdout.strip().split("\n")[1:]:
            parts = line.split()
            if len(parts) >= 5:
                ports.append({
                    "protocol": parts[0],      # tcp / udp
                    "state": parts[1],         # LISTEN / UNCONN
                    "local_address": parts[4], # e.g. 0.0.0.0:22
                })
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        print(f"  [!] Could not read open ports: {e}", file=sys.stderr)

    return ports


def collect_users():
    """
    Enumerate user accounts that have a real interactive login shell.

    Service/system accounts (e.g. www-data, nobody) use /usr/sbin/nologin or
    /bin/false so they can't log in — we skip those. We only return accounts
    that a human (or attacker) could actually log in with.

    For each user we also check whether they have sudo privileges, since sudo
    users can execute commands as root — a critical finding if the account is
    poorly secured.

    Returns a list of user dicts.
    """
    users = []
    # Shells that mean "this account cannot log in interactively"
    no_login_shells = {"/usr/sbin/nologin", "/bin/false", "/sbin/nologin"}

    try:
        for user in pwd.getpwall():
            if user.pw_shell in no_login_shells:
                continue

            # Check sudo access — `sudo -l -U <name>` lists allowed commands
            has_sudo = False
            try:
                result = subprocess.run(
                    ["sudo", "-l", "-U", user.pw_name],
                    capture_output=True,
                    text=True,
                    timeout=5,
                )
                has_sudo = "may run" in result.stdout.lower()
            except Exception:
                pass  # If check fails, assume no sudo

            users.append({
                "name": user.pw_name,
                "uid": user.pw_uid,
                "gid": user.pw_gid,
                "home": user.pw_dir,
                "shell": user.pw_shell,
                "has_sudo": has_sudo,
            })
    except Exception as e:
        print(f"  [!] Could not enumerate users: {e}", file=sys.stderr)

    return users


def collect_services():
    """
    List all currently running systemd services.

    Uses `systemctl list-units --type=service --state=running` to find active
    services. Running unnecessary services increases the attack surface — for
    example an unused FTP or Telnet service that was never disabled.

    Returns a list of service name strings (without the .service suffix).
    """
    services = []

    try:
        result = subprocess.run(
            [
                "systemctl", "list-units",
                "--type=service",
                "--state=running",
                "--no-pager",
            ],
            capture_output=True,
            text=True,
            timeout=10,
        )
        for line in result.stdout.strip().split("\n")[1:]:
            parts = line.split()
            if parts and parts[0].endswith(".service"):
                # Strip the .service suffix for cleaner output
                services.append(parts[0].replace(".service", ""))
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        print(f"  [!] Could not list services: {e}", file=sys.stderr)

    return services


def collect_all():
    """
    Run every collection function and bundle the results into one dict.

    This is the payload that gets sent to the backend. Adding new data
    categories in the future means adding a new key here.

    Returns the complete scan data dict.
    """
    hostname = subprocess.run(
        ["hostname"], capture_output=True, text=True
    ).stdout.strip()

    print("  Collecting file permissions...")
    permissions = collect_file_permissions()

    print("  Collecting SSH configuration...")
    ssh = collect_ssh_config()

    print("  Collecting open ports...")
    open_ports = collect_open_ports()

    print("  Collecting user accounts...")
    users = collect_users()

    print("  Collecting running services...")
    services = collect_services()

    return {
        "permissions": permissions,
        "ssh": ssh,
        "open_ports": open_ports,
        "users": users,
        "services": services,
        "hostname": hostname,
        "scan_timestamp": datetime.now(UTC).isoformat(),
    }


# ---------------------------------------------------------------------------
# SUBMISSION
# ---------------------------------------------------------------------------

def send_to_backend(server_id, server_name, scan_data):
    """
    POST the collected scan data to the Audit Vault backend using chunked uploads.

    Uses the multi-step upload flow:
      1. POST /api/data/initialize - Get session ID
      2. POST /api/data/upload (multiple times) - Upload data in parts
      3. POST /api/data/finalize - Complete upload and trigger analysis

    Uses urllib.request from the standard library — no pip install needed.

    Returns True on success, False on any error.
    """

    # Step 1: Initialize upload session
    print("  [1/4] Initializing upload session...")
    init_url = f"{BACKEND_URL}/api/data/initialize"
    init_payload = json.dumps({
        "serverId": server_id,
        "serverName": server_name
    }).encode("utf-8")

    try:
        req = urllib.request.Request(
            init_url,
            data=init_payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            body = json.loads(response.read().decode())
            if not body.get("success"):
                print(f"  [!] Failed to initialize: {body.get('message')}", file=sys.stderr)
                return False
            session_id = body.get("sessionId")
            print(f"  Session ID: {session_id}")
    except Exception as e:
        print(f"  [!] Initialization failed: {e}", file=sys.stderr)
        return False

    # Step 2: Upload data in parts
    upload_url = f"{BACKEND_URL}/api/data/upload"

    # Map agent data structure to backend expected structure
    data_parts = [
        ("filePermissions", scan_data.get("permissions", [])),
        ("users", scan_data.get("users", [])),
    ]

    # Add logs if we have any scan metadata
    logs_data = {
        "sshConfig": scan_data.get("ssh", {}),
        "openPorts": scan_data.get("open_ports", []),
        "services": scan_data.get("services", []),
        "hostname": scan_data.get("hostname", server_name),
        "scanTimestamp": scan_data.get("scan_timestamp")
    }
    data_parts.append(("logs", logs_data))

    for idx, (data_type, data) in enumerate(data_parts, start=2):
        print(f"  [{idx}/4] Uploading {data_type}...")
        upload_payload = json.dumps({
            "sessionId": session_id,
            "dataType": data_type,
            "data": data
        }).encode("utf-8")

        try:
            req = urllib.request.Request(
                upload_url,
                data=upload_payload,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=30) as response:
                body = json.loads(response.read().decode())
                if not body.get("success"):
                    print(f"  [!] Failed to upload {data_type}: {body.get('message')}", file=sys.stderr)
                    return False
        except Exception as e:
            print(f"  [!] Upload failed for {data_type}: {e}", file=sys.stderr)
            return False

    # Step 3: Finalize upload
    print("  [4/4] Finalizing upload...")
    finalize_url = f"{BACKEND_URL}/api/data/finalize"
    finalize_payload = json.dumps({
        "sessionId": session_id
    }).encode("utf-8")

    try:
        req = urllib.request.Request(
            finalize_url,
            data=finalize_payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            body = json.loads(response.read().decode())
            if not body.get("success"):
                print(f"  [!] Finalization failed: {body.get('message')}", file=sys.stderr)
                return False
            server_info = body.get("server", {})
            print(f"  ✓ Upload complete — {server_info.get('name')}, Scan #{server_info.get('totalScans')}")
            return True
    except Exception as e:
        print(f"  [!] Finalization failed: {e}", file=sys.stderr)
        return False


# ---------------------------------------------------------------------------
# Instructions
# ---------------------------------------------------------------------------

def check_for_instructions(server_id):
    """Check server for pending instructions"""
    if not server_id:
        return []

    url = f"{BACKEND_URL}/api/instructions/pending/{server_id}"
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=10) as response:
            body = json.loads(response.read().decode())
            return body.get("instructions", [])
    except Exception:
        pass
    return []

def execute_instruction(instruction, server_id, server_name):
    """Execute an instruction"""
    inst_type = instruction.get("type")
    inst_id = instruction.get("id")

    print(f"Executing: {inst_type}")

    result = {"success": False}

    if inst_type == "trigger_scan":
        # Run the scan
        try:
            scan_data = collect_all()
            success = send_to_backend(server_id, server_name, scan_data)
            result = {"success": success, "message": "Scan completed" if success else "Scan failed"}
        except Exception as e:
            result = {"success": False, "message": str(e)}

    # Report completion
    url = f"{BACKEND_URL}/api/instructions/complete/{server_id}/{inst_id}"
    payload = json.dumps({
        "result": result,
        "error": None if result["success"] else result.get("message", "Failed")
    }).encode("utf-8")

    try:
        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        urllib.request.urlopen(req, timeout=10)
    except Exception:
        pass


# ---------------------------------------------------------------------------
# ENTRY POINT
# ---------------------------------------------------------------------------

def scan(server_id, server_name):
    """Run a security scan and send data to backend"""
    print("Starting scan...")

    # Collect
    print("Collecting security data...")
    scan_data = collect_all()
    print()

    # Send
    print("Sending data to backend...")
    success = send_to_backend(server_id, server_name, scan_data)

    if success:
        print("\nDone. Your security report will be ready in ~30 seconds.")
        print("Check your AuditVault dashboard to view the results.")
        return True
    else:
        print("\nFailed to submit scan. Check the errors above.", file=sys.stderr)
        return False

def main():
    global SERVER_ID

    print("AuditVault Agent")
    print("-" * 40)

    # Resolve token (server ID)
    SERVER_ID = load_token()
    if not SERVER_ID:
        print(
            "Error: no token found.\n"
            "Pass it as an argument:       python3 agent.py <server-id>\n"
            "Or set an env variable:       AUDIT_VAULT_TOKEN=<server-id>\n"
            f"Or store it in:              {CONFIG_FILE}",
            file=sys.stderr,
        )
        sys.exit(1)

    # Use the server name passed as second argument, falling back to hostname
    if len(sys.argv) > 2:
        server_name = sys.argv[2]
    else:
        server_name = subprocess.run(
            ["hostname"], capture_output=True, text=True
        ).stdout.strip()

    print(f"Server ID: {SERVER_ID[:12]}...")
    print(f"Server:    {server_name}")
    print(f"Backend:   {BACKEND_URL}")
    print()

    # Warn if not root — some files will be unreadable
    if os.geteuid() != 0:
        print("Warning: not running as root — some files may be unreadable.\n")

    # Run initial scan
    scan(SERVER_ID, server_name)

    # Polling loop for instructions
    print("\nEntering polling mode for instructions...")
    while True:
        try:
            # Check for instructions
            instructions = check_for_instructions(SERVER_ID)
            for inst in instructions:
                execute_instruction(inst, SERVER_ID, server_name)

            time.sleep(POLL_INTERVAL)
        except KeyboardInterrupt:
            print("\nShutting down agent...")
            sys.exit(0)
        except Exception as e:
            print(f"Error in polling loop: {e}", file=sys.stderr)
            time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()