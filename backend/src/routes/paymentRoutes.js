const express = require('express');
const router = express.Router();
const {
  getPayments,
  collectFee,
  getMyPayments,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyPayments);

router.route('/')
  .get(protect, authorize('admin'), getPayments)
  .post(protect, authorize('admin'), collectFee);

module.exports = router;

