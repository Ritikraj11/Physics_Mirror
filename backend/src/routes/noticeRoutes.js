const express = require('express');
const router = express.Router();
const {
  getNotices,
  createNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getNotices)
  .post(protect, authorize('admin', 'faculty'), createNotice);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteNotice);

module.exports = router;

