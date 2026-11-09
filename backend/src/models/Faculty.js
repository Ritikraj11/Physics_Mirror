const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    facultyId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      default: 'Physics Faculty',
    },
    qualification: {
      type: String,
      default: 'M.Sc Physics / B.Tech',
    },
    specialization: {
      type: String,
      default: 'Mechanics, Electrodynamics & Optics',
    },
    experience: {
      type: String,
      default: '8+ Years',
    },
    assignedBatches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
      },
    ],
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Faculty', facultySchema);

