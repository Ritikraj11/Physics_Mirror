
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

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

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
    message: `API Route not found: ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
