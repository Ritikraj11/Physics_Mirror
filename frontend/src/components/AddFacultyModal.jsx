import React, { useState } from 'react';
import { X, GraduationCap, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';

const AddFacultyModal = ({ isOpen, onClose, onSuccess, batches = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: 'Physics Faculty',
    qualification: 'M.Sc Physics (Gold Medalist)',
    specialization: 'Mechanics, Optics & Electrodynamics',
    experience: '6+ Years',
    assignedBatches: [],
    password: 'faculty123',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBatchToggle = (batchId) => {
    setFormData((prev) => {
      const exists = prev.assignedBatches.includes(batchId);
      const updated = exists
        ? prev.assignedBatches.filter((id) => id !== batchId)
        : [...prev.assignedBatches, batchId];
      return { ...prev, assignedBatches: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/faculties', formData);
      if (res.data.success) {
        onSuccess && onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add faculty');
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
            <GraduationCap className="w-5 h-5 text-[#ffc700]" />
            <h2 className="text-base font-bold">Add New Faculty Member</h2>
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
              Faculty Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Er. R. K. Sharma"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="faculty@physicsmirror.com"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Contact Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="10-digit phone"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Designation
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Senior JEE Faculty"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Qualification
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. B.Tech IIT, M.Sc Physics"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Subject Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Modern Physics, Rotational Mechanics, Wave Optics"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0c2356] outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Assign Batches
            </label>
            <div className="max-h-28 overflow-y-auto space-y-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg">
              {batches.map((b) => (
                <label key={b._id} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-100 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={formData.assignedBatches.includes(b._id)}
                    onChange={() => handleBatchToggle(b._id)}
                    className="rounded text-[#0c2356] focus:ring-[#0c2356]"
                  />
                  <span className="font-medium text-slate-700">
                    {b.timeSlot} - {b.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Initial Login Password
            </label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="faculty123"
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
              <span>{loading ? 'Adding...' : 'Add Faculty'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddFacultyModal;

