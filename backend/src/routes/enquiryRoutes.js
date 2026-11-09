const express = require('express');
const router = express.Router();
const {
  submitEnquiry,
  getEnquiries,
  updateEnquiryStatus,
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', submitEnquiry);
router.get('/', protect, authorize('admin'), getEnquiries);
router.put('/:id', protect, authorize('admin'), updateEnquiryStatus);

module.exports = router;

