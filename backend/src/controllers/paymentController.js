const Payment = require('../models/Payment');
const Student = require('../models/Student');

const generateReceiptNo = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `REC-${dateStr}-${randomSuffix}`;
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin)
const getPayments = async (req, res, next) => {
  try {
    const { search, limit = 50 } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { receiptNo: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { paymentMode: { $regex: search, $options: 'i' } },
      ];
    }

    const payments = await Payment.find(query)
      .populate('student', 'studentId name mobile rollNo')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Collect Fee (New Payment)
// @route   POST /api/payments
// @access  Private (Admin)
const collectFee = async (req, res, next) => {
  try {
    const {
      studentId,
      amount,
      paymentMode,
      transactionId,
      remarks,
      courseName,
      batchName,
    } = req.body;

    if (!studentId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student ID and payment amount',
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than 0',
      });
    }

    const isObjectId = studentId.match(/^[0-9a-fA-F]{24}$/);
    const student = await Student.findOne({
      $or: [{ studentId }, ...(isObjectId ? [{ _id: studentId }] : [])],
    });

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const newFeePaid = (student.feePaid || 0) + numericAmount;
    const balanceDueAfter = Math.max(0, (student.totalFee || 0) - newFeePaid);

    student.feePaid = newFeePaid;
    student.pendingFee = balanceDueAfter;
    await student.save();

    const receiptNo = generateReceiptNo();
    const payment = await Payment.create({
      receiptNo,
      student: student._id,
      studentId: student.studentId,
      studentName: student.name,
      courseName: courseName || (student.enrolledCourses[0] ? student.enrolledCourses[0].courseName : 'Physics Coaching'),
      batchName: batchName || (student.enrolledCourses[0] ? student.enrolledCourses[0].batchName : 'General Batch'),
      amount: numericAmount,
      paymentDate: new Date(),
      paymentMode: paymentMode || 'UPI / QR',
      transactionId: transactionId || '',
      remarks: remarks || 'Tuition Fee Installment',
      balanceDueAfter,
      collectedBy: req.user ? req.user.name : 'Admin Desk',
    });

    res.status(201).json({
      success: true,
      data: payment,
      student: {
        studentId: student.studentId,
        name: student.name,
        totalFee: student.totalFee,
        feePaid: student.feePaid,
        pendingFee: student.pendingFee,
      },
      message: `Fee of ₹${numericAmount.toLocaleString('en-IN')} collected successfully. Receipt: ${receiptNo}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payments for currently logged in student
// @route   GET /api/payments/me
// @access  Private (Student)
const getMyPayments = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      $or: [{ user: req.user._id }, { studentId: req.user.studentId }],
    });

    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const payments = await Payment.find({ student: student._id }).sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      totalFee: student.totalFee,
      feePaid: student.feePaid,
      pendingFee: student.pendingFee,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayments,
  collectFee,
  getMyPayments,
};
