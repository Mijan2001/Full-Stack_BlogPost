const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    register,
    verifyEmail,
    login,
    getCurrentUser,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.controller');

// Public routes
router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getCurrentUser);

module.exports = router;
