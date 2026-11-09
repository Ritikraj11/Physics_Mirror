const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'PhysicsMirror_SuperSecret_Jwt_Token_2026_SecureKey',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Universal Login (Admin, Faculty, Student)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { identifier, email, studentId, facultyId, mobile, password, role } = req.body;
    const loginKey = (identifier || email || studentId || facultyId || mobile || '').trim();

    if (!loginKey || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide login identifier (Email/ID/Phone) and password',
      });
    }

    const criteria = [
      { email: loginKey.toLowerCase() },
      { studentId: loginKey },
      { facultyId: loginKey },
      { phone: loginKey },
    ];

    const query = { $or: criteria };
    if (role) {
      query.role = role;
    }

    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found in database.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check and try again.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Contact Physics Mirror Admin.',
      });
    }

    const token = generateToken(user._id);

    let profileData = null;
    if (user.role === 'student') {
      profileData = await Student.findOne({
        $or: [{ user: user._id }, { studentId: user.studentId }],
      }).populate('enrolledCourses.batch');
    } else if (user.role === 'faculty') {
      profileData = await Faculty.findOne({
        $or: [{ user: user._id }, { facultyId: user.facultyId }],
      }).populate('assignedBatches');
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        facultyId: user.facultyId,
        phone: user.phone,
        avatar: user.avatar,
      },
      profile: profileData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({
        $or: [{ user: user._id }, { studentId: user.studentId }],
      }).populate('enrolledCourses.batch');
    } else if (user.role === 'faculty') {
      profile = await Faculty.findOne({
        $or: [{ user: user._id }, { facultyId: user.facultyId }],
      }).populate('assignedBatches');
    }

    res.status(200).json({
      success: true,
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
  updatePassword,
};
