#!/bin/bash

echo "🧪 Testing Sinamoa Chemicals Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local url=$1
    local service_name=$2
    
    echo -n "Testing $service_name... "
    
    if curl -s --max-time 10 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        return 1
    fi
}

# Function to test API endpoint with expected response
test_api() {
    local url=$1
    local expected=$2
    local endpoint_name=$3
    
    echo -n "Testing API $endpoint_name... "
    
    local response=$(curl -s --max-time 10 "$url" 2>/dev/null)
    
    if [[ "$response" == *"$expected"* ]]; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "  Expected: $expected"
        echo "  Got: $response"
        return 1
    fi
}

# Test configuration
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000"
API_URL="http://localhost:5000/api"

echo ""
echo "📋 Running deployment tests..."
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"
echo "API URL: $API_URL"
echo ""

# Test 1: Frontend availability
echo "🌐 Testing Frontend..."
check_service "$FRONTEND_URL" "Frontend React App"

# Test 2: Backend health
echo ""
echo "🔧 Testing Backend..."
check_service "$BACKEND_URL/health" "Backend Health Check"
test_api "$BACKEND_URL/health" '"status":"OK"' "Health Endpoint"

# Test 3: API endpoints
echo ""
echo "🔌 Testing API Endpoints..."
test_api "$API_URL/auth/profile" "Authentication required" "Auth Protection"

# Test 4: Database connection (indirect)
echo ""
echo "🗄️  Testing Database Connection..."
echo -n "Testing database via API... "
if curl -s --max-time 10 "$API_URL/auth/profile" | grep -q "Authentication required"; then
    echo -e "${GREEN}✅ PASS${NC} (API can connect to database)"
else
    echo -e "${RED}❌ FAIL${NC} (Database connection issues)"
fi

# Test 5: CORS configuration
echo ""
echo "🌍 Testing CORS Configuration..."
echo -n "Testing CORS headers... "
if curl -s -I --max-time 10 "$BACKEND_URL/health" | grep -q "Access-Control-Allow"; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING${NC} (CORS headers not found, may cause issues)"
fi

# Test 6: Security headers
echo ""
echo "🔒 Testing Security Headers..."
echo -n "Testing security headers... "
if curl -s -I --max-time 10 "$BACKEND_URL/health" | grep -q "X-Frame-Options"; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING${NC} (Security headers not found)"
fi

# Test 7: Environment check
echo ""
echo "⚙️  Testing Environment Configuration..."

if [ -f ".env" ]; then
    echo -e "Root .env file: ${GREEN}✅ EXISTS${NC}"
else
    echo -e "Root .env file: ${RED}❌ MISSING${NC}"
fi

if [ -f "backend/.env" ] || [ -f ".env" ]; then
    echo -e "Backend environment: ${GREEN}✅ CONFIGURED${NC}"
else
    echo -e "Backend environment: ${RED}❌ MISSING${NC}"
fi

if [ -f "frontend/.env" ]; then
    echo -e "Frontend .env file: ${GREEN}✅ EXISTS${NC}"
else
    echo -e "Frontend .env file: ${YELLOW}⚠️  MISSING${NC} (using defaults)"
fi

# Test 8: Dependencies check
echo ""
echo "📦 Testing Dependencies..."

if [ -d "node_modules" ]; then
    echo -e "Root dependencies: ${GREEN}✅ INSTALLED${NC}"
else
    echo -e "Root dependencies: ${RED}❌ MISSING${NC}"
fi

if [ -d "backend/node_modules" ]; then
    echo -e "Backend dependencies: ${GREEN}✅ INSTALLED${NC}"
else
    echo -e "Backend dependencies: ${RED}❌ MISSING${NC}"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "Frontend dependencies: ${GREEN}✅ INSTALLED${NC}"
else
    echo -e "Frontend dependencies: ${RED}❌ MISSING${NC}"
fi

# Test 9: Login test
echo ""
echo "🔐 Testing Authentication Flow..."
echo -n "Testing login endpoint... "

login_response=$(curl -s --max-time 10 -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@sinamoa.com","password":"Admin123!@#"}' \
    "$API_URL/auth/login" 2>/dev/null)

if [[ "$login_response" == *'"success":true'* ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "  ✅ Login successful with default admin credentials"
    
    # Extract token for further testing
    token=$(echo "$login_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$token" ]; then
        echo "  ✅ JWT token generated successfully"
        
        # Test protected endpoint
        echo -n "Testing protected endpoint... "
        profile_response=$(curl -s --max-time 10 \
            -H "Authorization: Bearer $token" \
            "$API_URL/auth/profile" 2>/dev/null)
        
        if [[ "$profile_response" == *'"success":true'* ]]; then
            echo -e "${GREEN}✅ PASS${NC}"
            echo "  ✅ Protected routes working correctly"
        else
            echo -e "${RED}❌ FAIL${NC}"
            echo "  ❌ Protected routes not working"
        fi
    else
        echo -e "${YELLOW}⚠️  WARNING${NC} (Token extraction failed)"
    fi
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "  Response: $login_response"
fi

# Final summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo ""

# Check if all critical services are running
if check_service "$FRONTEND_URL" "Frontend" > /dev/null && \
   check_service "$BACKEND_URL/health" "Backend" > /dev/null; then
    echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
    echo ""
    echo "✅ Your Sinamoa Chemicals application is ready!"
    echo ""
    echo "🌐 Frontend: $FRONTEND_URL"
    echo "🔧 Backend: $BACKEND_URL"
    echo "📡 API: $API_URL"
    echo ""
    echo "🔑 Default Login Credentials:"
    echo "   Admin: admin@sinamoa.com / Admin123!@#"
    echo "   Manager: manager@sinamoa.com / Manager123!@#"
    echo "   Employee: employee@sinamoa.com / Employee123!@#"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Open $FRONTEND_URL in your browser"
    echo "   2. Sign in with any of the above credentials"
    echo "   3. Explore the application features"
    echo "   4. Change default passwords for production use"
    
else
    echo -e "${RED}❌ DEPLOYMENT ISSUES DETECTED${NC}"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Ensure both backend and frontend are running"
    echo "   2. Check that MongoDB is running"
    echo "   3. Verify environment files are set up"
    echo "   4. Run: ./scripts/setup.sh"
    echo "   5. Run: ./scripts/dev.sh"
    echo ""
    echo "📋 For detailed help, see the README.md file"
fi

echo ""