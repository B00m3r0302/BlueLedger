#!/bin/bash

echo "🧹 Cleaning up macvlan configuration..."

# Get network info
INTERFACE=$(ip route | grep default | head -1 | awk '{print $5}')
HOST_IP=$(ip route get 1 | awk '{print $7}' | head -1)
NETWORK_BASE=$(echo $HOST_IP | cut -d'.' -f1-3)

if [ -f .env ]; then
    CONTAINER_RANGE=$(grep CONTAINER_IP_RANGE .env | cut -d'=' -f2)
    echo "Found container range: $CONTAINER_RANGE"
else
    echo "No .env file found, using default range"
    CONTAINER_RANGE="$NETWORK_BASE.240/29"
fi

# Remove macvlan bridge interface
echo "🌉 Removing macvlan bridge interface..."
sudo ip link delete macvlan-bridge 2>/dev/null || true

# Remove ARP entries
echo "🗣️  Removing ARP entries..."
for i in $(seq 240 250); do
    CONTAINER_IP=$NETWORK_BASE.$i
    sudo arp -d $CONTAINER_IP 2>/dev/null || true
done

# Remove iptables rules
echo "🔥 Removing iptables rules..."
sudo iptables -t nat -D POSTROUTING -s $CONTAINER_RANGE ! -d $CONTAINER_RANGE -j MASQUERADE 2>/dev/null || true
sudo iptables -D FORWARD -i $INTERFACE -o macvlan-bridge -j ACCEPT 2>/dev/null || true
sudo iptables -D FORWARD -i macvlan-bridge -o $INTERFACE -j ACCEPT 2>/dev/null || true

# Disable proxy ARP
echo "📡 Disabling proxy ARP..."
sudo sysctl net.ipv4.conf.$INTERFACE.proxy_arp=0 2>/dev/null || true
sudo sysctl net.ipv4.conf.macvlan-bridge.proxy_arp=0 2>/dev/null || true

echo "✅ Macvlan cleanup complete!"