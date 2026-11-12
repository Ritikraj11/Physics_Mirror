const express = require('express');
const router = express.Router();
const { login, getMe, updatePassword, createAdminUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { loginRateLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginRateLimiter, login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);
router.post('/create-admin', protect, authorize('admin'), createAdminUser);

module.exports = router;

