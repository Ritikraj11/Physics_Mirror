import React from 'react';
import { X, Printer, CheckCircle } from 'lucide-react';

const FeeReceiptModal = ({ isOpen, onClose, payment }) => {
  if (!isOpen || !payment) return null;

  const formatDate = (d) => {
    if (!d) return new Date().toLocaleDateString('en-IN');
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">

        {/* Modal Controls (Hidden in print) */}
        <div className="bg-slate-100 px-6 py-3 flex items-center justify-between border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold text-slate-700">Official Fee Receipt</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-[#0c2356] text-white hover:bg-[#163b96] rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-receipt" className="p-8 bg-white text-slate-800">

          {/* Institute Header */}
          <div className="flex items-center justify-between border-b-2 border-[#0c2356] pb-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-full bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.jpg?v=2"
                  alt="Physics Mirror Logo"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo.png?v=2';
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-[#0c2356]">
                  PHYSICS <span className="text-[#f59e0b]">MIRROR</span>
                </h1>
                <p className="text-xs font-bold text-slate-600 tracking-wider uppercase">
                  CONCEPT-FIRST PHYSICS COACHING
                </p>
                <p className="text-[10px] text-slate-500">
                  Pipradih, Jhajha, District – Jamui, Bihar, India • Helpline: +91 87339 12347
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-md">
                PAID RECEIPT
              </span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                {payment.receiptNo}
              </p>
              <p className="text-[10px] text-slate-500">Date: {formatDate(payment.paymentDate)}</p>
            </div>
          </div>

          {/* Student & Course Details Table */}
          <div className="my-6 grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <p className="text-[10px] uppercase font-bold text-slate-400">STUDENT INFORMATION</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{payment.studentName}</p>
              <p className="text-slate-600">Student ID: <span className="font-semibold text-[#0c2356]">{payment.studentId}</span></p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <p className="text-[10px] uppercase font-bold text-slate-400">COURSE & BATCH</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{payment.courseName || 'Physics Program'}</p>
              <p className="text-slate-600 font-medium">Batch: {payment.batchName || 'Regular Session'}</p>
            </div>
          </div>

          {/* Payment Summary */}
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden my-4">
            <thead className="bg-[#0c2356] text-white">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Description</th>
                <th className="py-2.5 px-4 font-semibold">Payment Mode</th>
                <th className="py-2.5 px-4 font-semibold text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800">
                  {payment.remarks || 'Tuition Fee Installment'}
                  {payment.transactionId && (
                    <span className="block text-[10px] text-slate-400 font-mono">Ref: {payment.transactionId}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-600">{payment.paymentMode || 'UPI / QR'}</td>
                <td className="py-3 px-4 text-right font-extrabold text-sm text-[#0c2356]">
                  ₹{payment.amount?.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td colSpan={2} className="py-2.5 px-4 text-slate-600 text-right">Total Paid This Receipt:</td>
                <td className="py-2.5 px-4 text-right text-emerald-700 text-sm">
                  ₹{payment.amount?.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr className="bg-amber-50/60 font-semibold text-amber-900">
                <td colSpan={2} className="py-2 px-4 text-right">Remaining Balance Due:</td>
                <td className="py-2 px-4 text-right text-rose-600">
                  ₹{payment.balanceDueAfter !== undefined ? payment.balanceDueAfter.toLocaleString('en-IN') : '0'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer & Signature */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
            <div>
              <p className="text-[10px] text-slate-400">
                * Computer generated receipt. Valid with Physics Mirror seal.
              </p>
              <p className="text-[10px] text-slate-400">
                Collected by: <span className="font-semibold text-slate-700">{payment.collectedBy || 'Admin Desk'}</span>
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 border-b border-slate-400 mb-1 mx-auto"></div>
              <p className="text-[11px] font-bold text-[#0c2356]">ARUN SIR</p>
              <p className="text-[9px] text-slate-500 font-medium">Founder & Director</p>
              <p className="text-[9px] text-slate-400">Physics Mirror • Pipradih, Jhajha, Jamui, Bihar</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FeeReceiptModal;

