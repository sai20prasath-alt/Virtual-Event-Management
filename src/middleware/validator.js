const AuthService = require('../services/authService');
const logger = require('../utils/logger');

const validateRegister = (req, res, next) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name) {
    logger.warn('Register validation failed: Missing required fields');
    return res.status(400).json({
      statusCode: 400,
      message: 'Email, password, and name are required',
    });
  }

  if (!AuthService.isValidEmail(email)) {
    logger.warn(`Register validation failed: Invalid email format - ${email}`);
    return res.status(400).json({
      statusCode: 400,
      message: 'Invalid email format',
    });
  }

  if (!AuthService.isValidPassword(password)) {
    logger.warn('Register validation failed: Password too short');
    return res.status(400).json({
      statusCode: 400,
      message: 'Password must be at least 6 characters long',
    });
  }

  if (role && !['organizer', 'attendee'].includes(role)) {
    logger.warn(`Register validation failed: Invalid role - ${role}`);
    return res.status(400).json({
      statusCode: 400,
      message: 'Role must be either "organizer" or "attendee"',
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn('Login validation failed: Missing email or password');
    return res.status(400).json({
      statusCode: 400,
      message: 'Email and password are required',
    });
  }

  if (!AuthService.isValidEmail(email)) {
    logger.warn(`Login validation failed: Invalid email format - ${email}`);
    return res.status(400).json({
      statusCode: 400,
      message: 'Invalid email format',
    });
  }

  next();
};

const validateCreateEvent = (req, res, next) => {
  const { title, description, date, time, location } = req.body;

  if (!title || !date || !time) {
    logger.warn('Event creation validation failed: Missing required fields');
    return res.status(400).json({
      statusCode: 400,
      message: 'Title, date, and time are required',
    });
  }

  if (title.length < 3) {
    logger.warn('Event creation validation failed: Title too short');
    return res.status(400).json({
      statusCode: 400,
      message: 'Title must be at least 3 characters long',
    });
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    logger.warn(`Event creation validation failed: Invalid date format - ${date}`);
    return res.status(400).json({
      statusCode: 400,
      message: 'Date must be in YYYY-MM-DD format',
    });
  }

  // Validate time format (HH:MM)
  if (!/^\d{2}:\d{2}$/.test(time)) {
    logger.warn(`Event creation validation failed: Invalid time format - ${time}`);
    return res.status(400).json({
      statusCode: 400,
      message: 'Time must be in HH:MM format',
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateEvent,
};
