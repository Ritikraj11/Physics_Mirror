const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    receiptNo: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      default: '',
    },
    batchName: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Please provide payment amount'],
      min: 1,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMode: {
      type: String,
      enum: ['Cash', 'UPI / QR', 'Debit/Credit Card', 'Net Banking', 'Cheque'],
      default: 'UPI / QR',
    },
    transactionId: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: 'Tuition Fee Installment',
    },
    balanceDueAfter: {
      type: Number,
      default: 0,
    },
    collectedBy: {
      type: String,
      default: 'Admin Desk',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);

