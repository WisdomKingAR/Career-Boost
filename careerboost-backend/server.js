// CareerBoost Backend Server
// Main Express.js application

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Import routes
const certificatesRoutes = require('./routes/certificates');
const internshipsRoutes = require('./routes/internships');
const hackathonsRoutes = require('./routes/hackathons');
const newsRoutes = require('./routes/news');
const toolsRoutes = require('./routes/tools');
const projectsRoutes = require('./routes/projects');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// API Routes
app.use('/api/certificates', certificatesRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/hackathons', hackathonsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CareerBoost API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CareerBoost API',
    version: '1.0.0',
    endpoints: {
      certificates: '/api/certificates',
      internships: '/api/internships',
      hackathons: '/api/hackathons',
      news: '/api/news',
      tools: '/api/tools',
      projects: '/api/projects',
      users: '/api/users',
      auth: '/api/auth'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CareerBoost API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
