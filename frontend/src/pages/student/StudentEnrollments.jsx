import React, { useState, useEffect } from 'react';
import { FolderOpen, Clock, Calendar, CheckCircle, Award, BookOpen } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentEnrollments = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const enrollments = profile?.enrolledCourses || [
    {
      courseName: 'Class 11th Physics Foundation + NEET',
      batchName: '08:00 AM - 10:00 AM Arjun Batch',
      admissionDate: new Date('2026-08-01'),
      feeAgreed: 20000,
      customDuration: '1 Year Academic Cycle',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Your Course Enrollments
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Physics Mirror active admissions, batch schedules & curriculum access
        </p>
      </div>

      <div className="space-y-4">
        {enrollments.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="px-3 py-1 bg-[#0c2356] text-[#ffc700] rounded-xl text-xs font-bold inline-block mb-1">
                  Active Enrollment
                </span>
                <h2 className="text-xl font-bold text-slate-900">{item.courseName}</h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 font-semibold block uppercase">AGREED FEE</span>
                <span className="text-xl font-black text-emerald-600">
                  ₹{item.feeAgreed?.toLocaleString('en-IN') || '20,000'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">ASSIGNED BATCH</span>
                <p className="font-bold text-[#0c2356] text-sm">{item.batchName || 'Morning Batch'}</p>
                <p className="text-slate-500">Hall B • Newton Wing</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">ADMISSION DATE</span>
                <p className="font-bold text-slate-800 text-sm">
                  {new Date(item.admissionDate || Date.now()).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-slate-500">Academic Year 2026–27</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">PROGRAM DURATION</span>
                <p className="font-bold text-slate-800 text-sm">
                  {item.customDuration || '1 Year (Full Cycle)'}
                </p>
                <p className="text-slate-500">Includes Test Series</p>
              </div>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-start space-x-3 text-xs text-sky-950">
              <Award className="w-5 h-5 text-[#1967d2] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Included Privileges:</p>
                <p className="text-sky-800 mt-0.5">
                  Full access to Arun Sir's personal doubt desk, weekly numerical drill sheets, monthly All-India mock test rankings, and recorded video archives.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentEnrollments;

