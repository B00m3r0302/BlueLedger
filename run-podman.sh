#!/bin/bash

echo "🚀 SSL Stripping Lab - Podman Native Setup"
echo "=========================================="

# Check required tools
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ Missing required tool: $1"
        echo "   Install with: sudo apt install $2"
        exit 1
    fi
}

echo "🔍 Checking required tools..."
check_tool "podman" "podman"
check_tool "ip" "iproute2"
check_tool "awk" "gawk"

# Network auto-detection
echo "🌐 Detecting network configuration..."
DEFAULT_GW=$(ip route | grep default | head -1 | awk '{print $3}')
INTERFACE=$(ip route | grep default | head -1 | awk '{print $5}')
HOST_IP=$(ip route get 1 | awk '{print $7}' | head -1)
SUBNET=$(echo $HOST_IP | cut -d'.' -f1-3).0/24
CONTAINER_RANGE=$(echo $HOST_IP | cut -d'.' -f1-3).248/29

# Validate network detection
if [ -z "$DEFAULT_GW" ] || [ -z "$INTERFACE" ] || [ -z "$HOST_IP" ]; then
    echo "❌ Failed to detect network configuration"
    echo "   Ensure you have an active network connection"
    exit 1
fi

echo "📡 Detected:"
echo "   Interface: $INTERFACE" 
echo "   Gateway: $DEFAULT_GW"
echo "   Subnet: $SUBNET"
echo "   Container Range: $CONTAINER_RANGE"

# Clean up any existing network and containers
echo ""
echo "🧹 Cleaning up any existing containers and networks..."
podman rm -f blueledger_server_podman ssl_victim_podman 2>/dev/null || true
podman network rm ssl-lab-network 2>/dev/null || true

# Thorough CNI cleanup
echo "🧹 Performing thorough CNI cleanup..."
podman network prune -f 2>/dev/null || true
# Remove all network-related cache and config files
find ~/.local/share/containers/ -name "*ssl-lab-network*" -delete 2>/dev/null || true
find ~/.config/ -name "*ssl-lab-network*" -delete 2>/dev/null || true
rm -rf /tmp/podman-run-*/cni-* 2>/dev/null || true

# Kill any lingering CNI processes
pkill -f "ssl-lab-network" 2>/dev/null || true

# Wait for cleanup to complete
echo "⏳ Waiting for cleanup to complete..."
sleep 3

# Verify parent interface exists
echo "🔍 Verifying parent interface..."
if ! ip link show $INTERFACE > /dev/null 2>&1; then
    echo "❌ Parent interface $INTERFACE not found"
    echo "   Available interfaces:"
    ip link show | grep "^[0-9]" | awk '{print $2}' | sed 's/://'
    exit 1
fi

# Create macvlan network with fallback to bridge
NETWORK_NAME="ssl-lab-net-$(date +%s)"
echo ""
echo "🔧 Attempting to create macvlan network: $NETWORK_NAME"
if podman network create \
  --driver macvlan \
  --gateway=$DEFAULT_GW \
  --subnet=$SUBNET \
  --ip-range=$CONTAINER_RANGE \
  --opt parent=$INTERFACE \
  $NETWORK_NAME 2>/dev/null; then
    echo "✅ Macvlan network created successfully"
    NETWORK_TYPE="macvlan"
else
    echo "⚠️  Macvlan failed, falling back to bridge networking..."
    NETWORK_NAME="ssl-lab-bridge-$(date +%s)"
    if podman network create $NETWORK_NAME; then
        echo "✅ Bridge network created successfully: $NETWORK_NAME"
        NETWORK_TYPE="bridge"
    else
        echo "❌ Both macvlan and bridge networking failed"
        echo "   This may require root privileges or Docker Compose"
        exit 1
    fi
fi

# Build containers
echo ""
echo "🏗️  Building containers..."
if ! podman build -t blueledger-server:latest -f ssl-stripping-lab/containers/server_victim/ubuntu_server/Dockerfile .; then
    echo "❌ Failed to build BlueLedger server container"
    echo "   Check that docker/podman and build tools are installed"
    exit 1
fi

if ! podman build -t ssl-victim:latest ssl-stripping-lab/containers/server_victim/debian_victim/; then
    echo "❌ Failed to build victim simulator container" 
    echo "   Check that docker/podman and build tools are installed"
    exit 1
fi

