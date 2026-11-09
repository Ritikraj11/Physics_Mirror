import React from 'react';
import { BookOpen, Play, Download, CheckCircle, FileText, ExternalLink } from 'lucide-react';

const StudentCourses = () => {
  const lectures = [
    {
      title: 'Ray Optics: Laws of Reflection & Curved Mirrors',
      duration: '45 mins',
      faculty: 'Arun Sir',
      status: 'Watched',
      notes: 'Optics_L01_Summary.pdf',
    },
    {
      title: 'Snell’s Law, Total Internal Reflection & Optical Fiber',
      duration: '52 mins',
      faculty: 'Arun Sir',
      status: 'Watched',
      notes: 'TIR_CriticalAngle_Formulas.pdf',
    },
    {
      title: 'Thin Lens Formula & Lens Maker Equation Derivation',
      duration: '58 mins',
      faculty: 'Arun Sir',
      status: 'Next Up',
      notes: 'LensMaker_Derivation_HCVerma.pdf',
    },
    {
      title: 'Wave Optics: Huygens Principle & Wavefront Analysis',
      duration: '40 mins',
      faculty: 'Dr. Priya Verma',
      status: 'Upcoming',
      notes: 'Wavefront_Notes.pdf',
    },
  ];

  const studyMaterials = [
    { title: 'Class 11 & 12 Formula Cheat Sheet (Arun Sir Special)', size: '3.4 MB', type: 'PDF' },
    { title: 'Top 100 JEE Mains High-Yield Mechanics Numericals', size: '5.1 MB', type: 'PDF' },
    { title: 'NEET Physics 2026 Expected Questions with Solutions', size: '4.8 MB', type: 'PDF' },
    { title: 'Derivation Pocketbook: All 5-Mark Board Derivations', size: '2.9 MB', type: 'PDF' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Courses & Study Materials
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Video lectures with Arun Sir, chapterwise formula notes & problem sheets
        </p>
      </div>

      {/* Video Lectures Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm border-b pb-3">
          <Play className="w-4 h-4 text-[#ffc700] fill-[#ffc700]" />
          <span>Curriculum Lectures & Recorded Sessions</span>
        </div>

        <div className="space-y-3">
          {lectures.map((lec, i) => (
            <div
              key={i}
              className="p-4 bg-slate-50 hover:bg-sky-50/50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0c2356] text-[#ffc700] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Play className="w-4 h-4 fill-[#ffc700]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">{lec.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {lec.faculty} • {lec.duration} • <span className="font-semibold text-emerald-600">{lec.status}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:self-center">
                <button
                  onClick={() => alert(`Opening lecture: "${lec.title}" by ${lec.faculty}`)}
                  className="px-4 py-2 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Watch Lecture
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Downloadable Materials Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm border-b pb-3">
          <BookOpen className="w-4 h-4 text-[#ffc700]" />
          <span>Downloadable Physics Notes & Handouts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {studyMaterials.map((mat, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between space-x-3"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-red-100 text-red-600 font-bold text-[10px]">
                  PDF
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 line-clamp-1">{mat.title}</h5>
                  <p className="text-slate-400 text-[10px]">{mat.size}</p>
                </div>
              </div>

              <button
                onClick={() => alert(`Downloading ${mat.title}...`)}
                title="Download"
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;

