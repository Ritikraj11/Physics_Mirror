const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    targetAudience: {
      type: String,
      enum: ['all', 'student', 'faculty'],
      default: 'all',
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
    batchName: {
      type: String,
      default: 'All Batches',
    },
    priority: {
      type: String,
      enum: ['Normal', 'High', 'Urgent'],
      default: 'Normal',
    },
    postedBy: {
      type: String,
      default: 'Arun Sir (Director)',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notice', noticeSchema);

