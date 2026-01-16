const UserModel = require('../models/user');
const AuthService = require('../services/authService');
const EmailService = require('../services/emailService');
const logger = require('../utils/logger');
const { formatResponse, formatError } = require('../utils/responseFormatter');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, name, role } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        logger.warn(`Registration attempt with existing email: ${email}`);
        return res.status(400).json(
          formatError('Email already registered', 400)
        );
      }

      // Hash password
      const hashedPassword = await AuthService.hashPassword(password);

      // Create user
      const user = await UserModel.create({
        email,
        password: hashedPassword,
        name,
        role: role || 'attendee',
      });

      // Send welcome email asynchronously
      EmailService.sendWelcomeEmail(user.email, user.name).catch((error) => {
        logger.error('Failed to send welcome email', error);
      });

      logger.info(`User registered successfully: ${user.id}`);

      res.status(201).json(
        formatResponse(
          {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          'User registered successfully',
          201
        )
      );
    } catch (error) {
      logger.error('Registration error', error);
      res.status(500).json(formatError(error.message, 500, error));
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);

      if (!user) {
        logger.warn(`Login attempt with non-existent email: ${email}`);
        return res.status(401).json(
          formatError('Invalid email or password', 401)
        );
      }

      const isPasswordValid = await AuthService.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        logger.warn(`Failed login attempt for user: ${user.id}`);
        return res.status(401).json(
          formatError('Invalid email or password', 401)
        );
      }

      const token = AuthService.generateToken(user.id, user.role);

      logger.info(`User logged in successfully: ${user.id}`);

      res.json(
        formatResponse(
          {
            token,
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          'Login successful'
        )
      );
    } catch (error) {
      logger.error('Login error', error);
      res.status(500).json(formatError(error.message, 500, error));
    }
  }
}

module.exports = AuthController;
