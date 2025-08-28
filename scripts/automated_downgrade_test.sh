#!/bin/bash

echo "Automated SSL Downgrade Testing Suite"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test credentials
EMAIL="pedermo@sinamoa.com"
PASSWORD="ChemicalReaction42!"

# Endpoints
HTTPS_ENDPOINT="https://localhost:5443/api/auth/login"
HTTP_ENDPOINT="http://localhost:5000/api/auth/login"

echo "Target Application: BlueLedger"
echo "Test User: $EMAIL"
echo "HTTPS Endpoint: $HTTPS_ENDPOINT"
echo "HTTP Endpoint: $HTTP_ENDPOINT"
echo ""

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local protocol=$2
    local description=$3
    
    echo -e "${YELLOW}Testing: $description${NC}"
    echo "Endpoint: $endpoint"
    
    response=$(curl -X POST "$endpoint" \
                    -H "Content-Type: application/json" \
                    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
                    --silent --show-error --write-out "HTTPSTATUS:%{http_code}" \
                    --insecure --connect-timeout 5 2>&1)
    
    if [ $? -eq 0 ]; then
        http_code=$(echo $response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
        http_body=$(echo $response | sed -E 's/HTTPSTATUS\:[0-9]*$//')
        
        if [ "$http_code" = "200" ]; then
            echo -e "Status: ${GREEN}SUCCESS ($http_code)${NC}"
            echo "Response: $http_body" | head -c 100
            echo "..."
        else
            echo -e "Status: ${RED}FAILED ($http_code)${NC}"
        fi
    else
        echo -e "Status: ${RED}CONNECTION FAILED${NC}"
        echo "Error: $response"
    fi
    echo ""
}

# Test 1: Direct endpoint comparison
echo "=== Test 1: Direct Endpoint Comparison ==="
test_endpoint "$HTTPS_ENDPOINT" "HTTPS" "Direct HTTPS Request (Encrypted)"
test_endpoint "$HTTP_ENDPOINT" "HTTP" "Direct HTTP Request (Cleartext)"

# Test 2: Packet capture simulation
echo "=== Test 2: Traffic Analysis Simulation ==="
echo -e "${YELLOW}Simulating network packet capture...${NC}"

echo "HTTP Request (What an attacker would see in cleartext):"
echo "----------------------------------------------------"
echo "POST /api/auth/login HTTP/1.1"
echo "Host: localhost:5000"
echo "Content-Type: application/json"
echo "Content-Length: 68"
echo ""
echo "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"
echo ""

echo "HTTPS Request (What an attacker would see encrypted):"
echo "---------------------------------------------------"
echo "POST /api/auth/login HTTP/1.1"
echo "Host: localhost:5443"
echo "Content-Type: application/json"
echo ""
echo "[ENCRYPTED TLS DATA - CREDENTIALS PROTECTED]"
echo ""

# Test 3: Proxy attack simulation
echo "=== Test 3: Proxy Attack Simulation ==="
echo -e "${YELLOW}Starting SSL Strip proxy for 10 seconds...${NC}"

# Start our custom proxy in background
python3 scripts/ssl_strip_demo.py &
PROXY_PID=$!

sleep 2

# Test through proxy
echo "Testing request through proxy (simulating downgrade attack)..."
proxy_response=$(curl -X POST "$HTTPS_ENDPOINT" \
                     -H "Content-Type: application/json" \
                     -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
                     --proxy localhost:8080 \
                     --silent --show-error --write-out "HTTPSTATUS:%{http_code}" \
                     --insecure --connect-timeout 3 2>&1)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Proxy attack simulation completed${NC}"
    echo "Check proxy logs for captured credentials"
else
    echo -e "${YELLOW}Proxy test skipped (proxy may not be running)${NC}"
fi

# Cleanup proxy
kill $PROXY_PID 2>/dev/null
wait $PROXY_PID 2>/dev/null

echo ""

# Test 4: Security headers check
echo "=== Test 4: Security Headers Analysis ==="
echo -e "${YELLOW}Checking for security headers...${NC}"

headers_response=$(curl -I "$HTTPS_ENDPOINT" --insecure --silent 2>/dev/null)

if echo "$headers_response" | grep -i "strict-transport-security" > /dev/null; then
    echo -e "HSTS Header: ${GREEN}PRESENT${NC} (Good - helps prevent downgrade attacks)"
else
    echo -e "HSTS Header: ${RED}MISSING${NC} (Vulnerable to downgrade attacks)"
fi

if echo "$headers_response" | grep -i "content-security-policy" > /dev/null; then
    echo -e "CSP Header: ${GREEN}PRESENT${NC}"
else
    echo -e "CSP Header: ${YELLOW}MISSING${NC}"
fi

if echo "$headers_response" | grep -i "x-frame-options" > /dev/null; then
    echo -e "X-Frame-Options: ${GREEN}PRESENT${NC}"
else
    echo -e "X-Frame-Options: ${YELLOW}MISSING${NC}"
fi

echo ""

# Test 5: Certificate analysis
echo "=== Test 5: Certificate Analysis ==="
echo -e "${YELLOW}Analyzing SSL certificate...${NC}"

cert_info=$(echo | openssl s_client -connect localhost:5443 -servername localhost 2>/dev/null | openssl x509 -noout -text 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "Certificate: ${GREEN}VALID${NC}"
    echo "Subject: $(echo "$cert_info" | grep "Subject:" | head -1)"
    echo "Issuer: $(echo "$cert_info" | grep "Issuer:" | head -1)"
    
    # Check for weak cipher suites
    weak_ciphers=$(echo | openssl s_client -connect localhost:5443 -cipher 'DES:RC4:MD5' 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "Weak Ciphers: ${RED}SUPPORTED${NC} (Vulnerability)"
    else
        echo -e "Weak Ciphers: ${GREEN}REJECTED${NC}"
    fi
else
    echo -e "Certificate: ${RED}INVALID OR UNREACHABLE${NC}"
fi

echo ""

# Summary
echo "=== Test Summary ==="
echo "This test suite demonstrates:"
echo "1. ✅ Direct HTTP vs HTTPS comparison"  
echo "2. ✅ Network traffic analysis simulation"
echo "3. ✅ SSL Strip proxy attack demonstration"
echo "4. ✅ Security headers evaluation"
echo "5. ✅ SSL certificate analysis"
echo ""
echo -e "${GREEN}Testing completed!${NC}"
echo ""
echo "For detailed attack methodology, see:"
echo "📖 docs/SSL_DOWNGRADE_ATTACK_GUIDE.md"
echo ""
echo "Tools covered in the guide:"
echo "🔧 Burp Suite Professional"
echo "🔧 Bettercap" 
echo "🔧 Ettercap"
echo "🔧 SSLstrip"
echo "🔧 mitmproxy"