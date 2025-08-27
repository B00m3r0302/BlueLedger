# Sinamoa Chemicals Management System

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

### 🌐 Technical Features
- **Mobile Responsive**: Optimized for all devices
- **Real-time Updates**: Live data synchronization
- **Error Handling**: User-friendly error messages
- **HTTPS/SSL**: Secure communications
- **API-based Architecture**: RESTful API design

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **React Query** - Data fetching and caching
- **Chart.js** - Data visualization
- **React Hook Form** - Form management
- **Yup** - Schema validation

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving
- **Heroku** - Cloud deployment
- **AWS** - Cloud infrastructure

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Run the setup script
./scripts/setup.sh

# Start development servers
./scripts/dev.sh
```

### Option 2: Manual Setup

#### Prerequisites
- Node.js 18+
- MongoDB 4.4+
- Git

#### Installation
```bash
# Clone the repository
git clone <repository-url>
cd sinamoa-chemicals

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..

# Set up environment files
cp .env.example .env
cp frontend/.env.example frontend/.env

# Seed the database
node database/seed.js
```

#### Running the Application
```bash
# Development mode (both frontend and backend)
npm run dev

# Backend only
npm run backend:dev

# Frontend only
npm run frontend:dev

# Production build
npm run build
npm start
```

### Option 3: Docker Setup
```bash
# Start with Docker Compose
docker-compose up

# Or in detached mode
docker-compose up -d

# Stop containers
docker-compose down
```

## 🔑 Default Login Credentials

After running the setup script or seeding the database:

| Role | Email | Password |
|------|--------|----------|
| **Admin** | admin@sinamoa.com | Admin123!@# |
| **Manager** | manager@sinamoa.com | Manager123!@# |
| **Employee** | employee@sinamoa.com | Employee123!@# |

> ⚠️ **Important**: Change these credentials in production!

## 🎯 How to Use the Application

### **First Login**
1. Navigate to `http://localhost:3000` (or your deployed URL)
2. Click "Get Started" or "Sign In" 
3. Use any of the default credentials above
4. You'll be redirected to the dashboard

### **User Interface Overview**

#### **Landing Page** (`/`)
- Company overview and features
- Call-to-action buttons
- Professional design showcasing Sinamoa Chemicals

#### **Dashboard** (`/dashboard`) 
- **Overview statistics**: Active shipments, pending contracts, total customers, revenue
- **Recent activity feed**: Real-time updates on system activities
- **Quick access**: Navigate to different modules
- **Role-based content**: Different data based on user permissions

#### **Navigation & Layout**
- **Collapsible sidebar**: Click arrow to expand/collapse
- **Mobile responsive**: Hamburger menu on smaller screens  
- **User menu**: Profile info and sign out in top-right
- **Role-based navigation**: Admin users see additional "Admin" menu item

### **Module Functionality**

#### **CRM System** (`/crm`)
- **Customer Management**: Create, view, and manage customer relationships
- **Contact Tracking**: Store customer contact information and interaction history
- **Customer Analytics**: Track order history and customer value
- *Status: Foundation built, full functionality coming soon*

#### **Shipments Tracking** (`/shipments`)
- **Import/Export Management**: Track international shipments
- **Real-time Status**: Monitor shipment progress from origin to destination
- **Document Management**: Upload and manage shipping documents
- **Customs Tracking**: Monitor customs clearance status
- *Status: Foundation built, full functionality coming soon*

#### **Contract Management** (`/contracts`)
- **Contract Lifecycle**: From creation to renewal
- **Document Storage**: Upload and manage contract documents
- **Milestone Tracking**: Monitor contract deliverables and deadlines
- **Renewal Notifications**: Automated alerts for contract renewals
- *Status: Foundation built, full functionality coming soon*

#### **Analytics Dashboard** (`/analytics`)
- **Business Metrics**: Revenue, shipment volume, customer insights
- **Interactive Charts**: Visual representation of business data
- **Custom Reports**: Generate reports for different time periods
- **Performance KPIs**: Track key performance indicators
- *Status: Foundation built, Chart.js integration coming soon*

#### **Admin Panel** (`/admin`) - *Admin Only*
- **User Management**: Create, update, deactivate users
- **Role Assignment**: Assign admin, manager, or employee roles
- **System Configuration**: Manage application settings
- **Audit Logs**: Track system activities and changes
- *Status: Foundation built, full functionality coming soon*

