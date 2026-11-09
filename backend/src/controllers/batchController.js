const Batch = require('../models/Batch');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// @desc    Get all batches
// @route   GET /api/batches
// @access  Public / Private
const getBatches = async (req, res, next) => {
  try {
    const { status, targetClass, search } = req.query;

    let query = {};
    if (status && status !== 'All') query.status = status;
    if (targetClass && targetClass !== 'All') query.targetClass = targetClass;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { timeSlot: { $regex: search, $options: 'i' } },
        { targetClass: { $regex: search, $options: 'i' } },
        { facultyName: { $regex: search, $options: 'i' } },
      ];
    }

    const batches = await Batch.find(query)
      .populate('course', 'name code totalFee')
      .populate('faculty', 'name designation phone email')
      .sort({ createdAt: 1 });

    const enrichedBatches = await Promise.all(
      batches.map(async (batch) => {
        const count = await Student.countDocuments({
          'enrolledCourses.batch': batch._id,
          status: 'Active',
        });
        const batchObj = batch.toObject();
        batchObj.enrolledCount = count;
        return batchObj;
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedBatches.length,
      data: enrichedBatches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single batch by ID
// @route   GET /api/batches/:id
// @access  Private
const getBatchById = async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('course')
      .populate('faculty');

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const students = await Student.find({
      'enrolledCourses.batch': batch._id,
    }).select('studentId name rollNo mobile email targetClass status attendanceRate totalFee feePaid pendingFee');

    res.status(200).json({
      success: true,
      data: {
        ...batch.toObject(),
        students,
        enrolledCount: students.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new batch
// @route   POST /api/batches
// @access  Admin only
const createBatch = async (req, res, next) => {
  try {
    const {
      name,
      code,
      timeSlot,
      targetClass,
      course,
      courseName,
      faculty,
      facultyName,
      days,
      room,
      capacity,
      status,
      description,
    } = req.body;

    const newBatch = await Batch.create({
      name,
      code: code || `PM-B-${Date.now().toString().slice(-4)}`,
      timeSlot,
      targetClass,
      course,
      courseName,
      faculty,
      facultyName: facultyName || 'Arun Sir',
      days: days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      room: room || 'Hall A',
      capacity: capacity || 40,
      status: status || 'Active',
      description,
    });

    res.status(201).json({
      success: true,
      data: newBatch,
      message: 'Batch created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update batch
// @route   PUT /api/batches/:id
// @access  Admin only
const updateBatch = async (req, res, next) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    res.status(200).json({
      success: true,
      data: batch,
      message: 'Batch updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle batch active/inactive status
// @route   PATCH /api/batches/:id/toggle-status
// @access  Admin only
const toggleBatchStatus = async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    batch.status = batch.status === 'Active' ? 'Inactive' : 'Active';
    await batch.save();

    res.status(200).json({
      success: true,
      data: batch,
      message: `Batch status updated to ${batch.status}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete batch
// @route   DELETE /api/batches/:id
// @access  Admin only
const deleteBatch = async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    await batch.deleteOne();
    res.status(200).json({ success: true, message: 'Batch deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  toggleBatchStatus,
  deleteBatch,
};
