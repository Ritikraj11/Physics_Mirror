import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Mail, Phone, BookOpen, Award, Trash2, UserCheck } from 'lucide-react';
import api from '../../services/api';
import AddFacultyModal from '../../components/AddFacultyModal';

const AdminFaculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const [fRes, bRes] = await Promise.all([
        api.get('/faculties'),
        api.get('/batches').catch(() => ({ data: { data: [] } })),
      ]);
      setFaculties(fRes.data?.data || []);
      setBatches(bRes.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete faculty "${name}"?`)) {
      try {
        await api.delete(`/faculties/${id}`);
        setFaculties((prev) => prev.filter((f) => f._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete faculty');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Faculty Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physics Mirror Teaching Faculty, Assigned Batches & Contact Info
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#ffc700]" />
          <span>+ Add Faculty</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculties.map((fac) => (
          <div
            key={fac._id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#0c2356] text-[#ffc700] font-black flex items-center justify-center text-base shadow-sm">
                  {fac.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">{fac.name}</h3>
                  <p className="text-xs font-semibold text-[#1967d2]">{fac.designation}</p>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">{fac.facultyId}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600">
                <p className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono font-medium">{fac.phone}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{fac.email}</span>
                </p>
                <p className="flex items-start space-x-2">
                  <Award className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{fac.qualification} • {fac.experience}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  ASSIGNED BATCHES:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {fac.assignedBatches?.length > 0 ? (
                    fac.assignedBatches.map((b) => (
                      <span
                        key={b._id || b}
                        className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold"
                      >
                        {b.timeSlot || b.name || 'Batch'}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs italic">All Sessions / Head Faculty</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {fac.status || 'Active'}
              </span>
              <button
                onClick={() => handleDelete(fac._id, fac.name)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddFacultyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchFaculties()}
        batches={batches}
      />
    </div>
  );
};

export default AdminFaculties;

