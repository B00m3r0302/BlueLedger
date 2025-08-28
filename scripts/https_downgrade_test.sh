#!/bin/bash

echo "HTTPS Downgrade Attack Testing Script"
echo "====================================="
echo ""

# Test credentials
EMAIL="pedermo@sinamoa.com"
PASSWORD="ChemicalReaction42!"

# Endpoints
HTTPS_ENDPOINT="https://localhost:5443/api/auth/login"
HTTP_ENDPOINT="http://localhost:5000/api/auth/login"

echo "Testing HTTPS endpoint security..."
echo "HTTPS URL: $HTTPS_ENDPOINT"
echo "HTTP URL: $HTTP_ENDPOINT"
echo ""

# Function to test login
test_login() {
    local endpoint=$1
    local protocol=$2
    
    echo "[$protocol] Testing login to: $endpoint"
    
    response=$(curl -X POST "$endpoint" \
                    -H "Content-Type: application/json" \
                    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
                    --silent --show-error --write-out "HTTPSTATUS:%{http_code}" \
                    --insecure 2>&1)
    
    http_code=$(echo $response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    http_body=$(echo $response | sed -E 's/HTTPSTATUS\:[0-9]*$//')
    
    echo "  Status: $http_code"
    
    if [ "$http_code" = "200" ]; then
        echo "  ✓ Login successful!"
        echo "  Response: $http_body"
    elif [ "$http_code" = "401" ]; then
        echo "  ✗ Login failed - Invalid credentials"
    elif [ "$http_code" = "000" ]; then
        echo "  ✗ Connection failed - Server may be down"
        echo "  Error: $http_body"
    else
        echo "  ✗ Login failed with HTTP $http_code"
        echo "  Response: $http_body"
    fi
    echo ""
}

# Test both endpoints
echo "=== Normal HTTPS Test ==="
test_login "$HTTPS_ENDPOINT" "HTTPS"

echo "=== HTTP Fallback Test ==="
test_login "$HTTP_ENDPOINT" "HTTP"

echo "=== Downgrade Attack Simulation ==="
echo "This simulates what an attacker might capture in a downgrade attack:"
echo ""

# Show what would be captured in cleartext over HTTP
echo "HTTP Request (cleartext - what an attacker would see):"
echo "POST /api/auth/login HTTP/1.1"
echo "Host: localhost:5000"
echo "Content-Type: application/json"
echo ""
echo "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"
echo ""

echo "HTTPS Request (encrypted - what an attacker would NOT see):"
echo "POST /api/auth/login HTTP/1.1"
echo "Host: localhost:5443"
echo "Content-Type: application/json"
echo ""
echo "[ENCRYPTED TLS DATA - credentials are protected]"
echo ""

echo "=== Security Testing Tips ==="
echo "To test SSL/TLS downgrade attacks:"
echo "1. Use Burp Suite or OWASP ZAP as a proxy"
echo "2. Configure your browser to use the proxy"
echo "3. Enable SSL Kill Switch or similar tools"
echo "4. Monitor traffic for downgrade attempts"
echo "5. Check if the application forces HTTPS redirects"
echo ""
echo "For packet capture analysis:"
echo "sudo tcpdump -i lo -A -s 0 'port 5000 or port 5443'"
echo ""
echo "Test completed!"