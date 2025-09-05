#!/usr/bin/env python3
"""
Victim traffic simulator for SSL downgrade attack research
Sends login requests every 30 seconds to test SSL stripping
"""

import requests
import time
import random
from urllib3.exceptions import InsecureRequestWarning

# Disable SSL warnings for testing
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Get target IP from user
target_ip = input("Enter target IP address: ").strip()
TARGET_URL = f"https://{target_ip}:5001/api/auth/login"
LOGIN_DATA = {
    "username": "Employee@sinamoa.com",
    "password": "Employee123!@#",
    "csrf_token": "dummy_token"
}

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
]

def simulate_login():
    """Simulate a user login attempt"""
    try:
        headers = {
            "User-Agent": random.choice(USER_AGENTS),
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": TARGET_URL.replace("/login", "/")
        }
        
        print(f"[{time.strftime('%H:%M:%S')}] Sending login request to {TARGET_URL}")
        
        # Make the request (SSL will be stripped by bettercap)
        response = requests.post(
            TARGET_URL,
            data=LOGIN_DATA,
            headers=headers,
            timeout=10,
            verify=False  # Ignore SSL cert issues for testing
        )
        
        print(f"[{time.strftime('%H:%M:%S')}] Response: {response.status_code}")
        
    except requests.exceptions.RequestException as e:
        print(f"[{time.strftime('%H:%M:%S')}] Error: {e}")

def main():
    print("Starting victim traffic simulator...")
    print("Press Ctrl+C to stop")
    print("-" * 50)
    
    try:
        while True:
            simulate_login()
            print(f"[{time.strftime('%H:%M:%S')}] Waiting 30 seconds...")
            time.sleep(30)
            
    except KeyboardInterrupt:
        print("\nStopping simulator...")

if __name__ == "__main__":
    main()