const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

class AuthService {
  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId, role) {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '24h' });
  }

  static verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password) {
    return password && password.length >= 6;
  }
}

module.exports = AuthService;
