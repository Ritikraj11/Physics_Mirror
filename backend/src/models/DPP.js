const mongoose = require('mongoose');

const dppSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'DPP Title is required'],
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: '',
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
    batchName: {
      type: String,
      required: true,
      default: 'All Batches',
    },
    targetClass: {
      type: String,
      default: '12th',
    },
    subject: {
      type: String,
      default: 'Physics',
    },
    unit: {
      type: String,
      required: [true, 'Physics Unit or Chapter is required'],
      trim: true,
    },
    totalQuestions: {
      type: Number,
      default: 25,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'JEE Mains / NEET', 'JEE Advanced'],
      default: 'JEE Mains / NEET',
    },
    description: {
      type: String,
      default: '',
    },
    dueDate: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      required: true,
      default: 'DPP_Physics_Mirror.pdf',
    },
    fileSize: {
      type: String,
      default: '2.5 MB',
    },
    fileData: {
      type: String, // Base64 data URL or file link
      required: true,
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    facultyName: {
      type: String,
      default: 'Arun Sir',
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DPP', dppSchema);

