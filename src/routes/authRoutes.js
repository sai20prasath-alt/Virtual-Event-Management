const express = require('express');
const AuthController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validator');

const router = express.Router();

// POST /api/auth/register - User registration
router.post('/register', validateRegister, AuthController.register);

// POST /api/auth/login - User login
router.post('/login', validateLogin, AuthController.login);

module.exports = router;
