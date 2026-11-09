const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    targetClass: {
      type: String,
      enum: ['9th', '10th', '11th', '12th', 'JEE Mains', 'NEET', 'Dropper'],
      default: '12th',
    },
    preferredBatchTime: {
      type: String,
      default: 'Any',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Admitted', 'Closed'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Enquiry', enquirySchema);

