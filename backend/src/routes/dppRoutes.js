const express = require('express');
const router = express.Router();
const {
  uploadDPP,
  getFacultyDPPs,
  getStudentDPPs,
  downloadDPP,
  deleteDPP,
} = require('../controllers/dppController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('faculty', 'admin'), uploadDPP);
router.get('/faculty', protect, authorize('faculty', 'admin'), getFacultyDPPs);
router.get('/student', protect, getStudentDPPs);
router.get('/:id/download', protect, downloadDPP);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteDPP);

module.exports = router;

