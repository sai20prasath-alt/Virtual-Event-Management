const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Application error', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    statusCode,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

module.exports = errorHandler;
