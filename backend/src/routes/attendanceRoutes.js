const express = require('express');
const router = express.Router();
const {
  getBatchAttendanceByDate,
  saveBatchAttendance,
  getMyAttendanceHistory,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/student/me', protect, getMyAttendanceHistory);

router.route('/batch/:batchId')
  .get(protect, authorize('faculty', 'admin'), getBatchAttendanceByDate)
  .post(protect, authorize('faculty', 'admin'), saveBatchAttendance);

module.exports = router;

