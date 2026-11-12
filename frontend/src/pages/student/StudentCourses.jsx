import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Calendar,
  AlertCircle,
  Award,
  GraduationCap,
} from 'lucide-react';
import api from '../../services/api';

const StudentCourses = () => {
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const [dpps, setDpps] = useState([]);
  const [loadingDPP, setLoadingDPP] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoadingDPP(true);
      setLoadingCourses(true);
      const [dppRes, userRes, coursesRes] = await Promise.all([
        api.get('/dpp/student').catch(() => ({ data: { data: [] } })),
        api.get('/auth/me').catch(() => ({ data: { profile: null } })),
        api.get('/courses').catch(() => ({ data: { data: [] } })),
      ]);

      if (dppRes.data?.success) {
        setDpps(dppRes.data.data);
      }

      if (userRes.data?.profile?.enrolledCourses) {
        setEnrolledCourses(userRes.data.profile.enrolledCourses);
      }

      if (coursesRes.data?.success) {
        setAllCourses(coursesRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load student course data:', err);
    } finally {
      setLoadingDPP(false);
      setLoadingCourses(false);
    }
  };

  const handleDownloadDPP = (dpp) => {
    try {
      api.get(`/dpp/${dpp._id}/download`).catch(() => {});

      const link = document.createElement('a');
      link.href = dpp.fileData;
      link.download = dpp.fileName || `${dpp.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(`Downloaded "${dpp.fileName || dpp.title}" successfully!`);
      setTimeout(() => setDownloadSuccess(''), 3500);
    } catch (e) {
      alert('Unable to download file.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>My Courses & Study Materials</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ffc700] text-[#0c2356]">
            DPP Downloads
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Download Daily Practice Problem (DPP) sheets uploaded by faculty and view your enrolled academic courses
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Faculty Uploaded DPP Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm">
            <Layers className="w-4 h-4 text-[#ffc700]" />
            <span>Assigned Daily Practice Problems (DPP)</span>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-[#163b96] text-[10px]">
              {dpps.length} Available
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Uploaded by Faculty</span>
        </div>

        {loadingDPP ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Loading your assigned DPP problem sets...
          </div>
        ) : dpps.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No DPP sheets uploaded for your batch yet. New problem sets will appear here once assigned!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dpps.map((dpp) => (
              <div
                key={dpp._id}
                className="p-5 bg-slate-50 hover:bg-sky-50/40 rounded-2xl border border-slate-200/80 hover:border-[#163b96]/40 transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-[#0c2356] text-[#ffc700] text-[10px] font-mono font-bold">
                      {dpp.code || 'DPP'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-[#163b96]">
                      {dpp.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {dpp.title}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Unit: <strong className="text-slate-700">{dpp.unit}</strong></span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
                    <span className="px-2 py-0.5 bg-white border rounded-md font-semibold text-slate-700">
                      🎯 {dpp.batchName}
                    </span>
                    <span className="px-2 py-0.5 bg-white border rounded-md font-semibold text-slate-700">
                      📝 {dpp.totalQuestions} Questions
                    </span>
                    {dpp.dueDate && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-semibold flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Due: {dpp.dueDate}</span>
                      </span>
                    )}
                  </div>

                  {dpp.description && (
                    <p className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded-lg border border-slate-100">
                      "{dpp.description}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    By {dpp.facultyName} • {dpp.fileSize}
                  </span>

                  <button
                    onClick={() => handleDownloadDPP(dpp)}
                    className="px-4 py-2 bg-[#0c2356] hover:bg-[#163b96] text-[#ffc700] hover:text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 text-[#ffc700]" />
                    <span>Download DPP Sheet</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrolled Courses Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm border-b pb-3">
          <GraduationCap className="w-4 h-4 text-[#ffc700]" />
          <span>Your Enrolled Courses</span>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No course enrollments active yet. Visit the institute reception or contact Arun Sir for batch and course assignment.
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map((crs, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#0c2356] text-[#ffc700] text-[10px] font-bold uppercase inline-block mb-1">
                      Enrolled Program
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{crs.courseName}</h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">ENROLLED BATCH</span>
                    <span className="text-xs font-bold text-[#163b96]">{crs.batchName || 'General Batch'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">ADMISSION DATE</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(crs.admissionDate || Date.now()).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">AGREED FEE</span>
                    <span className="font-bold text-emerald-600">
                      ₹{crs.feeAgreed?.toLocaleString('en-IN') || '—'}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">DURATION</span>
                    <span className="font-semibold text-slate-800">{crs.customDuration || '1 Year Cycle'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Institute Courses & Programs */}
      {allCourses.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm border-b pb-3">
            <BookOpen className="w-4 h-4 text-[#ffc700]" />
            <span>Institute Academic Programs & Syllabi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allCourses.map((course) => (
              <div
                key={course._id}
                className="p-5 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200 transition space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded bg-[#0c2356] text-[#ffc700] text-[10px] font-mono font-bold">
                      {course.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{course.duration}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{course.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>

                  {course.features && course.features.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {course.features.slice(0, 3).map((f, i) => (
                        <p key={i} className="text-[11px] text-slate-600 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1967d2]"></span>
                          <span>{f}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700">₹{course.totalFee?.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] font-semibold text-slate-400">Class: {course.targetClass}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
