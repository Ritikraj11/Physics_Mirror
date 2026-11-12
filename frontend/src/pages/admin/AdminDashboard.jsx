import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  CreditCard,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Printer,
  Eye,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import api from '../../services/api';
import NewAdmissionModal from '../../components/NewAdmissionModal';
import CollectFeeModal from '../../components/CollectFeeModal';
import FeeReceiptModal from '../../components/FeeReceiptModal';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalCourses: 0,
    totalBatches: 0,
    feesCollected: 0,
    pendingFees: 0,
    recentAdmissions: [],
    recentPayments: [],
  });

  const [loading, setLoading] = useState(true);
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [collectFeeModalOpen, setCollectFeeModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPayment = (p) => {
    setSelectedReceipt({
      receiptNo: p.receiptNo,
      studentName: p.student,
      studentId: p.studentId || 'PM26001',
      amount: p.amount,
      paymentDate: p.date,
      paymentMode: p.mode || 'UPI / QR',
      courseName: 'Physics Coaching',
      batchName: 'Batch',
      balanceDueAfter: 0,
      collectedBy: 'Admin Desk',
    });
    setReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Row - Matches Dashboard.png */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physics Mirror • Complete Institute Overview & Analytics
          </p>
        </div>

        {/* Action Buttons - Matches Dashboard.png (+ Add Student, Collect Fee) */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAdmissionModalOpen(true)}
            className="px-4 py-2.5 bg-[#1967d2] hover:bg-[#1557b0] text-white font-bold text-xs sm:text-sm rounded-xl shadow transition flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Student</span>
          </button>

          <button
            onClick={() => setCollectFeeModalOpen(true)}
            className="px-4 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm rounded-xl shadow transition flex items-center space-x-1.5 active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>Collect Fee</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards - Exact recreation of Dashboard.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: TOTAL STUDENTS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL STUDENTS
            </p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {stats.totalStudents}
            </h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>+{stats.activeStudents} Active</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#e8f0fe] text-[#1967d2] flex items-center justify-center flex-shrink-0">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Card 2: TOTAL COURSES & BATCHES */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL COURSES & BATCHES
            </p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {stats.totalCourses} <span className="text-slate-400 text-xl font-normal">/ {stats.totalBatches}</span>
            </h3>
            <p className="text-xs font-semibold text-sky-600 mt-1">
              {stats.totalBatches} {stats.totalBatches === 1 ? 'Batch' : 'Batches'} Configured
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
        </div>

        {/* Card 3: FEES COLLECTED */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              FEES COLLECTED
            </p>
            <h3 className="text-3xl font-black text-emerald-700 mt-1">
              ₹{stats.feesCollected?.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Received via UPI/Cash
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-7 h-7" />
          </div>
        </div>

        {/* Card 4: PENDING FEES */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              PENDING FEES
            </p>
            <h3 className="text-3xl font-black text-rose-600 mt-1">
              ₹{stats.pendingFees?.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Due from Students</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* Two Tables Side-by-Side (Matches Dashboard.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Table 1: Recent Admissions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#1967d2] font-bold text-sm">
              <Users className="w-4 h-4" />
              <span>Recent Admissions</span>
            </div>
            <Link
              to="/admin/students"
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">COURSE / BATCH</th>
                  <th className="py-3 px-4">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentAdmissions?.length > 0 ? (
                  stats.recentAdmissions.map((adm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-[#1967d2]">
                        {adm.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {adm.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="block font-medium truncate max-w-[140px]">{adm.course}</span>
                        <span className="text-[10px] text-slate-400">{adm.batch}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(adm.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No admissions logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Recent Payments */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm">
              <CreditCard className="w-4 h-4" />
              <span>Recent Payments</span>
            </div>
            <Link
              to="/admin/payments"
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">RECEIPT #</th>
                  <th className="py-3 px-4">STUDENT</th>
                  <th className="py-3 px-4">AMOUNT</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentPayments?.length > 0 ? (
                  stats.recentPayments.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {p.receiptNo}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {p.student}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-emerald-600">
                        ₹{p.amount?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(p.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handlePrintPayment(p)}
                          title="Print Receipt"
                          className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No payments collected yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modals */}
      <NewAdmissionModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        onSuccess={() => fetchDashboardStats()}
      />

      <CollectFeeModal
        isOpen={collectFeeModalOpen}
        onClose={() => setCollectFeeModalOpen(false)}
        onSuccess={() => fetchDashboardStats()}
      />

      <FeeReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        payment={selectedReceipt}
      />

    </div>
  );
};

export default AdminDashboard;

