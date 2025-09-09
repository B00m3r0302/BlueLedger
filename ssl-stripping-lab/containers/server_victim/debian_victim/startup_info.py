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