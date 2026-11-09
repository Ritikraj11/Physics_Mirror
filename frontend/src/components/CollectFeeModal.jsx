import React, { useState, useEffect } from 'react';
import { X, CreditCard, Check, AlertCircle, Printer, IndianRupee } from 'lucide-react';
import api from '../services/api';

const CollectFeeModal = ({ isOpen, onClose, onSuccess, preselectedStudent = null }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI / QR');
  const [transactionId, setTransactionId] = useState('');
  const [remarks, setRemarks] = useState('Tuition Fee Installment');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collectedPayment, setCollectedPayment] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setCollectedPayment(null);
      fetchStudents();
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedStudent) {
      setSelectedStudentId(preselectedStudent.studentId || preselectedStudent._id);
      setSelectedStudent(preselectedStudent);
      setAmount(preselectedStudent.pendingFee > 0 ? preselectedStudent.pendingFee : 5000);
    }
  }, [preselectedStudent]);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      if (res.data.success) {
        setStudents(res.data.data);
        if (!preselectedStudent && res.data.data.length > 0) {
          const first = res.data.data[0];
          setSelectedStudentId(first.studentId);
          setSelectedStudent(first);
          setAmount(first.pendingFee > 0 ? Math.min(first.pendingFee, 5000) : 5000);
        }
      }
    } catch (err) {
      console.error('Failed to load students for fee modal:', err);
    }
  };

  const handleStudentSelect = (e) => {
    const sId = e.target.value;
    setSelectedStudentId(sId);
    const stu = students.find((s) => s.studentId === sId || s._id === sId);
    setSelectedStudent(stu || null);
    if (stu) {
      setAmount(stu.pendingFee > 0 ? Math.min(stu.pendingFee, 5000) : 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !amount) {
      setError('Please select student and specify fee amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/payments', {
        studentId: selectedStudentId,
        amount: Number(amount),
        paymentMode,
        transactionId,
        remarks,
        courseName: selectedStudent?.enrolledCourses[0]?.courseName || 'Physics Course',
        batchName: selectedStudent?.enrolledCourses[0]?.batchName || 'Physics Batch',
      });

      if (res.data.success) {
        setCollectedPayment(res.data.data);
        onSuccess && onSuccess(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment collection failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#10b981] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <h2 className="text-base font-bold">Collect Student Fee</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {collectedPayment ? (
          /* Success Receipt Card */
          <div className="p-6 space-y-4 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Fee Collected Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">Receipt has been generated and logged.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Receipt Number:</span>
                <span className="font-mono font-bold text-[#0c2356]">{collectedPayment.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Student Name:</span>
                <span className="font-bold text-slate-800">{collectedPayment.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Amount Paid:</span>
                <span className="font-extrabold text-emerald-600">₹{collectedPayment.amount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Payment Mode:</span>
                <span className="font-medium text-slate-700">{collectedPayment.paymentMode}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500 font-semibold">Remaining Due:</span>
                <span className="font-bold text-rose-600">₹{collectedPayment.balanceDueAfter?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Collection Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Select Student <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedStudentId}
                onChange={handleStudentSelect}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none"
              >
                {students.map((s) => (
                  <option key={s._id} value={s.studentId}>
                    {s.studentId} - {s.name} (Pending: ₹{s.pendingFee?.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {selectedStudent && (
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Total Fee</p>
                  <p className="font-bold text-slate-800">₹{selectedStudent.totalFee?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Already Paid</p>
                  <p className="font-bold text-emerald-600">₹{selectedStudent.feePaid?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Pending Due</p>
                  <p className="font-bold text-rose-600">₹{selectedStudent.pendingFee?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Amount to Collect (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none"
                >
                  <option value="UPI / QR">UPI / QR (PhonePe / GPay / Paytm)</option>
                  <option value="Cash">Cash</option>
                  <option value="Debit/Credit Card">Debit/Credit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Transaction / Ref ID
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Optional UPI/Bank ref"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Remarks
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. 2nd Installment / Term 1"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-[#10b981] hover:bg-[#059669] rounded-lg shadow-md transition disabled:opacity-60 flex items-center space-x-1.5"
              >
                {loading ? <span>Processing...</span> : <span>Confirm & Collect</span>}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default CollectFeeModal;

