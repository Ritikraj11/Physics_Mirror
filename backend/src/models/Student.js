const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    dob: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    mobile: {
      type: String,
      required: [true, 'Student mobile is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    guardianName: {
      type: String,
      default: '',
      trim: true,
    },
    guardianMobile: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
    },
    rollNo: {
      type: String,
      default: '',
    },
    targetClass: {
      type: String,
      enum: ['9th', '10th', '11th', '12th', 'JEE Mains', 'NEET', 'Dropper'],
      default: '12th',
    },
    enrolledCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        courseName: { type: String, default: '' },
        batch: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Batch',
        },
        batchName: { type: String, default: '' },
        admissionDate: { type: Date, default: Date.now },
        feeAgreed: { type: Number, default: 0 },
        customDuration: { type: String, default: '' },
      },
    ],
    totalFee: {
      type: Number,
      default: 20000,
    },
    feePaid: {
      type: Number,
      default: 0,
    },
    pendingFee: {
      type: Number,
      default: 20000,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    customDuration: {
      type: String,
      default: '',
    },
    photo: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    attendanceRate: {
      type: Number,
      default: 92,
    },
    testAverage: {
      type: Number,
      default: 80,
    },
  },
  {
    timestamps: true,
  }
);

// Auto compute pendingFee before save
studentSchema.pre('save', function (next) {
  if (this.totalFee !== undefined && this.feePaid !== undefined) {
    this.pendingFee = Math.max(0, this.totalFee - this.feePaid);
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);