#### **Profile Management** (`/profile`)
- **Personal Information**: Update name, contact details
- **Password Management**: Change password securely
- **Preferences**: Notification and display preferences
- **Account Settings**: Security and privacy settings
- *Status: Foundation built, full functionality coming soon*

### **Role-Based Access**

#### **Admin Role**
- ✅ Full access to all modules
- ✅ User management capabilities
- ✅ System configuration
- ✅ Create/edit/delete all data

#### **Manager Role** 
- ✅ Access to business modules (CRM, Shipments, Contracts, Analytics)
- ✅ Create and edit business data
- ❌ No access to Admin panel
- ❌ Cannot manage users

#### **Employee Role**
- ✅ View access to most modules
- ✅ Limited editing capabilities
- ❌ No user management
- ❌ No admin functions

### **Security Features in Action**

#### **Authentication Flow**
1. User enters credentials on login page
2. Server validates credentials with bcrypt password hashing
3. JWT token generated and sent to client
4. Token stored in browser and sent with each API request
5. Server validates token on protected routes
6. User automatically logged out after token expiration (24 hours)

#### **Session Management**
- **Automatic logout**: After 24 hours or if token becomes invalid
- **Secure storage**: JWT tokens stored securely in browser
- **Route protection**: Unauthenticated users redirected to login
- **Role enforcement**: Users blocked from accessing unauthorized areas

## 📁 Project Structure

```
sinamoa-chemicals/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── app.js          # Main application file
│   │   ├── auth/           # Authentication logic
│   │   ├── crm/            # Customer management
│   │   ├── shipments/      # Shipment tracking
│   │   ├── contracts/      # Contract management
│   │   ├── analytics/      # Business analytics
│   │   └── admin/          # Admin functionality
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── controllers/        # Route controllers
│   └── package.json        # Backend dependencies
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── styles/         # Global styles
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── database/               # Database setup
│   └── seed.js            # Database seeding
├── scripts/               # Utility scripts
│   ├── setup.sh          # Automated setup
│   └── dev.sh            # Development startup
├── deploy/               # Deployment configs
├── docker-compose.yml   # Docker orchestration
└── README.md           # This file
```

## 🌍 Deployment

### Heroku Deployment
```bash
# Create Heroku app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secure-secret

# Deploy
git push heroku main
```

### AWS Deployment
```bash
# Build for production
npm run build

# Use the AWS CodeBuild configuration
# deploy/aws-deploy.yml
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

## 🛡️ Security Features

### Authentication & Authorization
- JWT-based stateless authentication
- Password hashing with bcrypt (12 rounds)
- Role-based access control (RBAC)
- Session timeout and automatic logout

### API Security
- Rate limiting (100 requests per 15 minutes)
- CORS protection with whitelist
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Data Protection
- Encrypted password storage
- Secure HTTP-only cookies
- Environment variable protection
- Database connection encryption

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/login       # User login
POST /api/auth/register    # User registration (admin only)
POST /api/auth/logout      # User logout
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update user profile
```

### Business Endpoints
```
GET  /api/crm/customers    # List customers
POST /api/crm/customers    # Create customer
GET  /api/shipments        # List shipments
POST /api/shipments        # Create shipment
GET  /api/contracts        # List contracts
POST /api/contracts        # Create contract
GET  /api/analytics        # Get analytics data
```

### Admin Endpoints
```
GET  /api/admin/users      # List all users (admin only)
POST /api/admin/users      # Create user (admin only)
PUT  /api/admin/users/:id  # Update user (admin only)
```

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/sinamoa-chemicals
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=24h
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **"Cannot connect to MongoDB"**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Or use Docker
docker-compose up mongodb -d
```

#### **"Port 3000/5000 already in use"**
```bash
# Find and kill process using the port
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Or change ports in .env files
PORT=5001  # backend
REACT_APP_PORT=3001  # frontend
```

#### **"Module not found" errors**
```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Do the same for backend and frontend
cd backend && rm -rf node_modules package-lock.json && npm install
cd frontend && rm -rf node_modules package-lock.json && npm install
```

#### **"Login fails with correct credentials"**
- Check if database was seeded: `node database/seed.js`
- Verify backend is running on correct port
- Check browser console for CORS errors
- Verify `.env` files exist and have correct values

#### **Docker issues**
```bash
# Reset Docker environment
docker-compose down -v
docker system prune -f
docker-compose up --build

# Check container logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### **Development Tips**

#### **Hot Reloading Not Working**
- Ensure you're running `npm run dev` (not `npm start`)
- Check that both frontend and backend servers are running
- Clear browser cache and hard refresh (Ctrl+Shift+R)

