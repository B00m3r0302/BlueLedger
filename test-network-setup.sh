#!/bin/bash

echo "🧪 Testing Network Setup..."
echo "=========================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Run ./setup-macvlan.sh first!"
    exit 1
fi

# Source the .env file
source .env

echo "📡 Network Configuration:"
echo "   Interface: $NETWORK_INTERFACE"
echo "   Gateway: $NETWORK_GATEWAY" 
echo "   Subnet: $NETWORK_SUBNET"
echo ""

# Check if containers are running
echo "🔍 Checking container status..."
SERVER_STATUS=$(docker ps --filter "name=blueledger_server" --format "{{.Status}}" 2>/dev/null || echo "Not found")
VICTIM_STATUS=$(docker ps --filter "name=ssl_victim" --format "{{.Status}}" 2>/dev/null || echo "Not found")

echo "📱 Server Status: $SERVER_STATUS"
echo "🎭 Victim Status: $VICTIM_STATUS"
echo ""

if [[ "$SERVER_STATUS" == *"Up"* ]] && [[ "$VICTIM_STATUS" == *"Up"* ]]; then
    echo "✅ Both containers are running!"
    
    # Get IPs
    HOST_IP=$(ip route get 1 | awk '{print $7}' | head -1)
    VICTIM_IP=$(docker inspect ssl_victim 2>/dev/null | jq -r '.[0].NetworkSettings.Networks | to_entries[0].value.IPAddress' 2>/dev/null || echo 'Unknown')
    
    echo ""
    echo "🌐 Access Points:"
    echo "   Server (via host): http://$HOST_IP:3000"
    echo "   Victim IP: $VICTIM_IP"
    echo ""
    
    # Test connectivity
    echo "🔗 Testing connectivity..."
    if curl -s --connect-timeout 5 "http://$HOST_IP:3000" >/dev/null; then
        echo "✅ Server is accessible on host IP"
    else
        echo "❌ Server not accessible on host IP"
    fi
    
    if [ "$VICTIM_IP" != "Unknown" ] && [ "$VICTIM_IP" != "null" ]; then
        if ping -c 1 -W 2 "$VICTIM_IP" >/dev/null 2>&1; then
            echo "✅ Victim IP is pingable"
        else
            echo "❌ Victim IP not pingable"
        fi
    else
        echo "❌ Could not determine victim IP"
    fi
    
else
    echo "❌ Containers not running. Start with: docker-compose up -d"
fi

echo ""
echo "🎯 Summary:"
echo "   - Server uses bridge network (accessible via host IP + ports)"
echo "   - Victim uses macvlan network (gets real DHCP IP from router)"
echo "   - External devices can nmap scan to find victim IP"
echo "   - Both server and victim are accessible for SSL stripping attacks"
