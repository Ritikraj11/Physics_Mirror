const express = require('express');
const router = express.Router();
const {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  toggleBatchStatus,
  deleteBatch,
} = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBatches) // public or private viewable
  .post(protect, authorize('admin'), createBatch);

router.route('/:id')
  .get(protect, getBatchById)
  .put(protect, authorize('admin'), updateBatch)
  .delete(protect, authorize('admin'), deleteBatch);

router.patch('/:id/toggle-status', protect, authorize('admin'), toggleBatchStatus);

module.exports = router;

