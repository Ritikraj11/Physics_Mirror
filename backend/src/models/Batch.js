const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide batch name'],
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    timeSlot: {
      type: String,
      required: [true, 'Please provide time slot (e.g. 5:00 AM - 7:00 AM)'],
      trim: true,
    },
    targetClass: {
      type: String,
      required: [true, 'Please specify target class (e.g. 12th / JEE / NEET)'],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    courseName: {
      type: String,
      default: '',
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    facultyName: {
      type: String,
      default: 'Arun Sir',
    },
    days: {
      type: [String],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    room: {
      type: String,
      default: 'Main Lecture Hall',
    },
    capacity: {
      type: Number,
      default: 40,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    syllabusProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Batch', batchSchema);

