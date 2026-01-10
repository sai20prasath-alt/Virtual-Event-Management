const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  JWT_SECRET,
  PORT,
  NODE_ENV,
};
