import React, { useState } from 'react';
import { X, Clock, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';

const AddBatchModal = ({ isOpen, onClose, onSuccess, faculties = [], courses = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    timeSlot: '05:00 AM - 07:00 AM',
    targetClass: 'Class 12th + JEE Mains',
    faculty: faculties[0]?._id || '',
    facultyName: faculties[0]?.name || 'Arun Sir',
    course: courses[0]?._id || '',
    courseName: courses[0]?.name || '',
    room: 'Hall A - Einstein Wing',
    capacity: 40,
    status: 'Active',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const timeOptions = [
    '05:00 AM - 07:00 AM',
    '08:00 AM - 10:00 AM',
    '10:30 AM - 12:30 PM',
    '03:00 PM - 05:00 PM',
    '05:30 PM - 07:30 PM',
    '08:00 PM - 10:00 PM',
  ];

  const handleFacultyChange = (e) => {
    const fId = e.target.value;
    const f = faculties.find((fac) => fac._id === fId);
    setFormData((prev) => ({
      ...prev,
      faculty: fId,
      facultyName: f ? f.name : prev.facultyName,
    }));
  };

  const handleCourseChange = (e) => {
    const cId = e.target.value;
    const c = courses.find((crs) => crs._id === cId);
    setFormData((prev) => ({
      ...prev,
      course: cId,
      courseName: c ? c.name : prev.courseName,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/batches', formData);
      if (res.data.success) {
        onSuccess && onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-[#0c2356] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#ffc700]" />
            <h2 className="text-base font-bold">Add New Batch</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Batch Name (e.g. Pratigya Batch) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Pratigya Batch"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Batch Time Slot <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Target Class / Goal
              </label>
              <input
                type="text"
                value={formData.targetClass}
                onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                placeholder="e.g. Class 12th + JEE Mains"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Assigned Faculty
              </label>
              <select
                value={formData.faculty}
                onChange={handleFacultyChange}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
              >
                <option value="">Arun Sir (Default)</option>
                {faculties.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} ({f.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Linked Course
              </label>
              <select
                value={formData.course}
                onChange={handleCourseChange}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
              >
                <option value="">General Physics</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Hall / Room
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Student Capacity
              </label>
              <input
                type="number"
                min={5}
                max={100}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none font-bold"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Batch specifics, books followed (e.g. HC Verma, Irodov), target percentiles..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
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
              className="px-5 py-2 text-xs font-bold text-[#0c2356] bg-[#ffc700] hover:bg-[#eeb900] rounded-lg shadow-md transition disabled:opacity-60 flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Creating...' : 'Create Batch'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddBatchModal;

