const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Batch = require('../models/Batch');

// @desc    Get or initialize attendance for batch on specific date
// @route   GET /api/attendance/batch/:batchId
// @access  Private (Faculty, Admin)
const getBatchAttendanceByDate = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ success: false, message: 'Please provide date parameter' });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    let attendance = await Attendance.findOne({ batch: batchId, date });
    if (attendance) {
      return res.status(200).json({ success: true, alreadyMarked: true, data: attendance });
    }

    const students = await Student.find({
      'enrolledCourses.batch': batchId,
      status: 'Active',
    }).select('studentId name rollNo mobile');

    const defaultRecords = students.map((s) => ({
      student: s._id,
      studentId: s.studentId,
      studentName: s.name,
      rollNo: s.rollNo,
      status: 'Present',
      remarks: '',
    }));

    res.status(200).json({
      success: true,
      alreadyMarked: false,
      data: {
        batch: batchId,
        batchName: `${batch.timeSlot} ${batch.name}`,
        date,
        records: defaultRecords,
        totalStudents: defaultRecords.length,
        presentCount: defaultRecords.length,
        absentCount: 0,
        lateCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Update Attendance for batch
// @route   POST /api/attendance/batch/:batchId
// @access  Private (Faculty, Admin)
const saveBatchAttendance = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { date, records, markedByName } = req.body;

    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid date and attendance records array',
      });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    let present = 0;
    let absent = 0;
    let late = 0;
    records.forEach((r) => {
      if (r.status === 'Present') present++;
      else if (r.status === 'Absent') absent++;
      else if (r.status === 'Late') late++;
    });

    const updateData = {
      batch: batch._id,
      batchName: `${batch.timeSlot} ${batch.name}`,
      date,
      markedBy: req.user._id,
      markedByName: markedByName || req.user.name || 'Faculty',
      records,
      totalStudents: records.length,
      presentCount: present,
      absentCount: absent,
      lateCount: late,
    };

    const attendance = await Attendance.findOneAndUpdate(
      { batch: batch._id, date },
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    // Recalculate live attendance rate for all affected students in background
    const studentIds = records.map((r) => r.student).filter(Boolean);
    for (const sId of studentIds) {
      const studentHistory = await Attendance.find({ 'records.student': sId });
      let presentOrLate = 0;
      let total = 0;
      studentHistory.forEach((att) => {
        const myRecord = att.records.find((rec) => rec.student && rec.student.toString() === sId.toString());
        if (myRecord) {
          total++;
          if (myRecord.status === 'Present' || myRecord.status === 'Late') {
            presentOrLate++;
          }
        }
      });
      const realRate = total > 0 ? Math.round((presentOrLate / total) * 100) : 0;
      await Student.findByIdAndUpdate(sId, { attendanceRate: realRate }).catch(() => {});
    }

    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Attendance saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance history for current student
// @route   GET /api/attendance/student/me
// @access  Private (Student)
const getMyAttendanceHistory = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      $or: [{ user: req.user._id }, { studentId: req.user.studentId }],
    });

    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const attendances = await Attendance.find({ 'records.student': student._id }).sort({ date: -1 });
    const formatted = attendances.map((att) => {
      const myRecord = att.records.find((r) => r.student && r.student.toString() === student._id.toString());
      return {
        date: att.date,
        batchName: att.batchName,
        status: myRecord ? myRecord.status : 'Present',
        remarks: myRecord ? myRecord.remarks : '',
      };
    });

    const presentOrLateCount = formatted.filter((r) => r.status === 'Present' || r.status === 'Late').length;
    const computedRate = formatted.length > 0 ? Math.round((presentOrLateCount / formatted.length) * 100) : 0;

    if (student.attendanceRate !== computedRate) {
      await Student.findByIdAndUpdate(student._id, { attendanceRate: computedRate }).catch(() => {});
    }

    res.status(200).json({
      success: true,
      rate: computedRate,
      totalClasses: formatted.length,
      history: formatted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBatchAttendanceByDate,
  saveBatchAttendance,
  getMyAttendanceHistory,
};
