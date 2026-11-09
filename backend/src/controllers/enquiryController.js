const Enquiry = require('../models/Enquiry');

// @desc    Submit Admission Enquiry (Landing Page CTA)
// @route   POST /api/enquiries
// @access  Public
const submitEnquiry = async (req, res, next) => {
  try {
    const { name, mobile, email, targetClass, preferredBatchTime, message } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student/parent name and contact mobile number',
      });
    }

    const enquiry = await Enquiry.create({
      name,
      mobile,
      email: email || '',
      targetClass: targetClass || '12th',
      preferredBatchTime: preferredBatchTime || 'Any',
      message: message || '',
    });

    res.status(201).json({
      success: true,
      data: enquiry,
      message: 'Thank you! Arun Sir and the Physics Mirror team will contact you shortly.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private (Admin)
const getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private (Admin)
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitEnquiry,
  getEnquiries,
  updateEnquiryStatus,
};
