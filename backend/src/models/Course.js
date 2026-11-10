const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide course name'],
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      trim: true,
    },
    targetClass: {
      type: String,
      enum: ['9th', '10th', '11th', '12th', 'JEE Mains', 'NEET', 'Dropper'],
      required: true,
    },
    totalFee: {
      type: Number,
      required: [true, 'Please provide total course fee'],
      min: 0,
    },
    duration: {
      type: String,
      default: '1 Year',
    },
    description: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [
        'Concept Clearing Sessions',
        'Weekly Numerical Problem Sheets',
        '1-on-1 Faculty Doubt Solving',
        'Mock Tests with All India Ranking',
      ],
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

module.exports = mongoose.model('Course', courseSchema);

