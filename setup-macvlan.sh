#!/bin/bash

echo "🌐 SSL Stripping Lab - Setting up network for victim DHCP assignment..."

# Get network info
DEFAULT_GW=$(ip route | grep default | head -1 | awk '{print $3}')
INTERFACE=$(ip route | grep default | head -1 | awk '{print $5}')
HOST_IP=$(ip route get 1 | awk '{print $7}' | head -1)
NETWORK_BASE=$(echo $HOST_IP | cut -d'.' -f1-3)

echo "📡 Detected network configuration:"
echo "   Interface: $INTERFACE"
echo "   Gateway: $DEFAULT_GW"
echo "   Host IP: $HOST_IP"
echo "   Network: $NETWORK_BASE.0/24"

# Update .env file for DHCP assignment
cat > .env << EOF
NETWORK_INTERFACE=$INTERFACE
NETWORK_GATEWAY=$DEFAULT_GW
NETWORK_SUBNET=$NETWORK_BASE.0/24
EOF

echo "✅ Network configuration saved to .env"

echo "� Ready to start containers!"
echo "💡 Server: Uses bridge network, accessible via host IP ($HOST_IP) on ports 3000, 5000, 5001"
echo "💡 Victim: Gets real DHCP IP from router (different from host)"
echo "🌐 Victim will be discoverable by external devices with nmap"
echo ""
echo "Next steps:"
echo "1. Run: docker-compose up -d"
echo "2. Wait for containers to start"
echo "3. Run: ./show-ips.sh to see victim's DHCP IP"
echo "4. Server accessible at: http://$HOST_IP:3000"
echo "5. Use nmap from external devices to find victim IP"