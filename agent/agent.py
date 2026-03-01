#!/usr/bin/python

import os
import stat
import sys
import time
from datetime import datetime

OUTPUT_FILE = "permissions.txt"
SERVER_URL = os.getenv("AUDIT_VAULT_SERVER", "http://localhost:4000")
SERVER_ID = None  # Will be set after first run
POLL_INTERVAL = int(os.getenv("AUDIT_VAULT_POLL_INTERVAL", "300"))  # 5 minutes

def get_permission_string(mode):
    return stat.filemode(mode)

def process_directory(root_path, outfile):
    for root, dirs, files in os.walk(root_path):
        for name in files:
            full_path = os.path.join(root, name)
            try:
                file_stat = os.lstat(full_path)
                permissions = get_permission_string(file_stat.st_mode)
                owner = file_stat.st_uid
                group = file_stat.st_gid
                size = file_stat.st_size
                mtime = datetime.fromtimestamp(file_stat.st_mtime)

                line = f"{permissions} {owner}:{group} {size} {mtime} {full_path}\n"
                outfile.write(line)

            except PermissionError:
                outfile.write(f"Permission denied: {full_path}\n")
            except FileNotFoundError:
                continue


def check_for_instructions():
    """Check server for pending instructions"""
    if not SERVER_ID:
        return []

    try:
        import requests
        response = requests.get(f"{SERVER_URL}/api/instructions/pending/{SERVER_ID}", timeout=10)
        if response.ok:
            return response.json().get("instructions", [])
    except:
        pass
    return []

def execute_instruction(instruction):
    """Execute an instruction"""
    inst_type = instruction.get("type")
    inst_id = instruction.get("id")

    print(f"Executing: {inst_type}")

    result = {"success": False}

    if inst_type == "trigger_scan":
        # Run the scan
        main()
        result = {"success": True, "message": "Scan completed"}

    # Report completion
    try:
        import requests
        requests.post(
            f"{SERVER_URL}/api/instructions/complete/{SERVER_ID}/{inst_id}",
            json={"result": result, "error": None if result["success"] else "Failed"},
            timeout=10
        )
    except:
        pass

def run_with_polling():
    """Run agent in polling mode"""
    print(f"Agent running in polling mode (interval: {POLL_INTERVAL}s)")

    while True:
        try:
            # Check for instructions
            instructions = check_for_instructions()
            for inst in instructions:
                execute_instruction(inst)

            # Wait for next poll
            time.sleep(POLL_INTERVAL)
        except KeyboardInterrupt:
            print("\nAgent stopped")
            break
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(60)

def main():
    with open(OUTPUT_FILE, "w") as outfile:
        outfile.write("Permissions Report\n")
        outfile.write("=" * 60 + "\n\n")

        print("Processing /usr ...")
        process_directory("/usr", outfile)

        print("Processing /usr/bin ...")
        process_directory("/usr/bin", outfile)

        print("Processing /etc...")
        process_directory("/etc", outfile)

    print(f"Done. Output written to {OUTPUT_FILE}")


if __name__ == "__main__":
    # Run in polling mode if --poll flag is provided
    if "--poll" in sys.argv:
        run_with_polling()
    else:
        main()
