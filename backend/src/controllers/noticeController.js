const Notice = require('../models/Notice');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public / Private
const getNotices = async (req, res, next) => {
  try {
    const { audience } = req.query;

    let query = {};
    if (audience && audience !== 'all') {
      query.$or = [{ targetAudience: 'all' }, { targetAudience: audience }];
    }

    const notices = await Notice.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notice
// @route   POST /api/notices
// @access  Private (Admin, Faculty)
const createNotice = async (req, res, next) => {
  try {
    const { title, content, targetAudience, batchName, priority } = req.body;

    const notice = await Notice.create({
      title,
      content,
      targetAudience: targetAudience || 'all',
      batchName: batchName || 'All Batches',
      priority: priority || 'Normal',
      postedBy: req.user ? req.user.name : 'Arun Sir',
    });

    res.status(201).json({ success: true, data: notice, message: 'Notice announced successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin)
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    await notice.deleteOne();
    res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotices,
  createNotice,
  deleteNotice,
};
