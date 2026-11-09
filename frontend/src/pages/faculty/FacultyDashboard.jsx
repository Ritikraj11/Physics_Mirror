import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Users,
  CalendarCheck,
  BookMarked,
  ArrowRight,
  CheckCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    setLoading(true);
    try {
      const [bRes, sRes] = await Promise.all([
        api.get('/faculties/me/batches'),
        api.get('/faculties/me/students'),
      ]);
      setBatches(bRes.data?.data || []);
      setStudents(sRes.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeBatchesCount = batches.filter((b) => b.status === 'Active').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-[#0c2356] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden bg-grid-pattern">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#163b96] text-[#ffc700] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Faculty Desk • Physics Mirror</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Faculty Member'}!
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 max-w-xl">
            You are managing <strong>{batches.length} Batches</strong> and <strong>{students.length} Active Students</strong> across Class 9th to 12th, JEE & NEET.
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <Link
              to="/faculty/attendance"
              className="px-4 py-2 bg-[#ffc700] hover:bg-[#eeb900] text-[#0c2356] font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Mark Today's Attendance</span>
            </Link>
            <Link
              to="/faculty/active-batches"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition flex items-center space-x-1.5"
            >
              <Clock className="w-4 h-4 text-[#ffc700]" />
              <span>View Active Batches</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">MY ACTIVE BATCHES</p>
            <h3 className="text-3xl font-black text-[#0c2356] mt-1">{activeBatchesCount}</h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1">Running smoothly</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#1967d2] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">TOTAL STUDENTS TAUGHT</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{students.length}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">Across your batches</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">TODAY'S SCHEDULE</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">Daily Timetable</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">Hall A, B & Lab</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ATTENDANCE SYSTEM</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">One-Click</h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1">Ready for today</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Assigned Batches Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm">
            <Clock className="w-4 h-4 text-[#ffc700]" />
            <span>My Teaching Batches Schedule</span>
          </div>
          <Link
            to="/faculty/active-batches"
            className="text-xs font-semibold text-[#1967d2] hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <div key={batch._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#0c2356] text-[#ffc700] text-[10px] font-bold">
                  {batch.timeSlot}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {batch.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{batch.name}</h4>
              <p className="text-[11px] text-slate-500">{batch.targetClass}</p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Students: <strong className="text-slate-800">{batch.enrolledCount || 0}</strong></span>
                <Link
                  to={`/faculty/attendance?batchId=${batch._id}`}
                  className="font-bold text-[#1967d2] hover:underline"
                >
                  Mark Attendance →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FacultyDashboard;

