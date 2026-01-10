const crypto = require('crypto');

// Generate a UUID v4 using Node.js crypto module
const generateUUID = () => {
  return crypto.randomUUID();
};

module.exports = {
  generateUUID,
};