# Run BlueLedger server
echo ""
echo "🖥️  Starting BlueLedger server..."
if ! podman run -d \
  --name blueledger_server_podman \
  --network $NETWORK_NAME \
  --privileged \
  -e BLUELEDGER_PATH=/opt/BlueLedger \
  blueledger-server:latest; then
    echo "❌ Failed to start BlueLedger server"
    echo "   Check if container already exists: podman rm blueledger_server_podman"
    exit 1
fi

# Wait a bit for server to start
sleep 10

# Run victim simulator  
echo ""
echo "🎭 Starting victim simulator..."
if ! podman run -d \
  --name ssl_victim_podman \
  --network $NETWORK_NAME \
  -e TARGET_SERVER_IP=auto \
  ssl-victim:latest python3 /opt/victim_simulator.py; then
    echo "❌ Failed to start victim simulator"
    echo "   Check if container already exists: podman rm ssl_victim_podman"
    exit 1
fi

# Wait for containers to get IPs
echo ""
echo "⏳ Waiting for containers to get IP addresses..."
sleep 15

# Show container IPs
echo ""
echo "🎯 SSL STRIPPING LAB (PODMAN) - CONTAINER IPS:"
echo "=============================================="

# Try multiple methods to get container IPs
SERVER_IP=$(podman inspect blueledger_server_podman --format '{{.NetworkSettings.IPAddress}}' 2>/dev/null)
if [ -z "$SERVER_IP" ] || [ "$SERVER_IP" = "<no value>" ]; then
    SERVER_IP=$(podman inspect blueledger_server_podman --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' 2>/dev/null)
fi
if [ -z "$SERVER_IP" ] || [ "$SERVER_IP" = "<no value>" ]; then
    # Try getting IP from container's hostname resolution
    SERVER_IP=$(podman exec blueledger_server_podman hostname -I 2>/dev/null | awk '{print $1}')
fi
if [ -z "$SERVER_IP" ] || [ "$SERVER_IP" = "<no value>" ]; then
    SERVER_IP="Could not detect"
fi

VICTIM_IP=$(podman inspect ssl_victim_podman --format '{{.NetworkSettings.IPAddress}}' 2>/dev/null)
if [ -z "$VICTIM_IP" ] || [ "$VICTIM_IP" = "<no value>" ]; then
    VICTIM_IP=$(podman inspect ssl_victim_podman --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' 2>/dev/null)
fi
if [ -z "$VICTIM_IP" ] || [ "$VICTIM_IP" = "<no value>" ]; then
    # Try getting IP from container's hostname resolution
    VICTIM_IP=$(podman exec ssl_victim_podman hostname -I 2>/dev/null | awk '{print $1}')
fi
if [ -z "$VICTIM_IP" ] || [ "$VICTIM_IP" = "<no value>" ]; then
    VICTIM_IP="Could not detect"
fi

echo "📱 BlueLedger Server: $SERVER_IP"
echo "🎭 SSL Victim: $VICTIM_IP"
echo "🌐 Network Type: $NETWORK_TYPE"
echo ""

if [ "$SERVER_IP" != "Starting..." ] && [ "$VICTIM_IP" != "Starting..." ]; then
    echo "🌐 Access URLs:"
    if [ "$NETWORK_TYPE" = "bridge" ]; then
        echo "   Frontend:  http://localhost:3000 (port forwarded)"
        echo "   HTTP API:  http://localhost:5000 (port forwarded)" 
        echo "   HTTPS API: https://localhost:5001 (port forwarded)"
        echo ""
        echo "⚠️  Bridge networking: SSL stripping requires additional setup"
        echo "   Consider using Docker Compose for easier macvlan networking"
    else
        echo "   Frontend:  http://$SERVER_IP:3000"
        echo "   HTTP API:  http://$SERVER_IP:5000" 
        echo "   HTTPS API: https://$SERVER_IP:5001"
        echo ""
        echo "🔓 Ready for SSL Stripping Attack!"
        echo "💡 Quick Commands:"
        echo "   ettercap: sudo ettercap -T -M arp:remote /$VICTIM_IP// /$DEFAULT_GW//"
        echo "   iptables: sudo iptables -t nat -A PREROUTING -s $VICTIM_IP -p tcp --dport 5001 -j REDIRECT --to-port 8080"
    fi
fi

echo "=============================================="
echo ""
echo "📋 Container Management:"
echo "   podman logs blueledger_server_podman"  
echo "   podman logs ssl_victim_podman"
echo "   podman stop blueledger_server_podman ssl_victim_podman"
echo "   podman rm blueledger_server_podman ssl_victim_podman"
echo "   podman network rm $NETWORK_NAME"