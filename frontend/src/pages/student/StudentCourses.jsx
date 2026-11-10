import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  FolderDown,
  Layers,
  Calendar,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import api from '../../services/api';

const StudentCourses = () => {
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const [dpps, setDpps] = useState([]);
  const [loadingDPP, setLoadingDPP] = useState(true);

  useEffect(() => {
    fetchStudentDPPs();
  }, []);

  const fetchStudentDPPs = async () => {
    try {
      setLoadingDPP(true);
      const res = await api.get('/dpp/student');
      if (res.data.success) {
        setDpps(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load student DPPs:', err);
    } finally {
      setLoadingDPP(false);
    }
  };

  const handleDownloadDPP = (dpp) => {
    try {
      // Notify backend to increment count
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

  const handleDownloadStatic = (filename) => {
    setDownloadSuccess(`Downloaded "${filename}" successfully!`);
    setTimeout(() => setDownloadSuccess(''), 3000);
  };

  const courseModules = [
    {
      code: 'MOD-01',
      title: 'Unit 1: Ray Optics & Optical Instruments',
      chapters: 'Reflection, Refraction, Lens Maker Formula, Prism & Telescopes',
      status: 'Completed',
      notesFile: 'Ray_Optics_Comprehensive_Derivations.pdf',
    },
    {
      code: 'MOD-02',
      title: 'Unit 2: Wave Optics',
      chapters: 'Huygens Principle, Interference, Young’s Double Slit & Diffraction',
      status: 'In Progress',
      notesFile: 'Wave_Optics_Formulas_Handout.pdf',
    },
    {
      code: 'MOD-03',
      title: 'Unit 3: Electrostatics & Potential',
      chapters: 'Coulomb’s Law, Gauss Theorem, Capacitance & Dielectrics',
      status: 'Next Up',
      notesFile: 'Electrostatics_Formula_CheatSheet.pdf',
    },
    {
      code: 'MOD-04',
      title: 'Unit 4: Current Electricity & Magnetism',
      chapters: 'Ohm’s Law, Kirchhoff’s Laws, Biot-Savart, Ampere Circuital Law',
      status: 'Upcoming',
      notesFile: 'Current_Electricity_Circuit_Rules.pdf',
    },
  ];

  const studyMaterials = [
    { title: 'Class 11 & 12 Complete Physics Formula Handbook (Physics Mirror Special)', size: '3.4 MB', type: 'PDF' },
    { title: 'Top 100 High-Yield JEE Mains Mechanics & Electrostatics Numericals', size: '5.1 MB', type: 'PDF' },
    { title: 'NEET Physics 2026 High-Probability Questions with Step-by-Step Solutions', size: '4.8 MB', type: 'PDF' },
    { title: 'Board Exam 5-Mark Derivations Pocketbook (All Verified Proofs)', size: '2.9 MB', type: 'PDF' },
    { title: 'HC Verma Volume 1 & 2 Concept Clarification Handout', size: '6.2 MB', type: 'PDF' },
    { title: 'Dimensional Analysis & Error Calculation Rapid Sheet', size: '1.8 MB', type: 'PDF' },
  ];

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
          Download Daily Practice Problem (DPP) sheets uploaded by faculty, course syllabus, and formula notes
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

        {dpps.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No DPP sheets uploaded for your batch yet. New problem sets will appear here!
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

      {/* Course Curriculum & Syllabus Progress */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm border-b pb-3">
          <BookOpen className="w-4 h-4 text-[#ffc700]" />
          <span>Course Modules & Syllabus Milestones</span>
        </div>

        <div className="space-y-3">
          {courseModules.map((mod, i) => (
            <div
              key={i}
              className="p-4 bg-slate-50 hover:bg-sky-50/40 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0c2356] text-[#ffc700] flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                  {mod.code}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">{mod.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{mod.chapters}</p>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        mod.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : mod.status === 'In Progress'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {mod.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:self-center">
                <button
                  onClick={() => handleDownloadStatic(mod.notesFile)}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-[#163b96] text-[#0c2356] font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5 text-[#163b96]" />
                  <span>Formula Notes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Downloadable Handouts Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm border-b pb-3">
          <FolderDown className="w-4 h-4 text-[#ffc700]" />
          <span>Physics Formula Handouts & Pocketbooks (PDF)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {studyMaterials.map((mat, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 flex items-center justify-between space-x-3 transition"
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
                onClick={() => handleDownloadStatic(mat.title)}
                title="Download PDF"
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-[#0c2356] hover:text-white text-slate-700 transition"
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
