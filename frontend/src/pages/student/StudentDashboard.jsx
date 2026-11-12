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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.profile) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fallbacks matching the WhatsApp screenshot (Sneha Joshi)
  const studentName = profile?.name || user?.name || 'Sneha Joshi';
  const studentId = profile?.studentId || user?.studentId || 'PM26009';
  const targetClass = profile?.targetClass || 'Class 11';
  const rollNo = profile?.rollNo || '11-02';
  const attendanceRate = profile?.attendanceRate ?? 94;
  const testAverage = profile?.testAverage ?? 82;
  const feePaid = profile?.feePaid ?? 15000;
  const pendingFee = profile?.pendingFee ?? 5000;

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
          
          {/* Avatar Circle with initials (Matches screenshot: Dark blue circle with bold yellow initials) */}
          <div className="w-20 h-20 rounded-full bg-[#07173b] border-2 border-sky-400/30 text-[#ffc700] font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            {initials}
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
            <p className="text-xs text-sky-200 mt-1">This month (sample)</p>
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
            <h3 className="text-4xl font-black text-[#0c2356]">{testAverage}%</h3>
            <p className="text-xs text-slate-500 mt-1">Last 3 tests</p>
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

          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#0c2356] text-[#ffc700] text-xs font-bold">
              {enrolledCourse?.batchName || '08:00 AM - 10:00 AM Arjun Batch'}
            </span>
            <h4 className="text-base font-bold text-slate-900">
              {enrolledCourse?.courseName || 'Class 11th Physics Foundation + NEET'}
            </h4>
            <p className="text-xs text-slate-600">
              Faculty: <strong>Arun Sir</strong> • Hall A
            </p>
            <p className="text-xs text-slate-500">Days: Monday to Saturday</p>
          </div>
        </div>

        {/* Quick Links & Study Material */}
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
            <Link
              to="/student/courses"
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between transition group"
            >
              <div>
                <p className="font-bold text-slate-800">Ray & Wave Optics Formula Sheet</p>
                <p className="text-[11px] text-slate-400">PDF Document • 4.2 MB</p>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-[#0c2356]" />
            </Link>

            <Link
              to="/student/fees"
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between transition group"
            >
              <div>
                <p className="font-bold text-slate-800">Term 1 Payment Receipt (₹15,000)</p>
                <p className="text-[11px] text-emerald-600 font-semibold">Official Downloadable PDF</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0c2356]" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;

