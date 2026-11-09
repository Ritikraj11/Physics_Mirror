import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Calendar, MapPin, CalendarCheck, BookOpen } from 'lucide-react';
import api from '../../services/api';

const FacultyActiveBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faculties/me/batches');
      const all = res.data?.data || [];
      setBatches(all.filter((b) => b.status === 'Active'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Active Batches
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Active teaching sessions, lecture halls, and live student counts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div
            key={batch._id}
            className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#163b96] p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#0c2356] text-[#ffc700] text-xs font-bold rounded-lg flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{batch.timeSlot}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{batch.name}</h3>
              <p className="text-xs font-semibold text-sky-700">{batch.targetClass}</p>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{batch.room || 'Hall A'}</span>
                </p>
                <p className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{batch.days?.join(', ') || 'Mon – Sat'}</span>
                </p>
                <p className="flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Enrolled: <strong className="text-slate-800">{batch.enrolledCount || 0} students</strong></span>
                </p>
              </div>

              {/* Syllabus Progress */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                  <span>Syllabus Covered:</span>
                  <span className="font-bold text-[#0c2356]">{batch.syllabusProgress || 65}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1967d2] rounded-full"
                    style={{ width: `${batch.syllabusProgress || 65}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                to={`/faculty/attendance?batchId=${batch._id}`}
                className="w-full py-2 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold rounded-xl text-center flex items-center justify-center space-x-1.5 transition"
              >
                <CalendarCheck className="w-4 h-4 text-[#ffc700]" />
                <span>Manage Attendance</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyActiveBatches;

