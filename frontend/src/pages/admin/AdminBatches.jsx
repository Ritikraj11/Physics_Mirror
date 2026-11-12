import React, { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Trash2,
  Edit2,
  Eye,
  Check,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';
import AddBatchModal from '../../components/AddBatchModal';

const AdminBatches = () => {
  const [batches, setBatches] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBatchStudents, setSelectedBatchStudents] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const [bRes, fRes, cRes] = await Promise.all([
        api.get('/batches'),
        api.get('/faculties').catch(() => ({ data: { data: [] } })),
        api.get('/courses').catch(() => ({ data: { data: [] } })),
      ]);
      setBatches(bRes.data?.data || []);
      setFaculties(fRes.data?.data || []);
      setCourses(cRes.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (batchId, currentStatus) => {
    try {
      const res = await api.patch(`/batches/${batchId}/toggle-status`);
      if (res.data.success) {
        setBatches((prev) =>
          prev.map((b) =>
            b._id === batchId ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleViewStudents = async (batchId) => {
    try {
      const res = await api.get(`/batches/${batchId}`);
      if (res.data.success) {
        setSelectedBatchStudents(res.data.data);
      }
    } catch (err) {
      alert('Failed to load batch student roster');
    }
  };

  const handleDelete = async (batchId, name) => {
    if (window.confirm(`Delete batch "${name}"?`)) {
      try {
        await api.delete(`/batches/${batchId}`);
        setBatches((prev) => prev.filter((b) => b._id !== batchId));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete batch');
      }
    }
  };

  const filteredBatches =
    statusFilter === 'All'
      ? batches
      : batches.filter((b) => b.status === statusFilter);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Batch Timetable & Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physics Mirror 6 Timed Batches • Active / Inactive Status & Student Rosters
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#ffc700]" />
          <span>+ Add New Batch</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-500 uppercase text-[10px]">Filter Status:</span>
          {['All', 'Active', 'Inactive'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                statusFilter === st
                  ? 'bg-[#0c2356] text-[#ffc700] shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st} {st !== 'All' && `(${batches.filter((b) => b.status === st).length})`}
            </button>
          ))}
        </div>

        <span className="text-slate-400 font-semibold hidden sm:inline">
          Total: {batches.length} Batches configured
        </span>
      </div>

      {/* Batches Grid (6 Batches according to time and Name) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((batch) => {
          const occupancy = Math.round(((batch.enrolledCount || 0) / (batch.capacity || 40)) * 100);
          return (
            <div
              key={batch._id}
              className={`bg-white rounded-2xl border-2 transition shadow-sm hover:shadow-md flex flex-col justify-between p-5 ${
                batch.status === 'Active'
                  ? 'border-slate-200 hover:border-[#163b96]'
                  : 'border-dashed border-slate-300 opacity-80 bg-slate-50/50'
              }`}
            >
              <div>
                
                {/* Time Slot Badge & Status Toggle */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-[#0c2356] text-[#ffc700] text-xs font-bold rounded-lg flex items-center space-x-1 shadow-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{batch.timeSlot}</span>
                  </span>

                  <button
                    onClick={() => handleToggleStatus(batch._id, batch.status)}
                    title={`Click to set ${batch.status === 'Active' ? 'Inactive' : 'Active'}`}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center space-x-1 cursor-pointer transition ${
                      batch.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        batch.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-500'
                      }`}
                    ></span>
                    <span>{batch.status}</span>
                  </button>
                </div>

                {/* Batch Name & Goal */}
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {batch.name}
                </h3>
                <p className="text-xs font-semibold text-sky-700 mt-0.5">
                  {batch.targetClass}
                </p>

                {/* Occupancy Progress */}
                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-slate-600">
                    <span>Enrollment:</span>
                    <span className="font-bold text-slate-900">
                      {batch.enrolledCount || 0} / {batch.capacity || 40} seats
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        occupancy >= 80 ? 'bg-rose-500' : occupancy >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, occupancy)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Batch Details Meta */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center space-x-1.5">
                    <span className="text-slate-400">Faculty:</span>
                    <span className="font-bold text-slate-800">{batch.facultyName || 'Arun Sir'}</span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{batch.room || 'Main Hall'}</span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{batch.days?.join(', ') || 'Mon - Sat'}</span>
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleViewStudents(batch._id)}
                  className="px-3 py-1.5 bg-[#e8f0fe] text-[#1967d2] hover:bg-sky-100 font-bold rounded-lg transition flex items-center space-x-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View Students</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleToggleStatus(batch._id, batch.status)}
                    title="Toggle Active/Inactive"
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg transition"
                  >
                    {batch.status === 'Active' ? <XCircle className="w-4 h-4 text-amber-600" /> : <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => handleDelete(batch._id, batch.name)}
                    title="Delete Batch"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Batch Roster Modal */}
      {selectedBatchStudents && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedBatchStudents.timeSlot} — {selectedBatchStudents.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Enrolled Students ({selectedBatchStudents.students?.length || 0}) • Faculty: {selectedBatchStudents.facultyName}
                </p>
              </div>
              <button
                onClick={() => setSelectedBatchStudents(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">STUDENT ID</th>
                    <th className="py-2.5 px-3">NAME</th>
                    <th className="py-2.5 px-3">MOBILE</th>
                    <th className="py-2.5 px-3">ATTENDANCE</th>
                    <th className="py-2.5 px-3">FEE STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedBatchStudents.students?.length > 0 ? (
                    selectedBatchStudents.students.map((stu) => (
                      <tr key={stu._id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#1967d2]">{stu.studentId}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{stu.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{stu.mobile}</td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-600">{stu.attendanceRate ?? 0}%</td>
                        <td className="py-2.5 px-3">
                          {stu.pendingFee > 0 ? (
                            <span className="text-rose-600 font-bold">Due: ₹{stu.pendingFee}</span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">Clear</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No students currently enrolled in this batch.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBatchStudents(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      <AddBatchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchBatches()}
        faculties={faculties}
        courses={courses}
      />

    </div>
  );
};

export default AdminBatches;

