#!/bin/bash

echo "Starting login test for pedermo user..."
echo "This script will attempt login every 2 minutes"
echo "Press Ctrl+C to stop"

while true; do
    echo ""
    echo "[$(date)] Attempting login as pedermo..."
    
    response=$(curl -X POST "http://localhost:5000/api/auth/login" \
                    -H "Content-Type: application/json" \
                    -d '{"email":"pedermo@sinamoa.com","password":"ChemicalReaction42!"}' \
                    --silent --show-error --write-out "HTTPSTATUS:%{http_code}")
    
    http_code=$(echo $response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    http_body=$(echo $response | sed -E 's/HTTPSTATUS\:[0-9]*$//')
    
    echo "HTTP Status: $http_code"
    
    if [ "$http_code" = "200" ]; then
        echo "✓ Login successful!"
        echo "Response: $http_body"
    elif [ "$http_code" = "401" ]; then
        echo "✗ Login failed - Invalid credentials"
        echo "Response: $http_body"
    elif [ "$http_code" = "000" ]; then
        echo "✗ Connection failed - Server may be down"
    else
        echo "✗ Login failed with HTTP $http_code"
        echo "Response: $http_body"
    fi
    
    echo "Waiting 2 minutes before next attempt..."
    sleep 120
done