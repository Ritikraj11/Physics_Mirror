import React, { useState, useEffect } from 'react';
import { X, Info, BookOpen, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';

const NewAdmissionModal = ({ isOpen, onClose, onSuccess, initialCourses = [], initialBatches = [] }) => {
  const [courses, setCourses] = useState(initialCourses);
  const [batches, setBatches] = useState(initialBatches);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    dob: '',
    gender: 'Male',
    mobile: '',
    email: '',
    guardianName: '',
    guardianMobile: '',
    address: '',
    seatNumber: '',
    photo: '',
    courseId: '',
    batchId: '',
    totalFee: 20000,
    admissionDate: new Date().toISOString().slice(0, 10),
    customDuration: '',
    status: 'Active',
    password: 'student123',
    targetClass: '12th',
  });

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    try {
      const [idRes, cRes, bRes] = await Promise.all([
        api.get('/students/next-id').catch(() => ({ data: { nextId: 'PM26011' } })),
        courses.length ? Promise.resolve({ data: { data: courses } }) : api.get('/courses'),
        batches.length ? Promise.resolve({ data: { data: batches } }) : api.get('/batches'),
      ]);

      const nextId = idRes.data?.nextId || 'PM26011';
      const cList = cRes.data?.data || [];
      const bList = bRes.data?.data || [];

      setCourses(cList);
      setBatches(bList);

      setFormData((prev) => ({
        ...prev,
        studentId: nextId,
        courseId: cList[0]?._id || '',
        batchId: bList[0]?._id || '',
        totalFee: cList[0]?.totalFee || 24000,
      }));
    } catch (err) {
      console.error('Error fetching modal defaults:', err);
    }
  };

  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value;
    const selectedCourse = courses.find((c) => c._id === selectedCourseId);
    setFormData((prev) => ({
      ...prev,
      courseId: selectedCourseId,
      totalFee: selectedCourse ? selectedCourse.totalFee : prev.totalFee,
      targetClass: selectedCourse ? selectedCourse.targetClass : prev.targetClass,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo size exceeds 5MB limit');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/students', formData);
      if (res.data.success) {
        setSuccessMsg(`Student admitted successfully! Registration ID: ${res.data.data.studentId}`);
        setTimeout(() => {
          onSuccess && onSuccess(res.data.data);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit admission');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Matches New_admission.png */}
        <div className="bg-[#1a56db] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold">New Admission</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#1a56db] font-bold text-sm border-b border-slate-200 pb-2">
              <Info className="w-4 h-4" />
              <span>Personal Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Student ID (Registration No)
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  readOnly
                  placeholder="Auto-generated"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-600 font-semibold cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sneha Joshi"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] focus:border-transparent outline-none transition"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Guardian Name
                </label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  placeholder="Parent / Guardian Name"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Guardian Mobile
                </label>
                <input
                  type="tel"
                  name="guardianMobile"
                  value={formData.guardianMobile}
                  onChange={handleChange}
                  placeholder="Parent Contact"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] focus:border-transparent outline-none transition"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                <label className="block text-slate-700 font-semibold mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete residential address"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] focus:border-transparent outline-none transition"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Initial Course Enrollment */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#1a56db] font-bold text-sm border-b border-slate-200 pb-2">
              <BookOpen className="w-4 h-4" />
              <span>Initial Course Enrollment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleCourseChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] outline-none"
                >
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Batch <span className="text-red-500">*</span>
                </label>
                <select
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] outline-none"
                >
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.timeSlot} - {b.name} ({b.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Total Course Fee (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalFee"
                  required
                  min={0}
                  value={formData.totalFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Admission Date
                </label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Custom Duration (Optional)
                </label>
                <input
                  type="text"
                  name="customDuration"
                  value={formData.customDuration}
                  onChange={handleChange}
                  placeholder="e.g., 1 Month (Leave blank for default)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Seat Number (Assigned by Faculty / Admin)
                </label>
                <input
                  type="text"
                  name="seatNumber"
                  value={formData.seatNumber}
                  onChange={handleChange}
                  placeholder="e.g. Seat A-12 or Row 1 Seat 4"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Student Photo
                </label>
                <div className="flex items-center space-x-3">
                  {formData.photo ? (
                    <div className="relative w-11 h-11 rounded-full border-2 border-[#ffc700] overflow-hidden flex-shrink-0 shadow-sm group">
                      <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, photo: '' }))}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-[9px] font-bold opacity-0 group-hover:opacity-100 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-2 py-1.5 text-[11px] bg-slate-50 border border-slate-300 rounded-lg file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-sky-100 file:text-[#0c2356] cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or WebP (Max 5MB)</p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Initial Password
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="student123"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1a56db] outline-none"
                />
              </div>

            </div>
          </div>

          {/* Footer - Matches New_admission.png */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-xs font-bold text-white bg-[#1a56db] hover:bg-[#1546b3] rounded-lg shadow-md transition disabled:opacity-60 flex items-center space-x-1.5"
            >
              {loading ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Admission</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default NewAdmissionModal;

