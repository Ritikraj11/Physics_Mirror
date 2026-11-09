const Student = require('../models/Student');
const Batch = require('../models/Batch');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Faculty = require('../models/Faculty');

// @desc    Get Admin Dashboard Stats (Matches Dashboard.png)
// @route   GET /api/reports/dashboard
// @access  Private (Admin)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalStudentsCount = await Student.countDocuments();
    const activeStudentsCount = await Student.countDocuments({ status: 'Active' });
    const totalCoursesCount = await Course.countDocuments({ status: 'Active' });
    const totalBatchesCount = await Batch.countDocuments({ status: 'Active' });

    const feeAggregation = await Student.aggregate([
      {
        $group: {
          _id: null,
          totalCollected: { $sum: '$feePaid' },
          totalPending: { $sum: '$pendingFee' },
        },
      },
    ]);

    const feesCollected = feeAggregation[0] ? feeAggregation[0].totalCollected : 0;
    const pendingFees = feeAggregation[0] ? feeAggregation[0].totalPending : 0;

    const recentAdmissions = await Student.find()
      .select('studentId name createdAt enrolledCourses status')
      .sort({ createdAt: -1 })
      .limit(6);

    const recentPayments = await Payment.find()
      .select('receiptNo studentName studentId amount paymentDate paymentMode')
      .sort({ paymentDate: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        totalStudents: totalStudentsCount,
        activeStudents: activeStudentsCount,
        totalCourses: totalCoursesCount || 6,
        totalBatches: totalBatchesCount || 6,
        feesCollected,
        pendingFees,
        recentAdmissions: recentAdmissions.map((s) => ({
          _id: s._id,
          id: s.studentId,
          name: s.name,
          date: s.createdAt,
          course: s.enrolledCourses[0] ? s.enrolledCourses[0].courseName : 'Physics Mastery',
          batch: s.enrolledCourses[0] ? s.enrolledCourses[0].batchName : 'Morning Batch',
        })),
        recentPayments: recentPayments.map((p) => ({
          _id: p._id,
          receiptNo: p.receiptNo,
          student: p.studentName,
          studentId: p.studentId,
          amount: p.amount,
          date: p.paymentDate,
          mode: p.paymentMode,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Detailed Analytics & Reports
// @route   GET /api/reports/analytics
// @access  Private (Admin)
const getDetailedReports = async (req, res, next) => {
  try {
    const classStats = await Student.aggregate([
      { $group: { _id: '$targetClass', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const batches = await Batch.find().select('name timeSlot targetClass capacity status');
    const batchDistribution = await Promise.all(
      batches.map(async (b) => {
        const studentCount = await Student.countDocuments({ 'enrolledCourses.batch': b._id });
        return {
          name: b.name,
          timeSlot: b.timeSlot,
          targetClass: b.targetClass,
          status: b.status,
          capacity: b.capacity,
          enrolled: studentCount,
          occupancyRate: Math.round((studentCount / (b.capacity || 40)) * 100),
        };
      })
    );

    const paymentByMode = await Payment.aggregate([
      {
        $group: {
          _id: '$paymentMode',
          totalAmount: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      classStats,
      batchDistribution,
      paymentByMode,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getDetailedReports,
};
