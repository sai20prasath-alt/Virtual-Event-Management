const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET || 'super_secret_key_123';

class AuthService {
  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId, role) {
    return jwt.sign({ userId, role }, jwt_secret, { expiresIn: '24h' });
  }

  static verifyToken(token) {
    return jwt.verify(token, jwt_secret);
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
