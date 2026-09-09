const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuth.controller');
const adminAuthMiddleware = require('../middlewares/adminAuth');

// Public routes
router.get('/captcha', adminAuthController.getCaptcha);
router.post('/login', adminAuthController.login);

// Protected routes (yêu cầu Admin JWT token)
router.get('/profile', adminAuthMiddleware, adminAuthController.getProfile);

module.exports = router;
