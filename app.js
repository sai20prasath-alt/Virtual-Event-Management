const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const participantRoutes = require('./src/routes/participantRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/events', participantRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Server shutting down...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = app;
