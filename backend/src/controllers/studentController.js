const Student = require('../models/Student');
const User = require('../models/User');
const Batch = require('../models/Batch');
const Course = require('../models/Course');
const Payment = require('../models/Payment');

const generateNextStudentId = async () => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const prefix = `PM${currentYear}`;

  const lastStudent = await Student.findOne({ studentId: { $regex: `^${prefix}` } }).sort({ studentId: -1 });
  if (!lastStudent) return `${prefix}001`;

  const numericPart = parseInt(lastStudent.studentId.replace(prefix, ''), 10);
  const nextNum = isNaN(numericPart) ? 1 : numericPart + 1;
  return `${prefix}${nextNum.toString().padStart(3, '0')}`;
};

// @desc    Get all students with filters
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res, next) => {
  try {
    const { search, course, batch, status, targetClass } = req.query;
    let query = {};

    if (status && status !== 'All') query.status = status;
    if (targetClass && targetClass !== 'All') query.targetClass = targetClass;
    if (course && course !== 'All') query['enrolledCourses.course'] = course;
    if (batch && batch !== 'All') query['enrolledCourses.batch'] = batch;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query)
      .populate('enrolledCourses.course', 'name code totalFee')
      .populate('enrolledCourses.batch', 'name timeSlot targetClass facultyName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student details
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('enrolledCourses.course')
      .populate('enrolledCourses.batch')
      .populate('user', 'email role isActive');

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const payments = await Payment.find({ student: student._id }).sort({ paymentDate: -1 });
    res.status(200).json({ success: true, data: { ...student.toObject(), payments } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new student admission (New Admission Modal)
// @route   POST /api/students
// @access  Admin only
const createStudent = async (req, res, next) => {
  try {
    const {
      studentId,
      name,
      dob,
      gender,
      mobile,
      email,
      guardianName,
      guardianMobile,
      address,
      courseId,
      batchId,
      totalFee,
      admissionDate,
      customDuration,
      status,
      password,
      targetClass,
    } = req.body;

    const generatedId = studentId || (await generateNextStudentId());
    const finalEmail = (email || `${generatedId.toLowerCase()}@physicsmirror.com`).toLowerCase();

    let user = await User.findOne({
      $or: [{ email: finalEmail }, { studentId: generatedId }],
    });

    if (!user) {
      user = await User.create({
        name,
        email: finalEmail,
        password: password || 'student123',
        role: 'student',
        studentId: generatedId,
        phone: mobile,
      });
    }

    let courseObj = null;
    let batchObj = null;
    if (courseId) courseObj = await Course.findById(courseId);
    if (batchId) batchObj = await Batch.findById(batchId);

    const numericTotalFee = totalFee ? Number(totalFee) : (courseObj ? courseObj.totalFee : 20000);

    const enrolledCourses = [];
    if (courseObj || batchObj) {
      enrolledCourses.push({
        course: courseObj ? courseObj._id : undefined,
        courseName: courseObj ? courseObj.name : 'Physics Mastery',
        batch: batchObj ? batchObj._id : undefined,
        batchName: batchObj ? `${batchObj.timeSlot} ${batchObj.name}` : 'Morning Batch',
        admissionDate: admissionDate || new Date(),
        feeAgreed: numericTotalFee,
        customDuration: customDuration || '',
      });
    }

    const student = await Student.create({
      studentId: generatedId,
      user: user._id,
      name,
      dob: dob || '',
      gender: gender || 'Male',
      mobile,
      email: finalEmail,
      guardianName: guardianName || '',
      guardianMobile: guardianMobile || '',
      address: address || '',
      rollNo: `PM-${generatedId.slice(-3)}`,
      targetClass: targetClass || (courseObj ? courseObj.targetClass : '12th'),
      enrolledCourses,
      totalFee: numericTotalFee,
      feePaid: 0,
      pendingFee: numericTotalFee,
      admissionDate: admissionDate || new Date(),
      status: status || 'Active',
      attendanceRate: 95,
      testAverage: 82,
    });

    if (batchObj) {
      await Batch.findByIdAndUpdate(batchObj._id, { $inc: { enrolledCount: 1 } });
    }

    res.status(201).json({
      success: true,
      data: student,
      credentials: {
        studentId: generatedId,
        mobile,
        defaultPassword: password || 'student123',
      },
      message: 'Student admitted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Admin only
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.status(200).json({ success: true, data: student, message: 'Student updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Admin only
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    if (student.user) await User.findByIdAndDelete(student.user);
    await student.deleteOne();
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  generateNextStudentId,
};
