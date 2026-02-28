#!/bin/sh

printf "Starting...\n"
printf "    ___             ___ __ _    __            ____ \n";
printf "   /   | __  ______/ (_) /| |  / /___ ___  __/ / /_\n";
printf "  / /| |/ / / / __  / / __/ | / / __ \`/ / / / / __/\n";
printf " / ___ / /_/ / /_/ / / /_ | |/ / /_/ / /_/ / / /_  \n";
printf "/_/  |_\\__,_/\\__,_/_/\\__/ |___/\\__,_/\\__,_/_/\\__/  \n";
printf "                                                   \n";
printf "Intelligent and automated system security scanning\n"

if command -v dnf &> /dev/null; then
   sudo dnf install python3
elif command -v apt &> /dev/null; then
   sudo apt install python3
else
   echo "Failed to install Python3";
   exit
fi


sudo touch /usr/bin/auditvault-agent
sudo chown $USER /usr/bin/auditvault-agent
sudo curl https://nextcloud.hnasheralneam.dev/index.php/s/agent-auditvault/download > /usr/bin/auditvault-agent

sudo mkdir /var/auditvault
sudo tee /usr/lib/systemd/system/auditvault-agent.service > /dev/null <<EOF
[Unit]
Description=Agent for AuditValult Secure

[Service]
Type=simple
User=root
WorkingDirectory=/var/auditvault
ExecStart=python3 /usr/bin/auditvault-agent
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable auditvault-agent
sudo systemctl start auditvault-agent

printf "Connecting to your account...\n"

# CONNECT TO THE ACCOUNT

printf "Failed to connect.\n"
exit

printf "Finished installing.\n"
printf "Starting a scan...\n"

# TRIGGER A SCAN