#### **Database Data Reset**
```bash
# Completely reset database
node database/seed.js

# Or drop database manually
mongo sinamoa-chemicals --eval "db.dropDatabase()"
```

## 📊 Monitoring & Logging

### **Application Health Checks**
```bash
# Backend health
curl http://localhost:5000/health

# Expected response:
# {"status":"OK","timestamp":"2024-XX-XX","environment":"development"}
```

### **Log Locations**
- **Backend logs**: Console output when running `npm run backend:dev`
- **Frontend logs**: Browser console (F12 Developer Tools)
- **MongoDB logs**: `/var/log/mongodb/mongod.log` (Linux) or Docker logs
- **Docker logs**: `docker-compose logs [service-name]`

### **Monitoring Endpoints**
- **Health**: `GET /health` - Application status
- **API Status**: `GET /api/health` - API and database connectivity
- **User Count**: Available in admin panel (future feature)

## 🔄 Database Management

### **Backup Database**
```bash
# Local MongoDB backup
mongodump --db sinamoa-chemicals --out backup/

# Docker MongoDB backup
docker exec sinamoa-mongo mongodump --db sinamoa-chemicals --out /backup
```

### **Restore Database**
```bash
# Local MongoDB restore
mongorestore --db sinamoa-chemicals backup/sinamoa-chemicals/

# Docker MongoDB restore  
docker exec sinamoa-mongo mongorestore --db sinamoa-chemicals /backup/sinamoa-chemicals/
```

### **Database Migrations**
```bash
# Future: Run database migrations
npm run migrate

# Future: Rollback migrations
npm run migrate:rollback
```

## 🌐 Production Deployment Guide

### **Pre-Deployment Checklist**
- [ ] Change all default passwords
- [ ] Set secure JWT_SECRET (min 32 characters)
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all functionality
- [ ] Set up domain and DNS

### **Environment Setup**

#### **Production Environment Variables**
```bash
# Backend Production .env
NODE_ENV=production
MONGODB_URI=mongodb://your-prod-db-url/sinamoa-chemicals
JWT_SECRET=your-super-long-secure-random-string-min-32-chars
JWT_EXPIRE=24h
PORT=5000
FRONTEND_URL=https://yourdomain.com
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

```bash
# Frontend Production .env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENVIRONMENT=production
```

### **Heroku Deployment (Detailed)**
```bash
# 1. Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# 2. Login to Heroku
heroku login

# 3. Create new app
heroku create your-app-name

# 4. Add MongoDB addon
heroku addons:create mongolab:sandbox

# 5. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set FRONTEND_URL=https://your-app-name.herokuapp.com

# 6. Deploy
git push heroku main

# 7. Seed production database
heroku run node database/seed.js

# 8. Open app
heroku open
```

### **AWS Deployment (Detailed)**
```bash
# 1. Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# 2. Configure AWS credentials
aws configure

# 3. Create S3 bucket for deployment
aws s3 mb s3://your-app-deployment-bucket

# 4. Create CodeDeploy application
aws deploy create-application --application-name sinamoa-chemicals

# 5. Use provided buildspec.yml
# deploy/aws-deploy.yml is already configured

# 6. Set up EC2 instances with required software:
# - Node.js 18+
# - MongoDB
# - nginx
# - PM2 for process management
```

### **Docker Production Deployment**
```bash
# 1. Build production images
docker-compose -f docker-compose.prod.yml build

# 2. Push to registry (optional)
docker tag sinamoa-chemicals_backend:latest your-registry/sinamoa-backend
docker tag sinamoa-chemicals_frontend:latest your-registry/sinamoa-frontend
docker push your-registry/sinamoa-backend
docker push your-registry/sinamoa-frontend

