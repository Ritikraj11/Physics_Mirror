import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CreditCard,
  Check,
  AlertCircle,
  Printer,
  IndianRupee,
  Search,
  User,
  CheckCircle2,
  Phone,
  BookOpen,
  Calendar,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import FeeReceiptModal from './FeeReceiptModal';

const CollectFeeModal = ({ isOpen, onClose, onSuccess, preselectedStudent = null }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI / QR');
  const [transactionId, setTransactionId] = useState('');
  const [remarks, setRemarks] = useState('Tuition Fee Installment');
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [error, setError] = useState('');
  const [collectedPayment, setCollectedPayment] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load students on open
  useEffect(() => {
    if (isOpen) {
      setError('');
      setCollectedPayment(null);
      setReceiptModalOpen(false);
      fetchStudents();

      if (preselectedStudent) {
        handleSelectStudent(preselectedStudent);
      } else {
        setSelectedStudent(null);
        setSearchTerm('');
        setAmount('');
        // Focus search input on open
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 150);
      }
    }
  }, [isOpen, preselectedStudent]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const fetchStudents = async (query = '') => {
    setFetchingStudents(true);
    try {
      const endpoint = query ? `/students?search=${encodeURIComponent(query)}` : '/students';
      const res = await api.get(endpoint);
      if (res.data?.success) {
        setStudents(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load students for fee modal:', err);
    } finally {
      setFetchingStudents(false);
    }
  };

  // Debounced search when user types in search input
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchStudents(searchTerm.trim());
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  // Filter students locally for instant results
  const filteredStudents = students.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const nameMatch = s.name?.toLowerCase().includes(term);
    const idMatch = s.studentId?.toLowerCase().includes(term);
    const phoneMatch = s.mobile?.includes(term);
    const rollMatch = s.rollNo?.toLowerCase().includes(term);
    return nameMatch || idMatch || phoneMatch || rollMatch;
  });

  const handleSelectStudent = (stu) => {
    setSelectedStudent(stu);
    setSearchTerm('');
    setShowDropdown(false);
    setError('');

    // Pre-fill amount with pending fee or standard installment
    if (stu.pendingFee !== undefined && stu.pendingFee !== null) {
      if (stu.pendingFee > 0) {
        setAmount(String(stu.pendingFee));
      } else {
        setAmount('');
      }
    } else {
      setAmount('5000');
    }
  };

  const handleClearSelectedStudent = () => {
    setSelectedStudent(null);
    setSearchTerm('');
    setAmount('');
    setTimeout(() => {
      searchInputRef.current?.focus();
      setShowDropdown(true);
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Please search and select a student to collect fee');
      return;
    }

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please specify a valid payment amount greater than ₹0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const courseName =
        selectedStudent.enrolledCourses?.[0]?.courseName ||
        selectedStudent.enrolledCourses?.[0]?.course?.name ||
        'Physics Coaching';
      const batchName =
        selectedStudent.enrolledCourses?.[0]?.batchName ||
        selectedStudent.enrolledCourses?.[0]?.batch?.name ||
        'General Batch';

      const res = await api.post('/payments', {
        studentId: selectedStudent.studentId || selectedStudent._id,
        amount: numericAmount,
        paymentMode,
        transactionId: transactionId.trim(),
        remarks: remarks.trim() || 'Tuition Fee Installment',
        courseName,
        batchName,
      });

      if (res.data?.success) {
        setCollectedPayment(res.data.data);
        onSuccess && onSuccess(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment collection failed. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForAnother = () => {
    setCollectedPayment(null);
    setSelectedStudent(null);
    setSearchTerm('');
    setAmount('');
    setTransactionId('');
    setError('');
    fetchStudents();
    setTimeout(() => {
      searchInputRef.current?.focus();
      setShowDropdown(true);
    }, 100);
  };

  if (!isOpen) return null;

  const currentPending = selectedStudent?.pendingFee || 0;
  const currentTotal = selectedStudent?.totalFee || 0;
  const currentPaid = selectedStudent?.feePaid || 0;
  const numericAmount = Number(amount) || 0;
  const balanceAfter = Math.max(0, currentPending - numericAmount);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0c2356] to-[#163b96] text-white px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black tracking-wide">Collect Student Fee</h2>
                <p className="text-[11px] text-sky-200 font-medium">Record payment & generate instant receipt</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {collectedPayment ? (
            /* ============================================================ */
            /* SUCCESS RECEIPT CARD                                         */
            /* ============================================================ */
            <div className="p-6 space-y-5 text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                  Payment Recorded
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Fee Collected Successfully!</h3>
                <p className="text-xs text-slate-500 mt-0.5">Official receipt has been logged to the institute ledger.</p>
              </div>

              {/* Receipt Highlights Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left space-y-2.5 text-xs shadow-sm">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Receipt Number:</span>
                  <span className="font-mono font-bold text-[#0c2356] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {collectedPayment.receiptNo}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Student Name:</span>
                  <span className="font-bold text-slate-800">{collectedPayment.studentName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Student ID:</span>
                  <span className="font-mono text-slate-700">{collectedPayment.studentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Amount Collected:</span>
                  <span className="font-black text-emerald-600 text-sm">
                    ₹{collectedPayment.amount?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Payment Mode:</span>
                  <span className="font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {collectedPayment.paymentMode}
                  </span>
                </div>
                {collectedPayment.transactionId && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Transaction Ref:</span>
                    <span className="font-mono text-slate-600 text-[11px]">{collectedPayment.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-slate-200 pt-2 font-bold">
                  <span className="text-slate-600">Remaining Balance:</span>
                  <span className={collectedPayment.balanceDueAfter > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                    ₹{collectedPayment.balanceDueAfter?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setReceiptModalOpen(true)}
                    className="flex-1 py-2.5 px-4 bg-[#0c2356] hover:bg-[#163b96] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-md"
                  >
                    <Printer className="w-4 h-4 text-[#ffc700]" />
                    <span>View & Print Official Receipt</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleResetForAnother}
                    className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Collect for Another Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    Done / Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* COLLECTION FORM WITH STUDENT SEARCH BY NAME                 */
            /* ============================================================ */
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Student Search & Selection Section */}
              <div className="space-y-2 relative">
                <label className="block text-slate-700 font-bold">
                  Search & Select Student <span className="text-red-500">*</span>
                </label>

                {!selectedStudent ? (
                  /* Search Input */
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Type student name (e.g. Rahul), student ID, or mobile..."
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c2356] outline-none font-medium text-slate-800 transition"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          fetchStudents();
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {/* Autocomplete / Search Results Dropdown */}
                    {showDropdown && (
                      <div
                        ref={dropdownRef}
                        className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-xl z-20 divide-y divide-slate-100 animate-in fade-in duration-150"
                      >
                        {fetchingStudents ? (
                          <div className="p-4 text-center text-slate-400 flex items-center justify-center space-x-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Searching students...</span>
                          </div>
                        ) : filteredStudents.length === 0 ? (
                          <div className="p-4 text-center text-slate-400">
                            <p className="font-semibold text-slate-600">No student found</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Try searching with a different name or ID
                            </p>
                          </div>
                        ) : (
                          filteredStudents.map((s) => {
                            const isDue = (s.pendingFee || 0) > 0;
                            const courseName =
                              s.enrolledCourses?.[0]?.courseName ||
                              s.enrolledCourses?.[0]?.course?.name ||
                              s.targetClass ||
                              'Physics';
                            return (
                              <button
                                key={s._id || s.studentId}
                                type="button"
                                onClick={() => handleSelectStudent(s)}
                                className="w-full p-3 text-left hover:bg-sky-50/70 flex items-center justify-between transition group"
                              >
                                <div className="space-y-0.5 min-w-0 pr-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-slate-900 group-hover:text-[#0c2356] truncate">
                                      {s.name}
                                    </span>
                                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                                      {s.studentId}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 truncate flex items-center space-x-1.5">
                                    <span>{courseName}</span>
                                    {s.mobile && <span>• {s.mobile}</span>}
                                  </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  {isDue ? (
                                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold rounded-md">
                                      Due: ₹{s.pendingFee?.toLocaleString('en-IN')}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md">
                                      Cleared
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Selected Student Card with Change Button */
                  <div className="p-3.5 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-sky-200/80 shadow-sm relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0c2356] text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                          {selectedStudent.name ? selectedStudent.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-black text-slate-900 text-sm">{selectedStudent.name}</h4>
                            <span className="font-mono text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                              {selectedStudent.studentId}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {selectedStudent.enrolledCourses?.[0]?.courseName ||
                              selectedStudent.enrolledCourses?.[0]?.course?.name ||
                              selectedStudent.targetClass ||
                              'Physics Student'}{' '}
                            • {selectedStudent.mobile || 'No Mobile'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleClearSelectedStudent}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition shadow-2xs"
                      >
                        Change
                      </button>
                    </div>

                    {/* 3 Metric Balance Highlights */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-sky-100 text-center">
                      <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Fee</p>
                        <p className="font-black text-slate-800 text-xs mt-0.5">
                          ₹{currentTotal.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Paid So Far</p>
                        <p className="font-black text-emerald-600 text-xs mt-0.5">
                          ₹{currentPaid.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Pending Due</p>
                        <p className={`font-black text-xs mt-0.5 ${currentPending > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          ₹{currentPending.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {currentPending === 0 && (
                      <p className="text-[11px] text-emerald-700 font-medium mt-2 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>All standard dues cleared. You can still record advance/extra fee.</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Amount to Collect */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold">
                    Amount to Collect (₹) <span className="text-red-500">*</span>
                  </label>
                  {selectedStudent && currentPending > 0 && (
                    <button
                      type="button"
                      onClick={() => setAmount(String(currentPending))}
                      className="text-[11px] font-bold text-[#0c2356] hover:underline"
                    >
                      Fill Full Due (₹{currentPending.toLocaleString('en-IN')})
                    </button>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-black text-sm">₹</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter fee amount, e.g. 5000"
                    disabled={!selectedStudent}
                    className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c2356] outline-none font-black text-slate-900 text-sm transition disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Quick Fill Chips */}
                {selectedStudent && currentPending > 0 && (
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-[10px] text-slate-400 font-semibold">Quick:</span>
                    {currentPending > 2000 && (
                      <button
                        type="button"
                        onClick={() => setAmount('2000')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-[10px] transition"
                      >
                        ₹2,000
                      </button>
                    )}
                    {currentPending > 5000 && (
                      <button
                        type="button"
                        onClick={() => setAmount('5000')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-[10px] transition"
                      >
                        ₹5,000
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setAmount(String(currentPending))}
                      className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md font-bold text-[10px] transition"
                    >
                      Full Due (₹{currentPending.toLocaleString('en-IN')})
                    </button>
                  </div>
                )}

                {/* Live Remaining Balance Calculation */}
                {selectedStudent && numericAmount > 0 && (
                  <div className="mt-2 text-[11px] text-slate-500 flex justify-between bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span>Balance Due After Payment:</span>
                    <span className={`font-bold ${balanceAfter > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ₹{balanceAfter.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Mode & Transaction ID */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    disabled={!selectedStudent}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c2356] outline-none transition disabled:bg-slate-100"
                  >
                    <option value="UPI / QR">UPI / QR (PhonePe/GPay)</option>
                    <option value="Cash">Cash</option>
                    <option value="Debit/Credit Card">Debit/Credit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Ref / Transaction ID
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Optional reference"
                    disabled={!selectedStudent}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c2356] outline-none transition disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Payment Remarks / Note
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. 1st Installment / Term 1"
                  disabled={!selectedStudent}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c2356] outline-none transition disabled:bg-slate-100"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedStudent || !amount || Number(amount) <= 0}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#0c2356] hover:bg-[#163b96] rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Recording Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-[#ffc700]" />
                      <span>Confirm & Collect Fee</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Official Fee Receipt Modal */}
      {receiptModalOpen && collectedPayment && (
        <FeeReceiptModal
          isOpen={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          payment={collectedPayment}
        />
      )}
    </>
  );
};

export default CollectFeeModal;
