const AuthService = require('../services/authService');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      logger.warn('Unauthorized access attempt: No token provided');
      return res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized: No token provided',
      });
    }

    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification failed', error);
    res.status(401).json({
      statusCode: 401,
      message: 'Unauthorized: Invalid or expired token',
    });
  }
};

module.exports = authMiddleware;
