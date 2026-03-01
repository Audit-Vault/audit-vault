#!/bin/bash

# Test script for creating and testing instructions

BASE_URL="http://localhost:4000"
SERVER_ID="0855e564-e3ef-4c9b-82d5-f39186d34857"  # Replace with your server ID

echo "========================================="
echo "Testing Instructions API"
echo "========================================="

echo ""
echo "1. Creating a 'trigger_scan' instruction..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/instructions/create/$SERVER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "trigger_scan",
    "description": "Perform a full system scan"
  }')

echo "$RESPONSE" | jq .
INSTRUCTION_ID=$(echo "$RESPONSE" | jq -r '.instruction.id')
echo "✓ Instruction ID: $INSTRUCTION_ID"

echo ""
echo "2. Creating a 'collect_logs' instruction..."
curl -s -X POST "$BASE_URL/api/instructions/create/$SERVER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "collect_logs",
    "description": "Collect authentication logs",
    "data": {
      "paths": ["/var/log/auth.log", "/var/log/syslog"]
    }
  }' | jq .

echo ""
echo "3. Creating an 'update_config' instruction..."
curl -s -X POST "$BASE_URL/api/instructions/create/$SERVER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "update_config",
    "description": "Update polling interval",
    "data": {
      "config": {
        "poll_interval": 600
      }
    }
  }' | jq .

echo ""
echo "4. Getting pending instructions..."
curl -s "$BASE_URL/api/instructions/pending/$SERVER_ID" | jq .

echo ""
echo "5. Getting instruction history..."
curl -s "$BASE_URL/api/instructions/history/$SERVER_ID" | jq .

echo ""
echo "========================================="
echo "Instructions created successfully!"
echo "The agent will execute them on next poll"
echo "========================================="
