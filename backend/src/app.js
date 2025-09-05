const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('../routes/auth');
const crmRoutes = require('../routes/crm');
const shipmentsRoutes = require('../routes/shipments');
const contractsRoutes = require('../routes/contracts');
const analyticsRoutes = require('../routes/analytics');
const adminRoutes = require('../routes/admin');

const errorHandler = require('../middleware/errorHandler');
const { authMiddleware } = require('../middleware/auth');

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(morgan('combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sinamoa-chemicals', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Seed database with initial data if environment allows
  if (process.env.SEED_DATABASE === 'true' || process.env.NODE_ENV === 'development') {
    try {
      const seedUsers = require('../seed');
      console.log('Seeding database with initial data...');
      await seedUsers();
    } catch (error) {
      console.error('Database seeding failed:', error);
      // Don't exit, just log the error and continue
    }
  }
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/crm', authMiddleware, crmRoutes);
app.use('/api/shipments', authMiddleware, shipmentsRoutes);
app.use('/api/contracts', authMiddleware, contractsRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const https = require('https');
const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 5001;

// HTTP server
http.createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP Server running on 0.0.0.0:${PORT}`);
});

// HTTPS server with self-signed certificate
try {
  const httpsOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
  
  https.createServer(httpsOptions, app).listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log(`HTTPS Server running on 0.0.0.0:${HTTPS_PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
} catch (error) {
  console.log('HTTPS server not started - SSL certificates not found');
  console.log('Run: openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"');
}