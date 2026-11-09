const express = require('express');
const router = express.Router();
const {
  getFaculties,
  getFacultyById,
  getMyBatches,
  getMyStudents,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me/batches', protect, authorize('faculty', 'admin'), getMyBatches);
router.get('/me/students', protect, authorize('faculty', 'admin'), getMyStudents);

router.route('/')
  .get(getFaculties)
  .post(protect, authorize('admin'), createFaculty);

router.route('/:id')
  .get(protect, getFacultyById)
  .put(protect, authorize('admin'), updateFaculty)
  .delete(protect, authorize('admin'), deleteFaculty);

module.exports = router;

