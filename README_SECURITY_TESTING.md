# BlueLedger Security Testing Suite

## Overview

This repository includes comprehensive SSL/TLS downgrade attack testing tools and network-level man-in-the-middle attack capabilities for security assessment of the BlueLedger application.

> ⚠️ **CRITICAL**: These tools are for authorized security testing ONLY. Use only on networks you own or have explicit written permission to test.

## 🛠️ Available Tools

### Core Testing Scripts
- **`scripts/automated_downgrade_test.sh`** - Automated SSL downgrade testing
- **`scripts/network_mitm_attack.sh`** - Network-wide MITM attacks  
- **`scripts/captive_portal.py`** - Realistic fake login portal
- **`scripts/https_downgrade_test.sh`** - HTTPS specific testing
- **`scripts/ssl_strip_demo.py`** - SSL stripping demonstration

### Attack Scenarios Supported
✅ **Local SSL Stripping** - Intercept localhost traffic  
✅ **Network ARP Spoofing** - Target other devices on network  
✅ **DNS Spoofing** - Redirect domain resolution  
✅ **WiFi Captive Portals** - Fake access point attacks  
✅ **Certificate Bypass** - Self-signed cert testing  

## 🚀 Quick Start

### 1. Local Testing (Safe)
Test SSL downgrade on your own machine:
```bash
# Start HTTPS-enabled application
docker-compose -f docker-compose.https.yml up

# Run automated tests
./scripts/automated_downgrade_test.sh

# Manual HTTPS testing
./scripts/https_downgrade_test.sh
```

### 2. Network Testing (Authorized Only)
Test against other devices on YOUR network:
```bash
# Interactive network attack menu
sudo ./scripts/network_mitm_attack.sh eth0

# Quick ARP spoofing test
sudo bettercap -iface eth0
> set arp.spoof.targets 192.168.1.100
> arp.spoof on
> http.proxy on
```

### 3. Captive Portal Attack
Create fake BlueLedger login portal:
```bash
# Basic captive portal
sudo python3 scripts/captive_portal.py --port 80

# HTTPS captive portal  
sudo python3 scripts/captive_portal.py --port 80 --https-port 443 \
     --ssl-cert certs/cert.pem --ssl-key certs/key.pem
```

## 📚 Documentation

### Main Guide
**`docs/SSL_DOWNGRADE_ATTACK_GUIDE.md`** - Comprehensive 1,000+ line guide covering:
- Burp Suite Professional techniques
- Bettercap network attacks
- Ettercap filtering and spoofing  
- SSLstrip classic and modern variants
- mitmproxy scripting and automation
- WiFi rogue access point setup
- Real-world attack scenarios

### Test Credentials
- **Username**: pedermo@sinamoa.com
- **Password**: ChemicalReaction42!
- **Role**: Administrator

## 🔧 Tool Details

### Network MITM Attack Script
```bash
sudo ./scripts/network_mitm_attack.sh [interface]
```
**Features**:
- Automated network discovery
- ARP spoofing with credential capture
- DNS spoofing with fake server setup
- WiFi attack configuration  
- Full coordinated attack scenarios

### Captive Portal
```bash
python3 scripts/captive_portal.py [options]
```
**Options**:
- `--port 80` - HTTP port
- `--https-port 443` - HTTPS port  
- `--ssl-cert file.pem` - SSL certificate
- `--ssl-key file.key` - SSL private key
- `--interface 0.0.0.0` - Bind interface
- `--log-file path` - Custom log file

## 📊 Attack Monitoring

### Log Files
All attacks generate detailed logs:
- `/tmp/intercepted_credentials.log` - ARP spoofing captures
- `/tmp/captive_portal_captures.log` - Fake portal submissions
- `/tmp/dns_spoof_captures.log` - DNS redirection logs

### Real-time Monitoring
```bash
# Monitor all attack logs
tail -f /tmp/intercepted_credentials.log /tmp/captive_portal_captures.log

# Network traffic analysis
tcpdump -i eth0 host 192.168.1.100 and port 5000

# SSL/TLS connection monitoring
openssl s_client -connect localhost:5443 -servername localhost
```

## 🛡️ Defense Testing

### Application-Level Defenses
The guide includes code examples for implementing:
- HSTS (HTTP Strict Transport Security) headers
- Certificate pinning validation
- Secure cookie configurations  
- HTTPS redirect enforcement
- CSP (Content Security Policy) headers

### Network-Level Detection
- ARP spoofing detection techniques
- Certificate fingerprint monitoring
- Unusual traffic pattern analysis

## 🔍 Professional Tool Integration

### Burp Suite
- Manual request interception and modification
- Match & Replace rules for automated attacks
- Custom Python extensions for advanced scenarios

### Bettercap
- Network-wide ARP spoofing campaigns
- JavaScript-based request/response modification
- DNS spoofing with custom resolution rules

### Ettercap  
- Custom filter development and compilation
- Targeted device attacks with precise filtering
- Integration with external credential capture systems

### mitmproxy
- Python-based proxy scripting
- Transparent mode for network-level interception
- Web interface for interactive attack management

## ⚖️ Legal & Ethical Guidelines

### Authorized Testing Only
- ✅ Test only systems you own
- ✅ Obtain written authorization before testing third-party networks  
- ✅ Document all testing activities
- ✅ Follow responsible disclosure practices

### Prohibited Activities
- ❌ Testing unauthorized networks
- ❌ Intercepting traffic without permission
- ❌ Retaining captured credentials
- ❌ Using tools for malicious purposes

## 🔧 Dependencies

### Required Tools
```bash
# Ubuntu/Debian installation
sudo apt update && sudo apt install -y \
    nmap \
    bettercap \
    ettercap-text-only \
    tcpdump \
    openssl \
    python3 \
    curl \
    netcat
```

### Optional Tools  
- Burp Suite Professional (commercial)
- Wireshark (GUI traffic analysis)
- Aircrack-ng (WiFi security testing)

## 🚨 Warning Signs

### Attack Success Indicators
- Credentials appear in log files
- Traffic flows through attacker machine  
- HTTPS connections downgraded to HTTP
- Target devices connect to fake services

### Defense Success Indicators  
- Certificate pinning blocks fake certificates
- HSTS forces HTTPS connections
- ARP spoofing detection triggers alerts
- No credentials captured in logs

## 📈 Next Steps

After running these tests:
1. **Review captured logs** for credential exposure
2. **Implement recommended defenses** based on findings
3. **Test defense effectiveness** by re-running attacks
4. **Document vulnerabilities** and remediation steps
5. **Train users** on security awareness

This security testing suite provides comprehensive coverage of SSL/TLS downgrade attacks and network-level man-in-the-middle scenarios for thorough security assessment of your BlueLedger application.