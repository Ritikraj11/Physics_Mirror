import React, { useState, useEffect } from 'react';
import { BookMarked, Clock, MapPin, Calendar, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const FacultyAssignedBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faculties/me/batches');
      setBatches(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const syllabusModules = [
    { title: 'Unit 1: Ray Optics & Optical Instruments', status: 'Completed', progress: 100 },
    { title: 'Unit 2: Wave Optics (Interference & Diffraction)', status: 'Completed', progress: 100 },
    { title: 'Unit 3: Electrostatics & Capacitance', status: 'In Progress', progress: 75 },
    { title: 'Unit 4: Current Electricity & Circuits', status: 'In Progress', progress: 50 },
    { title: 'Unit 5: Magnetic Effects & EMI / AC', status: 'Upcoming', progress: 0 },
    { title: 'Unit 6: Modern Physics & Semiconductor Devices', status: 'Upcoming', progress: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Assigned Batches & Curriculum
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Weekly timetable distribution and Physics syllabus milestone tracker
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {batches.map((batch) => (
          <div key={batch._id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="px-2.5 py-1 bg-[#0c2356] text-[#ffc700] text-xs font-bold rounded-lg inline-block mb-1">
                  {batch.timeSlot}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{batch.name}</h3>
                <p className="text-xs text-slate-500">{batch.targetClass}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-[#0c2356]">
                {batch.room || 'Hall A'}
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                PHYSICS CHAPTER MILESTONES:
              </h4>
              <div className="space-y-2">
                {syllabusModules.map((mod, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800">{mod.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          mod.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : mod.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {mod.status}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          mod.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${mod.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyAssignedBatches;

