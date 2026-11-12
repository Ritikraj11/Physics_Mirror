import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Trash2,
  CreditCard,
  User,
  CheckCircle,
  XCircle,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';
import NewAdmissionModal from '../../components/NewAdmissionModal';
import CollectFeeModal from '../../components/CollectFeeModal';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters (Matches Student_admin.png)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');

  // Modals
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [collectFeeModalOpen, setCollectFeeModalOpen] = useState(false);
  const [selectedStudentForFee, setSelectedStudentForFee] = useState(null);
  const [viewStudentModal, setViewStudentModal] = useState(null);

  useEffect(() => {
    loadFiltersAndStudents();
  }, []);

  const loadFiltersAndStudents = async () => {
    setLoading(true);
    try {
      const [sRes, cRes, bRes] = await Promise.all([
        api.get('/students'),
        api.get('/courses').catch(() => ({ data: { data: [] } })),
        api.get('/batches').catch(() => ({ data: { data: [] } })),
      ]);
      setStudents(sRes.data?.data || []);
      setCourses(cRes.data?.data || []);
      setBatches(bRes.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCourse !== 'All') params.course = selectedCourse;
      if (selectedBatch !== 'All') params.batch = selectedBatch;

      const res = await api.get('/students', { params });
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove student "${name}"? This will delete the student and their login credentials.`)) {
      try {
        await api.delete(`/students/${id}`);
        setStudents((prev) => prev.filter((s) => s._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const handleOpenFeeCollect = (student) => {
    setSelectedStudentForFee(student);
    setCollectFeeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header - Matches Student_admin.png */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manage Students
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physics Mirror Student Enrollment, Profile Management & Fees
          </p>
        </div>

        <button
          onClick={() => setAdmissionModalOpen(true)}
          className="px-5 py-2.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#ffc700]" />
          <span>+ Add New Student</span>
        </button>
      </div>

      {/* Filter Row - Matches Student_admin.png */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            placeholder="Search name, ID, phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#1967d2] focus:border-transparent outline-none transition"
          />
        </div>

        {/* Course Filter Dropdown */}
        <div className="w-full md:w-56">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#1967d2] outline-none transition"
          >
            <option value="All">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Filter Dropdown */}
        <div className="w-full md:w-56">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#1967d2] outline-none transition"
          >
            <option value="All">All Batches</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.timeSlot} {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Action Button */}
        <button
          onClick={handleFilter}
          className="w-full md:w-auto px-5 py-2 bg-[#1967d2] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5 active:scale-95 flex-shrink-0"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>

      </div>

      {/* Students Table - Exact structure from Student_admin.png */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">PHOTO</th>
                <th className="py-3.5 px-4">STUDENT ID</th>
                <th className="py-3.5 px-4">NAME</th>
                <th className="py-3.5 px-4">SEAT NO</th>
                <th className="py-3.5 px-4">ENROLLED COURSES & BATCHES</th>
                <th className="py-3.5 px-4">MOBILE</th>
                <th className="py-3.5 px-4">FEE STATUS</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length > 0 ? (
                students.map((student) => {
                  const firstEnroll = student.enrolledCourses?.[0];
                  return (
                    <tr key={student._id} className="hover:bg-slate-50/80 transition">
                      {/* Photo Column */}
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                          <img
                            src={
                              student.photo ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Student')}&background=0c2356&color=ffc700&bold=true`
                            }
                            alt={student.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'S')}&background=0c2356&color=ffc700&bold=true`;
                            }}
                          />
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {student.studentId}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {student.name}
                        {student.rollNo && (
                          <span className="block text-[10px] font-medium text-slate-400">
                            Roll: {student.rollNo}
                          </span>
                        )}
                      </td>

                      {/* Seat No Column */}
                      <td className="py-3 px-4">
                        {student.seatNumber ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#0c2356]/10 text-[#0c2356] border border-[#0c2356]/20">
                            🪑 {student.seatNumber}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Enrolled Courses & Batches - Matches Badge styling from Student_admin.png */}
                      <td className="py-3 px-4">
                        {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {student.enrolledCourses.map((enc, i) => (
                              <div key={i} className="flex items-center space-x-1">
                                <span className="px-2 py-0.5 bg-[#1967d2] text-white text-[10px] font-bold rounded">
                                  {enc.courseName || 'Physics'}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {enc.batchName || 'Batch'}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No course assigned</span>
                        )}
                      </td>

                      {/* Mobile */}
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {student.mobile}
                      </td>

                      {/* Fee Status */}
                      <td className="py-3 px-4">
                        {student.pendingFee > 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Due: ₹{student.pendingFee?.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Fully Paid
                          </span>
                        )}
                      </td>

                      {/* Status - Matches green pill from Student_admin.png */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            student.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {student.status || 'Active'}
                        </span>
                      </td>

                      {/* Actions (View, Collect Fee, Delete) */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setViewStudentModal(student)}
                            title="View Student Details"
                            className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => handleOpenFeeCollect(student)}
                            title="Collect Fee"
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(student._id, student.name)}
                            title="Delete Student"
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No students match the criteria. Click "+ Add New Student" to enroll.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {viewStudentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-full bg-[#0c2356] border-2 border-[#ffc700] overflow-hidden flex items-center justify-center shadow-md flex-shrink-0">
                  <img
                    src={
                      viewStudentModal.photo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(viewStudentModal.name || 'Student')}&background=0c2356&color=ffc700&bold=true`
                    }
                    alt={viewStudentModal.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(viewStudentModal.name || 'S')}&background=0c2356&color=ffc700&bold=true`;
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewStudentModal.name}</h3>
                  <p className="text-xs font-mono font-semibold text-[#1967d2]">{viewStudentModal.studentId}</p>
                  {viewStudentModal.seatNumber && (
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0c2356]/10 text-[#0c2356]">
                      🪑 {viewStudentModal.seatNumber}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setViewStudentModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Seat Number Assign / Update Section */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-amber-900 font-bold text-[10px] uppercase tracking-wider block">
                    ASSIGN SEAT NUMBER
                  </span>
                  <input
                    type="text"
                    value={viewStudentModal.seatNumber || ''}
                    onChange={(e) => setViewStudentModal({ ...viewStudentModal, seatNumber: e.target.value })}
                    placeholder="e.g. Seat A-12"
                    className="mt-1 px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#0c2356] w-36"
                  />
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.put(`/students/${viewStudentModal._id}`, { seatNumber: viewStudentModal.seatNumber });
                      setStudents((prev) =>
                        prev.map((s) => (s._id === viewStudentModal._id ? { ...s, seatNumber: viewStudentModal.seatNumber } : s))
                      );
                      alert('Seat number updated successfully!');
                    } catch (err) {
                      alert(err.response?.data?.message || 'Failed to update seat number');
                    }
                  }}
                  className="px-3 py-1.5 bg-[#0c2356] hover:bg-[#163b96] text-white text-[11px] font-bold rounded-lg shadow transition"
                >
                  Save Seat
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 font-semibold text-[10px] uppercase">MOBILE</span>
                  <p className="font-bold text-slate-800">{viewStudentModal.mobile}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold text-[10px] uppercase">EMAIL</span>
                  <p className="font-bold text-slate-800 truncate">{viewStudentModal.email || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold text-[10px] uppercase">GUARDIAN NAME</span>
                  <p className="font-bold text-slate-800">{viewStudentModal.guardianName || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold text-[10px] uppercase">GUARDIAN PHONE</span>
                  <p className="font-bold text-slate-800">{viewStudentModal.guardianMobile || 'N/A'}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold text-[10px] uppercase">ADDRESS</span>
                <p className="font-medium text-slate-700">{viewStudentModal.address || 'Address not recorded.'}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-sky-50 rounded-xl border border-sky-100">
                <div>
                  <span className="text-[10px] text-sky-700 font-semibold">ATTENDANCE</span>
                  <p className="text-base font-black text-[#0c2356]">{viewStudentModal.attendanceRate ?? 0}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-sky-700 font-semibold">FEE PAID</span>
                  <p className="text-base font-black text-emerald-600">₹{viewStudentModal.feePaid?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-[10px] text-sky-700 font-semibold">PENDING DUE</span>
                  <p className="text-base font-black text-rose-600">₹{viewStudentModal.pendingFee?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => {
                  const s = viewStudentModal;
                  setViewStudentModal(null);
                  handleOpenFeeCollect(s);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                Collect Due Fee
              </button>
              <button
                onClick={() => setViewStudentModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admission Modal */}
      <NewAdmissionModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        onSuccess={() => loadFiltersAndStudents()}
        initialCourses={courses}
        initialBatches={batches}
      />

      {/* Collect Fee Modal */}
      <CollectFeeModal
        isOpen={collectFeeModalOpen}
        onClose={() => setCollectFeeModalOpen(false)}
        onSuccess={() => loadFiltersAndStudents()}
        preselectedStudent={selectedStudentForFee}
      />

    </div>
  );
};

export default AdminStudents;

