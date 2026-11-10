const DPP = require('../models/DPP');
const Batch = require('../models/Batch');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// @desc    Upload new DPP (Daily Practice Problem Sheet)
// @route   POST /api/dpp
// @access  Private (Faculty, Admin)
const uploadDPP = async (req, res, next) => {
  try {
    const {
      title,
      code,
      batchId,
      batchName,
      targetClass,
      unit,
      totalQuestions,
      difficulty,
      description,
      dueDate,
      fileName,
      fileSize,
      fileData,
    } = req.body;

    if (!title || !unit || !fileData) {
      return res.status(400).json({
        success: false,
        message: 'Please provide DPP Title, Physics Unit/Chapter, and PDF file data',
      });
    }

    let finalBatchName = batchName || 'All Batches';
    let batchObj = null;

    if (batchId && batchId !== 'all') {
      batchObj = await Batch.findById(batchId);
      if (batchObj) {
        finalBatchName = `${batchObj.timeSlot} ${batchObj.name}`;
      }
    }

    const generatedCode =
      code ||
      `DPP-${(unit || 'PHY').replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-3)}`;

    const newDPP = await DPP.create({
      title,
      code: generatedCode,
      batch: batchObj ? batchObj._id : null,
      batchName: finalBatchName,
      targetClass: targetClass || (batchObj ? batchObj.targetClass : '12th'),
      subject: 'Physics',
      unit,
      totalQuestions: Number(totalQuestions) || 25,
      difficulty: difficulty || 'JEE Mains / NEET',
      description: description || '',
      dueDate: dueDate || '',
      fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
      fileSize: fileSize || '2.4 MB',
      fileData,
      fileType: 'application/pdf',
      uploadedBy: req.user._id,
      facultyName: req.user.name || 'Arun Sir',
      downloadCount: 0,
    });

    res.status(201).json({
      success: true,
      data: newDPP,
      message: `DPP "${title}" uploaded successfully for ${finalBatchName}!`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all DPPs for Faculty portal
// @route   GET /api/dpp/faculty
// @access  Private (Faculty, Admin)
const getFacultyDPPs = async (req, res, next) => {
  try {
    let query = {};

    // If faculty, show all DPPs or DPPs uploaded by them
    if (req.user.role === 'faculty') {
      query = {
        $or: [
          { uploadedBy: req.user._id },
          { facultyName: req.user.name },
          { facultyName: 'Arun Sir' },
        ],
      };
    }

    const dpps = await DPP.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dpps.length,
      data: dpps,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all DPPs for Student portal (filtered by student's batch & class)
// @route   GET /api/dpp/student
// @access  Private (Student, Faculty, Admin)
const getStudentDPPs = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      const student = await Student.findOne({
        $or: [{ user: req.user._id }, { studentId: req.user.studentId }],
      });

      if (student) {
        const batchIds = (student.enrolledCourses || [])
          .map((c) => c.batch)
          .filter(Boolean);

        const batchNames = (student.enrolledCourses || [])
          .map((c) => c.batchName)
          .filter(Boolean);

        query = {
          $or: [
            { batch: { $in: batchIds } },
            { batchName: 'All Batches' },
            { batchName: 'All Assigned Batches' },
            { targetClass: student.targetClass },
            { targetClass: 'All' },
            ...batchNames.map((bn) => ({ batchName: { $regex: bn.split(' ')[0], $options: 'i' } })),
          ],
        };
      }
    }

    const dpps = await DPP.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dpps.length,
      data: dpps,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download / Increment count for DPP
// @route   GET /api/dpp/:id/download
// @access  Private
const downloadDPP = async (req, res, next) => {
  try {
    const dpp = await DPP.findById(req.params.id);

    if (!dpp) {
      return res.status(404).json({ success: false, message: 'DPP not found' });
    }

    dpp.downloadCount = (dpp.downloadCount || 0) + 1;
    await dpp.save();

    res.status(200).json({
      success: true,
      data: dpp,
      message: 'Download registered',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete DPP
// @route   DELETE /api/dpp/:id
// @access  Private (Faculty, Admin)
const deleteDPP = async (req, res, next) => {
  try {
    const dpp = await DPP.findById(req.params.id);

    if (!dpp) {
      return res.status(404).json({ success: false, message: 'DPP not found' });
    }

    // Ensure only uploader or admin can delete
    if (
      req.user.role !== 'admin' &&
      dpp.uploadedBy &&
      dpp.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this DPP',
      });
    }

    await dpp.deleteOne();

    res.status(200).json({
      success: true,
      message: `DPP "${dpp.title}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDPP,
  getFacultyDPPs,
  getStudentDPPs,
  downloadDPP,
  deleteDPP,
};

