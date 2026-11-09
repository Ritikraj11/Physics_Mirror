const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public / Private
const getCourses = async (req, res, next) => {
  try {
    const { targetClass, status } = req.query;

    let query = {};
    if (status && status !== 'All') query.status = status;
    if (targetClass && targetClass !== 'All') query.targetClass = targetClass;

    const courses = await Course.find(query).sort({ targetClass: 1 });
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Admin only
const createCourse = async (req, res, next) => {
  try {
    const { name, code, targetClass, totalFee, duration, description, features } = req.body;

    const course = await Course.create({
      name,
      code: code || `PM-C-${Date.now().toString().slice(-4)}`,
      targetClass,
      totalFee,
      duration: duration || '1 Year',
      description,
      features: features || [
        'Concept Clearing Sessions',
        'Weekly Numerical Problem Sheets',
        'Doubt Solving by Arun Sir',
      ],
    });

    res.status(201).json({ success: true, data: course, message: 'Course created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Admin only
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, data: course, message: 'Course updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Admin only
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    await course.deleteOne();
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
