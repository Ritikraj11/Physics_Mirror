import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar,
  Clock,
  Users,
  Check,
  X,
  AlertCircle,
  Save,
  CheckCircle2,
  XCircle,
  Clock3,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FacultyAttendance = () => {
  const [searchParams] = useSearchParams();
  const initialBatchId = searchParams.get('batchId') || '';
  const { user } = useAuth();

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatchId && date) {
      loadAttendanceRoster();
    }
  }, [selectedBatchId, date]);

  const fetchBatches = async () => {
    try {
      const res = await api.get('/faculties/me/batches');
      const bList = res.data?.data || [];
      setBatches(bList);
      if (!selectedBatchId && bList.length > 0) {
        setSelectedBatchId(bList[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadAttendanceRoster = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.get(`/attendance/batch/${selectedBatchId}?date=${date}`);
      if (res.data.success) {
        setAlreadyMarked(res.data.alreadyMarked);
        setRecords(res.data.data?.records || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance roster');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (index, newStatus) => {
    setRecords((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], status: newStatus };
      return copy;
    });
  };

  const handleRemarkChange = (index, newRemark) => {
    setRecords((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], remarks: newRemark };
      return copy;
    });
  };

  const handleMarkAll = (status) => {
    setRecords((prev) => prev.map((r) => ({ ...r, status })));
  };

  const handleSaveAttendance = async () => {
    if (!selectedBatchId || !date) return;
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post(`/attendance/batch/${selectedBatchId}`, {
        date,
        records,
        markedByName: user?.name || 'Faculty',
      });
      if (res.data.success) {
        setMessage('Attendance successfully recorded and saved to database!');
        setAlreadyMarked(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const total = records.length;
  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;
  const lateCount = records.filter((r) => r.status === 'Late').length;
  const attendanceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manage Attendance System
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physics Mirror Digital Attendance • Instant Roster & Daily Sync
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={saving || records.length === 0}
          className="px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
        </button>
      </div>

      {/* Control Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-4 text-xs">
        
        {/* Batch Selector */}
        <div className="w-full md:w-80">
          <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            SELECT BATCH
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0c2356] outline-none"
          >
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.timeSlot} — {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selector */}
        <div className="w-full md:w-56">
          <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            DATE
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0c2356] outline-none"
          />
        </div>

        {/* Quick Batch Actions */}
        <div className="w-full md:w-auto md:ml-auto flex items-center space-x-2 pt-4 md:pt-0">
          <button
            type="button"
            onClick={() => handleMarkAll('Present')}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold transition flex items-center space-x-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark All Present</span>
          </button>

          <button
            type="button"
            onClick={() => handleMarkAll('Absent')}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl font-bold transition flex items-center space-x-1"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Mark All Absent</span>
          </button>
        </div>

      </div>

      {/* Attendance Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">TOTAL</p>
          <p className="text-xl font-black text-slate-800">{total}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-center bg-emerald-50/30">
          <p className="text-[10px] font-bold text-emerald-600 uppercase">PRESENT</p>
          <p className="text-xl font-black text-emerald-600">{presentCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-rose-200 text-center bg-rose-50/30">
          <p className="text-[10px] font-bold text-rose-600 uppercase">ABSENT</p>
          <p className="text-xl font-black text-rose-600">{absentCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-center bg-amber-50/30">
          <p className="text-[10px] font-bold text-amber-600 uppercase">LATE</p>
          <p className="text-xl font-black text-amber-600">{lateCount}</p>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-[#0c2356] text-white p-3.5 rounded-xl text-center">
          <p className="text-[10px] font-bold text-[#ffc700] uppercase">TURNOUT</p>
          <p className="text-xl font-black text-white">{attendanceRate}%</p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {alreadyMarked && !message && (
        <div className="p-3 bg-sky-50 border border-sky-200 text-sky-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>Attendance for this date is already recorded. You can modify and re-save if needed.</span>
        </div>
      )}

      {/* Student Attendance List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">STUDENT ID</th>
                <th className="py-3 px-4">STUDENT NAME</th>
                <th className="py-3 px-4">ROLL NO</th>
                <th className="py-3 px-4 text-center">ATTENDANCE STATUS</th>
                <th className="py-3 px-4">REMARKS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length > 0 ? (
                records.map((rec, index) => (
                  <tr
                    key={rec.studentId || index}
                    className={`transition ${
                      rec.status === 'Absent'
                        ? 'bg-rose-50/40'
                        : rec.status === 'Late'
                        ? 'bg-amber-50/30'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {index + 1}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-[#1967d2]">
                      {rec.studentId}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">
                      {rec.studentName}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">
                      {rec.rollNo || 'N/A'}
                    </td>

                    {/* Status Button Group */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(index, 'Present')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                            rec.status === 'Present'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-emerald-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(index, 'Absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                            rec.status === 'Absent'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-rose-700'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(index, 'Late')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                            rec.status === 'Late'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'text-slate-600 hover:text-amber-700'
                          }`}
                        >
                          <Clock3 className="w-3.5 h-3.5" />
                          <span>Late</span>
                        </button>
                      </div>
                    </td>

                    {/* Remarks Input */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={rec.remarks || ''}
                        onChange={(e) => handleRemarkChange(index, e.target.value)}
                        placeholder="Optional remarks..."
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0c2356]"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No students currently in this batch. Please select another batch or add admissions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {records.length > 0 && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="px-8 py-3 bg-[#10b981] hover:bg-[#059669] text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center space-x-2 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving Records...' : 'Save & Submit Attendance'}</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default FacultyAttendance;

