import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, PieChart, Printer, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/analytics');
      if (res.data.success) {
        setReports(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Reports & Institute Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physics Mirror Academic Distribution, Batch Occupancy & Revenue Metrics
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Print Summary Report</span>
        </button>
      </div>

      {/* Grid of Report Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Batch Occupancy Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm border-b pb-3">
            <Users className="w-4 h-4" />
            <span>Batch Capacity & Occupancy Status</span>
          </div>

          <div className="space-y-3">
            {reports?.batchDistribution?.map((b, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-800">
                    {b.timeSlot} — <strong className="text-[#0c2356]">{b.name}</strong>
                  </span>
                  <span className="font-mono text-slate-500">
                    {b.enrolled} / {b.capacity} ({b.occupancyRate}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      b.occupancyRate >= 75 ? 'bg-indigo-600' : 'bg-sky-500'
                    }`}
                    style={{ width: `${Math.min(100, b.occupancyRate)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Level Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm border-b pb-3">
            <BarChart3 className="w-4 h-4" />
            <span>Students by Target Class & Exam</span>
          </div>

          <div className="space-y-3">
            {reports?.classStats?.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                <span className="font-bold text-slate-800">{c._id || 'General'}</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold text-[#1967d2]">
                  {c.count} Students
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payments by Mode */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm border-b pb-3">
            <DollarSign className="w-4 h-4" />
            <span>Revenue Collection by Payment Channel</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reports?.paymentByMode?.map((m, idx) => (
              <div key={idx} className="p-4 bg-emerald-50/50 border border-emerald-200/60 rounded-xl space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">{m._id}</span>
                <p className="text-2xl font-black text-emerald-700">₹{m.totalAmount?.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-500">{m.transactionCount} transactions</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminReports;

