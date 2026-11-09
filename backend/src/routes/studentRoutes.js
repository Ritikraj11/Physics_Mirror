const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  generateNextStudentId,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/next-id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const nextId = await generateNextStudentId();
    res.json({ success: true, nextId });
  } catch (e) {
    next(e);
  }
});

router.route('/')
  .get(protect, getStudents)
  .post(protect, authorize('admin'), createStudent);

router.route('/:id')
  .get(protect, getStudentById)
  .put(protect, authorize('admin'), updateStudent)
  .delete(protect, authorize('admin'), deleteStudent);

module.exports = router;

