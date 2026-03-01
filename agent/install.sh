#!/bin/sh
# To be called like this: curl -sL https://nextcloud.hnasheralneam.dev/index.php/s/install-auditvault/download | sh -s -- unique-server-id

printf "Starting...\n"
printf "    ___             ___ __ _    __            ____ \n";
printf "   /   | __  ______/ (_) /| |  / /___ ___  __/ / /_\n";
printf "  / /| |/ / / / __  / / __/ | / / __ \`/ / / / / __/\n";
printf " / ___ / /_/ / /_/ / / /_ | |/ / /_/ / /_/ / / /_  \n";
printf "/_/  |_\\__,_/\\__,_/_/\\__/ |___/\\__,_/\\__,_/_/\\__/  \n";
printf "                                                   \n";
printf "Intelligent and automated system security scanning\n"

if command -v apt &> /dev/null; then
   sudo apt install python3
elif command -v dnf &> /dev/null; then
   sudo dnf install python3
else
   echo "Failed to install Python3";
   exit
fi


sudo mkdir -p /var/auditvault
sudo chmod 755 /var/auditvault

sudo curl -L -o /usr/bin/auditvault-agent "https://nextcloud.hnasheralneam.dev/index.php/s/agent-auditvault/download"
sudo chmod +x /usr/bin/auditvault-agent

echo "$1" | sudo tee /var/auditvault/server-id > /dev/null
sudo chmod 644 /var/auditvault/server-id
sudo tee /etc/systemd/system/auditvault-agent.service > /dev/null <<EOF
[Unit]
Description=AuditVault Security Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/auditvault
ExecStart=/usr/bin/python3 /usr/bin/auditvault-agent
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable auditvault-agent
sudo systemctl start auditvault-agent

printf "\nFinished installing AuditVault Agent!\n"
printf "The agent is now running and will perform security scans.\n"
printf "Check your AuditVault dashboard to view results.\n"
