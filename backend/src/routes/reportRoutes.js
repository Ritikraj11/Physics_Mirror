const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getDetailedReports,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('admin'), getAdminDashboardStats);
router.get('/analytics', protect, authorize('admin'), getDetailedReports);

module.exports = router;

