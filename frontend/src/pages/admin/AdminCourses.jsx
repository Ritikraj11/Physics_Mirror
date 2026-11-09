import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetClass: '12th',
    totalFee: 24000,
    duration: '1 Year',
    description: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses');
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/courses', formData);
      if (res.data.success) {
        setCourses([...courses, res.data.data]);
        setModalOpen(false);
        setFormData({
          name: '',
          targetClass: '12th',
          totalFee: 24000,
          duration: '1 Year',
          description: '',
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete course "${name}"?`)) {
      try {
        await api.delete(`/courses/${id}`);
        setCourses(courses.filter((c) => c._id !== id));
      } catch (err) {
        alert('Failed to delete course');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Academic Courses & Programs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physics Mirror Curriculums for Classes 9th, 10th, 11th, 12th, JEE Mains & NEET
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#ffc700]" />
          <span>+ Add Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-[#0c2356]">
                  {course.targetClass}
                </span>
                <span className="text-sm font-extrabold text-emerald-600">
                  ₹{course.totalFee?.toLocaleString('en-IN')}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{course.name}</h3>
              <p className="text-xs text-slate-500">{course.description || 'Comprehensive physics program.'}</p>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-600">
                <p><strong>Duration:</strong> {course.duration || '1 Year'}</p>
                <p><strong>Code:</strong> {course.code}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {course.status || 'Active'}
              </span>
              <button
                onClick={() => handleDelete(course._id, course.name)}
                className="text-slate-400 hover:text-rose-600 transition p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Add New Course</h3>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Course Title *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Class 12th Board Booster"
                className="w-full px-3 py-2 border rounded-xl outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Class</label>
                <select
                  value={formData.targetClass}
                  onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl outline-none"
                >
                  <option value="9th">Class 9th</option>
                  <option value="10th">Class 10th</option>
                  <option value="11th">Class 11th</option>
                  <option value="12th">Class 12th</option>
                  <option value="JEE Mains">JEE Mains</option>
                  <option value="NEET">NEET</option>
                  <option value="Dropper">Dropper</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fee (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.totalFee}
                  onChange={(e) => setFormData({ ...formData, totalFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl outline-none font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 1 Year / 6 Months"
                className="w-full px-3 py-2 border rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl outline-none"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0c2356] text-white font-bold rounded-xl"
              >
                Create Course
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;

