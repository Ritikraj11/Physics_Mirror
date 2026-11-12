import React, { useState, useEffect } from 'react';
import { CreditCard, IndianRupee, Printer, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import FeeReceiptModal from '../../components/FeeReceiptModal';

const StudentFees = () => {
  const [feeData, setFeeData] = useState({
    totalFee: 0,
    feePaid: 0,
    pendingFee: 0,
    payments: [],
  });
  const [loading, setLoading] = useState(true);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/payments/me');
      if (res.data.success) {
        setFeeData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (p) => {
    setSelectedReceipt(p);
    setReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Fee Receipts & Installments
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Physics Mirror official payment ledger, term installments & tax receipts
        </p>
      </div>

      {/* Fee Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL COURSE FEE</span>
          <h3 className="text-2xl font-black text-slate-800 mt-1">₹{feeData.totalFee?.toLocaleString('en-IN')}</h3>
          <p className="text-xs text-slate-500 mt-1">Full 1-Year Program</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">PAID AMOUNT</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">₹{feeData.feePaid?.toLocaleString('en-IN')}</h3>
          <p className="text-xs text-slate-500 mt-1">Verified with Receipts</p>
        </div>

        <div className="bg-[#ffc700] text-[#0c2356] p-5 rounded-3xl shadow-md flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0c2356]/80">PENDING BALANCE DUE</span>
          <h3 className="text-2xl font-black text-[#0c2356] mt-1">₹{feeData.pendingFee?.toLocaleString('en-IN')}</h3>
          <p className="text-xs font-semibold text-[#0c2356]/90 mt-1">Pay at Admin Desk</p>
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <span>Payment History & Invoices</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {feeData.payments?.length || 0} Receipts Issued
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">RECEIPT #</th>
                <th className="py-3 px-4">AMOUNT</th>
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">MODE</th>
                <th className="py-3 px-4">REMARKS</th>
                <th className="py-3 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feeData.payments && feeData.payments.length > 0 ? (
                feeData.payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#1967d2]">
                      {p.receiptNo}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-emerald-600 text-sm">
                      ₹{p.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(p.paymentDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {p.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {p.remarks || 'Tuition Fee Installment'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handlePrint(p)}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#0c2356] hover:text-white text-slate-700 font-bold rounded-xl transition inline-flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No payment history recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FeeReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        payment={selectedReceipt}
      />
    </div>
  );
};

export default StudentFees;