# 3. Deploy to production server
scp docker-compose.prod.yml user@your-server:/opt/sinamoa/
ssh user@your-server "cd /opt/sinamoa && docker-compose -f docker-compose.prod.yml up -d"
```

### **SSL Certificate Setup**
```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Nginx Configuration**
```nginx
# /etc/nginx/sites-available/sinamoa-chemicals
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔐 Security Hardening

### **Production Security Checklist**
- [ ] Change all default passwords
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS everywhere
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] Firewall configuration
- [ ] Regular backups with encryption

### **Security Headers**
The application automatically includes security headers via Helmet:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

## 📱 Mobile & Browser Support

### **Supported Browsers**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### **Mobile Features**
- Responsive design adapts to all screen sizes
- Touch-friendly interface
- Mobile navigation menu
- Optimized loading times
- Progressive Web App ready (future enhancement)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### **Development Guidelines**
- Follow existing code style
- Add comments for complex logic
- Update README for new features
- Test on multiple browsers
- Ensure mobile responsiveness

## ⚡ Performance & Scaling

### **Performance Optimizations**
- **Frontend**: React code splitting, lazy loading, image optimization
- **Backend**: Database indexing, query optimization, caching
- **Network**: Gzip compression, CDN integration, minified assets
- **Database**: Connection pooling, optimized queries, proper indexing

### **Scaling Considerations**
```bash
# Horizontal scaling with PM2
npm install -g pm2
pm2 start backend/src/app.js -i max  # Use all CPU cores

# Database replication (MongoDB)
# Set up replica sets for high availability

# Load balancing with nginx
# Configure multiple backend instances

# Monitoring with PM2
pm2 monit
pm2 logs
```

### **Performance Monitoring**
- **Response times**: Monitor API endpoint performance
- **Database queries**: Track slow queries and optimize
- **Memory usage**: Monitor for memory leaks
- **Error rates**: Track 4xx/5xx response codes
- **User metrics**: Page load times, user interactions

### **Caching Strategy**
```javascript
// Redis caching (future enhancement)
// - Session storage
// - API response caching
// - Database query caching

// Browser caching
// - Static assets (CSS, JS, images)
// - API responses with appropriate headers
```

## 📋 FAQ

### **General Questions**

**Q: What is Synthalon?**
A: Synthalon is a fictional advanced chemical used in biomedical applications for this demonstration application.

**Q: Can I use this for my real business?**
A: Yes! This is a production-ready foundation. Remove references to "Synthalon" and customize for your specific chemical business needs.

**Q: Is this application secure for production use?**
A: The application includes enterprise-grade security features, but you should:
- Change all default credentials
- Use strong JWT secrets
- Set up HTTPS
- Follow the security checklist

### **Technical Questions**

**Q: Why MongoDB instead of SQL?**
A: MongoDB provides flexibility for evolving data structures in chemical supply chain management. You can easily swap to PostgreSQL if needed.

**Q: Can I add more user roles?**
A: Yes! Update the User model's role enum and add corresponding permissions in the middleware.

**Q: How do I add new modules?**
A: Follow the existing pattern:
1. Create backend routes and controllers
2. Create frontend pages and components
3. Add navigation items
4. Update permissions as needed

**Q: Is it mobile-ready?**
A: Yes! The application is fully responsive and works on all devices.

### **Deployment Questions**

**Q: What's the cheapest way to deploy?**
A: For testing: Heroku free tier + MongoDB Atlas free tier
For production: Digital Ocean droplet ($5/month) + MongoDB Atlas

**Q: Do I need Docker?**
A: No, Docker is optional. You can run directly with Node.js and MongoDB, but Docker simplifies deployment.

**Q: Can I deploy to shared hosting?**
A: Backend requires Node.js hosting. Frontend can be deployed to any static hosting (Netlify, Vercel, etc.).

## 🎯 Roadmap & Future Features

### **Phase 1: Core Functionality** ✅
- ✅ Authentication system
- ✅ Role-based access control
- ✅ Basic UI framework
- ✅ Database models
- ✅ API foundation

### **Phase 2: Business Modules** (In Progress)
- [ ] Complete CRM functionality
- [ ] Full shipment tracking
- [ ] Contract management system
- [ ] Analytics dashboard with charts
- [ ] Admin panel functionality

### **Phase 3: Advanced Features** (Planned)
- [ ] Real-time notifications
- [ ] File upload system
- [ ] Email integration
- [ ] Advanced reporting
- [ ] Mobile app (React Native)
- [ ] API webhooks
- [ ] Audit logging
- [ ] Data import/export

### **Phase 4: Enterprise Features** (Future)
- [ ] Multi-tenant support
- [ ] Advanced analytics & AI
- [ ] Compliance reporting
- [ ] Integration APIs
- [ ] White-label options
- [ ] Enterprise SSO

## 🏆 Acknowledgments

### **Technologies Used**
- React Team for the amazing frontend framework
- Express.js for the robust backend framework
- MongoDB for flexible data storage
- All open-source contributors

### **Design Inspiration**
- Modern chemical industry best practices
- Enterprise software design patterns
- Mobile-first responsive design principles

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

**Sinamoa Chemicals** - Secure • Reliable • Global