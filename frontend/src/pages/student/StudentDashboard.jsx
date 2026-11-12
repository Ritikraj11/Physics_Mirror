import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Trophy,
  IndianRupee,
  Wallet,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentDpp, setRecentDpp] = useState(null);
  const [recentPayment, setRecentPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [userRes, dppRes, paymentRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/dpp/student').catch(() => ({ data: { data: [] } })),
        api.get('/payments/me').catch(() => ({ data: { payments: [] } })),
      ]);

      if (userRes.data?.success && userRes.data?.profile) {
        setProfile(userRes.data.profile);
      }
      if (dppRes.data?.success && dppRes.data?.data?.length > 0) {
        setRecentDpp(dppRes.data.data[0]);
      }
      if (paymentRes.data?.success && paymentRes.data?.payments?.length > 0) {
        setRecentPayment(paymentRes.data.payments[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDpp = (dpp) => {
    if (!dpp || !dpp.fileData) return;
    try {
      const link = document.createElement('a');
      link.href = dpp.fileData;
      link.download = dpp.fileName || `${dpp.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert('Unable to download file.');
    }
  };

  const studentName = profile?.name || user?.name || 'Student';
  const studentId = profile?.studentId || user?.studentId || '—';
  const targetClass = profile?.targetClass || '—';
  const rollNo = profile?.rollNo || '—';
  const attendanceRate = profile?.attendanceRate ?? 0;
  const testAverage = profile?.testAverage ?? 0;
  const feePaid = profile?.feePaid ?? 0;
  const pendingFee = profile?.pendingFee ?? 0;

  const initials = studentName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const enrolledCourse = profile?.enrolledCourses?.[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Welcome Banner - Exact recreation of WhatsApp Image 2026-11-08 at 9.13.23 AM (1).jpeg */}
      <div className="bg-[#0c2356] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden bg-grid-pattern border border-sky-900/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 relative z-10">
          
          {/* Avatar with photo / initials */}
          <div className="w-20 h-20 rounded-full bg-[#07173b] border-2 border-[#ffc700] text-[#ffc700] font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
            <img
              src={
                profile?.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=07173b&color=ffc700&bold=true`
              }
              alt={studentName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=07173b&color=ffc700&bold=true`;
              }}
            />
          </div>

          {/* Student Info */}
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-sky-200">
              Welcome back,
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {studentName}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-sky-100 flex items-center space-x-1.5 flex-wrap">
              <span>{targetClass}</span>
              <span>•</span>
              <span>Roll {rollNo}</span>
              <span>•</span>
              <span>
                ID <strong className="text-[#ffc700] font-bold">{studentId}</strong>
              </span>
              {profile?.seatNumber && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-[#ffc700] text-[#0c2356] font-extrabold text-xs shadow">
                    🪑 {profile.seatNumber}
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="sm:ml-auto pt-2 sm:pt-0">
            <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold">
              ● Active Enrollment
            </span>
          </div>

        </div>
      </div>

      {/* 4 Metric Cards - Exact layout & colors from WhatsApp Image 2026-11-08 at 9.13.23 AM (1).jpeg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: ATTENDANCE (Deep Blue Card) */}
        <div className="bg-[#0c2356] text-white p-6 rounded-3xl shadow-md border border-sky-800/40 flex flex-col justify-between h-44">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
              ATTENDANCE
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#ffc700] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-black text-white">{attendanceRate}%</h3>
            <p className="text-xs text-sky-200 mt-1">
              {attendanceRate > 0 ? 'Live Attendance Record' : 'No attendance recorded yet'}
            </p>
          </div>
        </div>

        {/* Card 2: TEST AVERAGE (White Card) */}
        <div className="bg-white text-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between h-44">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              TEST AVERAGE
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#1967d2] flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-black text-[#0c2356]">
              {testAverage > 0 ? `${testAverage}%` : '—'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {testAverage > 0 ? 'Performance Average' : 'No tests conducted yet'}
            </p>
          </div>
        </div>

        {/* Card 3: FEE PAID (White Card) */}
        <div className="bg-white text-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between h-44">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              FEE PAID
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">
              ₹{feePaid?.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Verified Receipts</p>
          </div>
        </div>

        {/* Card 4: PENDING FEE (Vibrant Yellow Card from Screenshot!) */}
        <div className="bg-[#ffc700] text-[#0c2356] p-6 rounded-3xl shadow-md flex flex-col justify-between h-44">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#0c2356]/80">
              PENDING FEE
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#0c2356] text-[#ffc700] flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#0c2356]">
              ₹{pendingFee?.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs font-bold text-[#0c2356]/90 mt-1">Due for current term</p>
          </div>
        </div>

      </div>

      {/* Current Batch & Timetable Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Your Enrolled Batch */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm">
              <Clock className="w-4 h-4 text-[#ffc700]" />
              <span>Your Enrolled Session</span>
            </div>
            <Link
              to="/student/enrollments"
              className="text-xs font-bold text-[#1967d2] hover:underline"
            >
              Full Details →
            </Link>
          </div>

          {enrolledCourse ? (
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-[#0c2356] text-[#ffc700] text-xs font-bold">
                {enrolledCourse.batchName || 'Assigned Batch'}
              </span>
              <h4 className="text-base font-bold text-slate-900">
                {enrolledCourse.courseName || 'Physics Course'}
              </h4>
              <p className="text-xs text-slate-600">
                Faculty: <strong>Arun Sir</strong> • Main Lecture Hall
              </p>
              <p className="text-xs text-slate-500">
                Enrolled on: {new Date(enrolledCourse.admissionDate || Date.now()).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center py-6">
              <p className="text-xs font-semibold text-slate-600">No active batch assigned yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Please contact the institute desk for batch allotment.
              </p>
            </div>
          )}
        </div>

        {/* Real Academic Resources & Downloads */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm">
              <BookOpen className="w-4 h-4 text-[#ffc700]" />
              <span>Academic Resources</span>
            </div>
            <Link
              to="/student/courses"
              className="text-xs font-bold text-[#1967d2] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {recentDpp ? (
              <div className="p-3 bg-sky-50 hover:bg-sky-100/70 border border-sky-200/60 rounded-xl flex items-center justify-between transition">
                <div>
                  <p className="font-bold text-slate-900 line-clamp-1">{recentDpp.title}</p>
                  <p className="text-[11px] text-[#1967d2] font-semibold">
                    Unit: {recentDpp.unit} • {recentDpp.totalQuestions || 25} Questions
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadDpp(recentDpp)}
                  title="Download DPP Sheet"
                  className="p-2 rounded-xl bg-white text-[#0c2356] hover:bg-[#0c2356] hover:text-white shadow-sm border border-sky-200 transition"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            {recentPayment ? (
              <Link
                to="/student/fees"
                className="p-3 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/60 rounded-xl flex items-center justify-between transition group"
              >
                <div>
                  <p className="font-bold text-slate-900">
                    Fee Payment: ₹{recentPayment.amount?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    Receipt #{recentPayment.receiptNo} • {new Date(recentPayment.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition" />
              </Link>
            ) : null}

            {!recentDpp && !recentPayment && (
              <div className="py-6 text-center text-slate-400 text-xs">
                No recent study materials or payment records yet.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;

