FROM debian:12-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    iputils-ping \
    net-tools \
    nmap \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip3 install requests urllib3

# Create victim simulator script
RUN cat > /opt/victim_simulator.py << 'EOF'
#!/usr/bin/env python3
"""
Auto-discovering SSL victim simulator
Finds Ubuntu server running BlueLedger and attacks it
"""

import requests
import time
import random
import os
import socket
from urllib3.exceptions import InsecureRequestWarning

# Disable SSL warnings for testing
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

def discover_blueledger_server():
    """Auto-discover BlueLedger server"""
    target_ip = os.environ.get('TARGET_SERVER_IP')
    
    if target_ip:
        print(f"🎯 Using configured target: {target_ip}")
        return target_ip
    
    print("🔍 Auto-discovering BlueLedger server...")
    
    # Check common container networks
    networks_to_scan = ['172.20.0', '192.168', '10.0.0']
    
    for network in networks_to_scan:
        print(f"📡 Scanning {network}.0/24...")
        for i in range(1, 255):
            if network == '192.168':
                target_ip = f"{network}.1.{i}"  # 192.168.1.x
            else:
                target_ip = f"{network}.{i}"
                
            try:
                # Quick health check
                response = requests.get(f"https://{target_ip}:5001/health", 
                                      timeout=2, verify=False)
                if response.status_code == 200:
                    data = response.json()
                    if 'status' in data:
                        print(f"✅ Found BlueLedger at {target_ip}")
                        return target_ip
            except:
                continue
    
    print("❌ Auto-discovery failed!")
    return None

def simulate_victim_traffic(target_ip):
    """Simulate realistic victim login attempts"""
    TARGET_URL = f"https://{target_ip}:5001/api/auth/login"
    
    LOGIN_DATA = {
        "email": "Employee@sinamoa.com", 
        "password": "Employee123!@#"
    }
    
    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36", 
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
    ]
    
    print(f"🎭 Starting victim simulation against {TARGET_URL}")
    print("📋 Credentials: Employee@sinamoa.com / Employee123!@#")
    print("⏰ Login attempts every 30 seconds")
    print("-" * 60)
    
    attempt = 0
    while True:
        try:
            attempt += 1
            headers = {
                "User-Agent": random.choice(USER_AGENTS),
                "Content-Type": "application/json",
                "Referer": f"https://{target_ip}:3000"
            }
            
            print(f"[{time.strftime('%H:%M:%S')}] 🔐 Attempt #{attempt}: Logging in...")
            
            response = requests.post(
                TARGET_URL,
                json=LOGIN_DATA,
                headers=headers,
                timeout=10,
                verify=False
            )
            
            status = "✅ SUCCESS" if response.status_code == 200 else f"❌ FAILED ({response.status_code})"
            print(f"[{time.strftime('%H:%M:%S')}] {status}")
            
            # Add some jitter to make traffic more realistic
            wait_time = random.randint(25, 35)
            print(f"[{time.strftime('%H:%M:%S')}] 💤 Waiting {wait_time}s...")
            time.sleep(wait_time)
            
        except requests.exceptions.RequestException as e:
            print(f"[{time.strftime('%H:%M:%S')}] ⚠️  Network error: {e}")
            time.sleep(30)
        except KeyboardInterrupt:
            print("\n🛑 Victim simulation stopped")
            break

def main():
    print("🎭 SSL Stripping Victim Simulator")
    print("=" * 50)
    
    # Wait a bit for server to start
    print("⏳ Waiting for server to initialize...")
    time.sleep(15)
    
    # Discover target
    target_ip = discover_blueledger_server()
    
    if not target_ip:
        print("💀 No BlueLedger server found. Exiting.")
        return
    
    # Start victim simulation
    simulate_victim_traffic(target_ip)

if __name__ == "__main__":
    main()
EOF

# Make script executable
RUN chmod +x /opt/victim_simulator.py

# Show container info on startup
RUN cat > /opt/startup_info.py << 'EOF'
#!/usr/bin/env python3
import socket
import time
import os

def show_info():
    hostname = socket.gethostname()
    container_ip = socket.gethostbyname(hostname)
    target_ip = os.environ.get('TARGET_SERVER_IP', 'Auto-discover')
    
    print("=" * 60)
    print("🎭 SSL STRIPPING VICTIM CONTAINER")  
    print("=" * 60)
    print(f"📦 Container: {hostname}")
    print(f"🌐 Victim IP: {container_ip}")
    print(f"🎯 Target IP: {target_ip}")
    print(f"⏰ Started: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

if __name__ == "__main__":
    show_info()
EOF

RUN chmod +x /opt/startup_info.py

# Create startup script that shows info then runs simulator
RUN cat > /opt/start_victim.sh << 'EOF'
#!/bin/bash
python3 /opt/startup_info.py
python3 /opt/victim_simulator.py
EOF

RUN chmod +x /opt/start_victim.sh

# Default command
CMD ["/opt/start_victim.sh"]