#!/bin/bash

echo "🌐 SSL Stripping Lab - Network Configuration"
echo "=============================================="

# Get host network info
DEFAULT_ROUTE=$(ip route | grep default | head -1)
INTERFACE=$(echo $DEFAULT_ROUTE | awk '{print $5}')
GATEWAY=$(echo $DEFAULT_ROUTE | awk '{print $3}')
HOST_IP=$(ip route get 1 | awk '{print $7}' | head -1)
SUBNET=$(echo $HOST_IP | cut -d'.' -f1-3).0/24

echo "📡 Detected Network Configuration:"
echo "   Interface: $INTERFACE"
echo "   Gateway: $GATEWAY" 
echo "   Host IP: $HOST_IP"
echo "   Subnet: $SUBNET"
echo ""

# Update docker-compose.yml
echo "🔧 Updating docker-compose.yml with detected settings..."

# Create backup
cp docker-compose.yml docker-compose.yml.backup

# Update the compose file
sed -i "s/parent: eth0/parent: $INTERFACE/g" docker-compose.yml
sed -i "s/subnet: 192.168.1.0\/24/subnet: $SUBNET/g" docker-compose.yml  
sed -i "s/gateway: 192.168.1.1/gateway: $GATEWAY/g" docker-compose.yml

# Set container IP range (last 8 IPs of subnet)
NETWORK_BASE=$(echo $SUBNET | cut -d'.' -f1-3)
CONTAINER_RANGE="${NETWORK_BASE}.248/29"  # .248-.255 range
sed -i "s/ip_range: 192.168.1.200\/29/ip_range: $CONTAINER_RANGE/g" docker-compose.yml

echo "✅ Configuration updated!"
echo ""
echo "📋 Container IP Range: $CONTAINER_RANGE"
echo "   This reserves IPs ${NETWORK_BASE}.248 through ${NETWORK_BASE}.255 for containers"
echo ""

echo "🚀 Ready to start! Run: docker-compose up --build"