import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const FacultyStudents = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, bRes] = await Promise.all([
        api.get('/faculties/me/students'),
        api.get('/faculties/me/batches'),
      ]);
      setStudents(sRes.data?.data || []);
      setBatches(bRes.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      const params = {};
      if (selectedBatch !== 'All') params.batchId = selectedBatch;
      if (searchTerm) params.search = searchTerm;
      const res = await api.get('/faculties/me/students', { params });
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Students Directory
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Physics Mirror students enrolled in your assigned teaching batches
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            placeholder="Search student name, ID or mobile..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white outline-none"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
          >
            <option value="All">All My Batches</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.timeSlot} {b.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleFilter}
          className="px-5 py-2 bg-[#0c2356] text-white font-bold text-xs rounded-xl shadow"
        >
          Filter
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">STUDENT ID</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">ROLL NO</th>
                <th className="py-3 px-4">BATCH</th>
                <th className="py-3 px-4">MOBILE</th>
                <th className="py-3 px-4">ATTENDANCE RATE</th>
                <th className="py-3 px-4">TEST AVERAGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length > 0 ? (
                students.map((stu) => (
                  <tr key={stu._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#1967d2]">
                      {stu.studentId}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {stu.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {stu.rollNo || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {stu.enrolledCourses?.[0]?.batchName || 'Physics Batch'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {stu.mobile}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {stu.attendanceRate || 92}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {stu.testAverage || 80}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyStudents;

