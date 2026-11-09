import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Plus, Printer, Eye, Download, Wallet, ArrowDownRight } from 'lucide-react';
import api from '../../services/api';
import CollectFeeModal from '../../components/CollectFeeModal';
import FeeReceiptModal from '../../components/FeeReceiptModal';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/payments');
      setPayments(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.receiptNo?.toLowerCase().includes(term) ||
      p.studentName?.toLowerCase().includes(term) ||
      p.studentId?.toLowerCase().includes(term) ||
      p.paymentMode?.toLowerCase().includes(term)
    );
  });

  const totalCollected = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const handlePrint = (payment) => {
    setSelectedReceipt(payment);
    setReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Fee Collection & Receipts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physics Mirror Accounts Ledger • Instant Receipt Generation & History
          </p>
        </div>

        <button
          onClick={() => setCollectModalOpen(true)}
          className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 active:scale-95"
        >
          <CreditCard className="w-4 h-4" />
          <span>+ Collect Student Fee</span>
        </button>
      </div>

      {/* Top Ledger Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL REVENUE LOGGED</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">₹{totalCollected.toLocaleString('en-IN')}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{payments.length} transactions processed</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AVERAGE RECEIPT</p>
            <h3 className="text-2xl font-black text-[#0c2356] mt-1">
              ₹{payments.length ? Math.round(totalCollected / payments.length).toLocaleString('en-IN') : 0}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Per installment</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#1967d2] flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">OFFICIAL DESK</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">Arun Sir Accounts</h3>
            <p className="text-xs text-slate-500 mt-0.5">GST Compliant Computerized Receipts</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Printer className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by receipt number (e.g. REC-2026), student name, ID or mode..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">RECEIPT #</th>
                <th className="py-3 px-4">STUDENT ID</th>
                <th className="py-3 px-4">STUDENT NAME</th>
                <th className="py-3 px-4">AMOUNT PAID</th>
                <th className="py-3 px-4">PAYMENT MODE</th>
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">BALANCE REMAINING</th>
                <th className="py-3 px-4 text-center">PRINT RECEIPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#1967d2]">
                      {p.receiptNo}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {p.studentId}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {p.studentName}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-emerald-700 text-sm">
                      ₹{p.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {p.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(p.paymentDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {p.balanceDueAfter > 0 ? (
                        <span className="text-rose-600 font-bold">₹{p.balanceDueAfter.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Cleared (₹0)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handlePrint(p)}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#0c2356] hover:text-white text-slate-700 font-bold rounded-lg transition inline-flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No transactions match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CollectFeeModal
        isOpen={collectModalOpen}
        onClose={() => setCollectModalOpen(false)}
        onSuccess={() => fetchPayments()}
      />

      <FeeReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        payment={selectedReceipt}
      />

    </div>
  );
};

export default AdminPayments;

