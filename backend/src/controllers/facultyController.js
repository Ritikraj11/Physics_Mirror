const Faculty = require('../models/Faculty');
const User = require('../models/User');
const Batch = require('../models/Batch');
const Student = require('../models/Student');

// @desc    Get all faculty members
// @route   GET /api/faculties
// @access  Public / Private
const getFaculties = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    let query = {};
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const faculties = await Faculty.find(query)
      .populate('assignedBatches', 'name timeSlot targetClass room enrolledCount status')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: faculties.length, data: faculties });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single faculty member
// @route   GET /api/faculties/:id
// @access  Private
const getFacultyById = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('assignedBatches')
      .populate('user', 'email role isActive');
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current faculty's assigned batches
// @route   GET /api/faculties/me/batches
// @access  Faculty Private
const getMyBatches = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({
      $or: [{ user: req.user._id }, { facultyId: req.user.facultyId }, { email: req.user.email }],
    });

    if (!faculty) {
      const batches = await Batch.find({ status: 'Active' });
      return res.status(200).json({ success: true, count: batches.length, data: batches });
    }

    const batches = await Batch.find({
      $or: [
        { _id: { $in: faculty.assignedBatches } },
        { faculty: faculty._id },
        { facultyName: faculty.name },
      ],
    }).populate('course');

    const enriched = await Promise.all(
      batches.map(async (batch) => {
        const count = await Student.countDocuments({
          'enrolledCourses.batch': batch._id,
          status: 'Active',
        });
        const obj = batch.toObject();
        obj.enrolledCount = count;
        return obj;
      })
    );

    res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current faculty's enrolled students
// @route   GET /api/faculties/me/students
// @access  Faculty Private
const getMyStudents = async (req, res, next) => {
  try {
    const { batchId, search } = req.query;

    const faculty = await Faculty.findOne({
      $or: [{ user: req.user._id }, { facultyId: req.user.facultyId }, { email: req.user.email }],
    });

    let batchIds = [];
    if (faculty) {
      const batches = await Batch.find({
        $or: [
          { _id: { $in: faculty.assignedBatches } },
          { faculty: faculty._id },
          { facultyName: faculty.name },
        ],
      });
      batchIds = batches.map((b) => b._id);
    }

    let query = {};
    if (batchId && batchId !== 'All') {
      query['enrolledCourses.batch'] = batchId;
    } else if (batchIds.length > 0) {
      query['enrolledCourses.batch'] = { $in: batchIds };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query)
      .populate('enrolledCourses.batch', 'name timeSlot')
      .populate('enrolledCourses.course', 'name')
      .sort({ name: 1 });

    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new faculty member
// @route   POST /api/faculties
// @access  Admin only
const createFaculty = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      designation,
      qualification,
      specialization,
      experience,
      assignedBatches,
      password,
    } = req.body;

    const facultyId = `FAC-${Date.now().toString().slice(-4)}`;

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password || 'faculty123',
      role: 'faculty',
      facultyId,
      phone,
    });

    const faculty = await Faculty.create({
      user: user._id,
      facultyId,
      name,
      email: email.toLowerCase(),
      phone,
      designation: designation || 'Physics Faculty',
      qualification: qualification || 'M.Sc Physics',
      specialization: specialization || 'Mechanics & Electrodynamics',
      experience: experience || '5+ Years',
      assignedBatches: assignedBatches || [],
      status: 'Active',
    });

    res.status(201).json({
      success: true,
      data: faculty,
      credentials: { facultyId, email, password: password || 'faculty123' },
      message: 'Faculty created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update faculty
// @route   PUT /api/faculties/:id
// @access  Admin only
const updateFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.status(200).json({ success: true, data: faculty, message: 'Faculty updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculties/:id
// @access  Admin only
const deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    if (faculty.user) await User.findByIdAndDelete(faculty.user);
    await faculty.deleteOne();
    res.status(200).json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFaculties,
  getFacultyById,
  getMyBatches,
  getMyStudents,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};
