
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const batchRoutes = require('./routes/batchRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const reportRoutes = require('./routes/reportRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const dppRoutes = require('./routes/dppRoutes');

const { errorHandler } = require('./middleware/errorMiddleware');
const { generalApiRateLimiter } = require('./middleware/rateLimiter');

const app = express();

// Trust reverse proxy (Required for Render, Vercel, Cloudflare to correctly extract client IP for rate limiting)
app.set('trust proxy', 1);

// Hide server tech stack information
app.disable('x-powered-by');

// Production HTTP Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

// Production CORS Configuration
const allowedOrigins = [
  'https://www.physicsmirror.co.in',
  'https://physicsmirror.co.in',
  'https://physics-mirror-indol.vercel.app',
  'https://physics-mirror-api.onrender.com',
  'https://physicsmirror.com',
  'https://www.physicsmirror.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server health checks)
      if (!origin) return callback(null, true);
      // Allow localhost in development / pair-programming
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      // Allow Vercel preview domains and production origins
      if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback permissive for smooth client operations
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

app.use(express.json({ limit: '10mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// General API Rate Limiting (Protects all /api routes against scraping & flood attacks)
app.use('/api', generalApiRateLimiter);

// Static assets
app.use('/assets', express.static(
  path.join(__dirname, '../assets')
));

// Health Check
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;

  const states = [
    'Disconnected',
    'Connected',
    'Connecting',
    'Disconnecting'
  ];

  res.status(200).json({
    success: true,
    service: 'Physics Mirror Management System API',
    status: 'Operational',
    database: {
      status: states[dbState] || 'Unknown',
      host: mongoose.connection.host || 'MongoDB Atlas',
      name: mongoose.connection.name || 'physics_mirror'
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/dpp', dppRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'The requested service or route is currently not available or still deploying. Please try again shortly.'
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
