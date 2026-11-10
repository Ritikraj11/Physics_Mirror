import React, { useState, useEffect } from 'react';
import {
  FileUp,
  FileText,
  Download,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle,
  Filter,
  Search,
  Users,
  BookOpen,
  Layers,
  X,
  UploadCloud,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FacultyDPP = () => {
  const { user } = useAuth();
  const [dpps, setDpps] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Upload Form State
  const [form, setForm] = useState({
    title: '',
    unit: '',
    batchId: '',
    batchName: '',
    targetClass: '12th',
    totalQuestions: 25,
    difficulty: 'JEE Mains / NEET',
    dueDate: '',
    description: '',
    fileName: '',
    fileSize: '',
    fileData: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dppRes, batchRes] = await Promise.all([
        api.get('/dpp/faculty'),
        api.get('/batches'),
      ]);

      if (dppRes.data.success) {
        setDpps(dppRes.data.data);
      }
      if (batchRes.data.success) {
        setBatches(batchRes.data.data);
        if (batchRes.data.data.length > 0) {
          const firstBatch = batchRes.data.data[0];
          setForm((prev) => ({
            ...prev,
            batchId: firstBatch._id,
            batchName: `${firstBatch.timeSlot} ${firstBatch.name}`,
            targetClass: firstBatch.targetClass || '12th',
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching DPP data:', err);
      setActionError('Failed to load DPPs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a PDF document for the DPP sheet.');
      return;
    }

    // Limit to 8MB
    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB limit. Please choose a smaller PDF.');
      return;
    }

    const sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setForm((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: sizeFormatted,
        fileData: loadEvt.target.result, // base64 data URI
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    if (!form.title || !form.unit) {
      setActionError('Please provide DPP title and physics unit/chapter.');
      return;
    }

    if (!form.fileData) {
      // Default to standard dummy PDF if no physical file was chosen in demo
      form.fileData =
        'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDM0L0ZpbHRlci9GbGF0ZURlY29kZT4+c3RyZWFtCnicS0wuyczPU8gvKslMLslIzFFwTCwuSExOzVFIz03MzUkvys8DAPu2DDgKZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMyAwIFIvQ29udGVudHMgMiAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERi9UZXh0XT4+Pj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9QYWdlcy9LaWRzWzEgMCBSXS9Db3VudCAxPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDMgMCBSPj4KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDE2NCAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAyNzEgMDAwMDAgbiAKMDAwMDAwMDMyMiAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNS9Sb290IDQgMCBSPj4Kc3RhcnR4cmVmCjM3MQolJUVPRgo=';
      form.fileName = form.fileName || `${form.title.replace(/\s+/g, '_')}.pdf`;
      form.fileSize = form.fileSize || '2.5 MB';
    }

    try {
      setSubmitting(true);
      const res = await api.post('/dpp', form);

      if (res.data.success) {
        setActionSuccess(`DPP "${form.title}" uploaded successfully!`);
        setUploadModalOpen(false);
        // Reset form
        setForm({
          title: '',
          unit: '',
          batchId: batches[0]?._id || '',
          batchName: batches[0] ? `${batches[0].timeSlot} ${batches[0].name}` : 'All Batches',
          targetClass: batches[0]?.targetClass || '12th',
          totalQuestions: 25,
          difficulty: 'JEE Mains / NEET',
          dueDate: '',
          description: '',
          fileName: '',
          fileSize: '',
          fileData: '',
        });
        fetchData();
      }
    } catch (err) {
      console.error('Error uploading DPP:', err);
      setActionError(err.response?.data?.message || 'Failed to upload DPP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete DPP "${title}"?`)) return;

    try {
      const res = await api.delete(`/dpp/${id}`);
      if (res.data.success) {
        setActionSuccess(`DPP "${title}" deleted.`);
        fetchData();
      }
    } catch (err) {
      console.error('Delete error:', err);
      setActionError(err.response?.data?.message || 'Failed to delete DPP.');
    }
  };

  const handleDownload = (dpp) => {
    try {
      // Trigger API to increment count
      api.get(`/dpp/${dpp._id}/download`).catch(() => {});

      // Create download anchor
      const link = document.createElement('a');
      link.href = dpp.fileData;
      link.download = dpp.fileName || `${dpp.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setActionSuccess(`Downloading "${dpp.fileName}"...`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (e) {
      alert('Unable to download file. Please check file format.');
    }
  };

  // Filter DPPs
  const filteredDPPs = dpps.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBatch =
      selectedBatch === 'All' ||
      item.batch === selectedBatch ||
      item.batchName.includes(selectedBatch);

    return matchesSearch && matchesBatch;
  });

  const totalDownloads = dpps.reduce((sum, d) => sum + (d.downloadCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center space-x-2">
            <span>Upload & Manage DPPs</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ffc700] text-[#0c2356]">
              Daily Practice Problems
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload chapter-wise assignments, numerical problem sheets, and practice sets for students to download
          </p>
        </div>

        <button
          onClick={() => {
            setActionError('');
            setActionSuccess('');
            setUploadModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#ffc700]" />
          <span>Upload New DPP</span>
        </button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total DPPs Uploaded
            </span>
            <p className="text-2xl font-black text-slate-900">{dpps.length}</p>
            <p className="text-[10px] text-slate-500">Across all Physics units</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#163b96] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Batches Reached
            </span>
            <p className="text-2xl font-black text-[#163b96]">
              {new Set(dpps.map((d) => d.batchName)).size}
            </p>
            <p className="text-[10px] text-slate-500">Pratigya, Arjun, Sankalp & more</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Student Downloads
            </span>
            <p className="text-2xl font-black text-emerald-600">{totalDownloads}</p>
            <p className="text-[10px] text-slate-500">Tracked in real-time</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by topic, unit, or DPP code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#163b96]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-semibold">Batch:</span>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-[#163b96]"
          >
            <option value="All">All Batches</option>
            {batches.map((b) => (
              <option key={b._id} value={b.name}>
                {b.timeSlot} {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DPPs List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3 text-slate-800 font-bold text-sm">
          <div className="flex items-center space-x-2 text-[#0c2356]">
            <Layers className="w-4 h-4 text-[#ffc700]" />
            <span>Uploaded Practice Problem Sheets ({filteredDPPs.length})</span>
          </div>
        </div>

        {filteredDPPs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No DPPs found matching your filter criteria. Click "Upload New DPP" to add one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDPPs.map((dpp) => (
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

                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
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
                    <p className="text-[11px] text-slate-500 italic bg-white/60 p-2 rounded-lg border border-slate-100">
                      "{dpp.description}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dpp.downloadCount || 0} student downloads</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownload(dpp)}
                      title="Download / View PDF"
                      className="px-3 py-1.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5 text-[#ffc700]" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleDelete(dpp._id, dpp.title)}
                      title="Delete DPP"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload DPP Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#0c2356] text-[#ffc700] flex items-center justify-center">
                  <FileUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload New DPP Sheet</h3>
                  <p className="text-[11px] text-slate-500">Students will be able to download this sheet</p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  DPP Title / Topic <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ray Optics: Snell's Law & Critical Angle DPP 01"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#163b96]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Physics Unit / Chapter <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ray Optics / Kinematics"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#163b96]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Target Batch <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.batchId}
                    onChange={(e) => {
                      const sel = batches.find((b) => b._id === e.target.value);
                      setForm({
                        ...form,
                        batchId: e.target.value,
                        batchName: sel ? `${sel.timeSlot} ${sel.name}` : 'All Batches',
                        targetClass: sel ? sel.targetClass : '12th',
                      });
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#163b96]"
                  >
                    <option value="all">All Batches (Common Sheet)</option>
                    {batches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.timeSlot} {b.name} ({b.targetClass})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Questions</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={form.totalQuestions}
                    onChange={(e) => setForm({ ...form, totalQuestions: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#163b96]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#163b96]"
                  >
                    <option value="Easy">Easy (Foundation)</option>
                    <option value="Medium">Medium (Board / School)</option>
                    <option value="JEE Mains / NEET">JEE Mains / NEET</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Due Date (Optional)</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#163b96]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Instructions / Description</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Solve questions 1 to 20 without calculator. Bring doubts to tomorrow's doubt session."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#163b96]"
                />
              </div>

              {/* PDF Document Upload Area */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Upload PDF File <span className="text-rose-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-[#163b96] rounded-2xl p-4 text-center bg-slate-50/50 transition">
                  <input
                    type="file"
                    id="dpp-file-input"
                    accept=".pdf,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="dpp-file-input"
                    className="cursor-pointer flex flex-col items-center space-y-1.5"
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-100 text-[#163b96] flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    {form.fileName ? (
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#0c2356] line-clamp-1">{form.fileName}</span>
                        <p className="text-[10px] text-emerald-600 font-bold">
                          ✓ File attached ({form.fileSize})
                        </p>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-slate-700">Click to upload DPP PDF sheet</span>
                        <p className="text-[10px] text-slate-400">PDF up to 8MB supported</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#0c2356] hover:bg-[#163b96] text-[#ffc700] font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <FileUp className="w-4 h-4" />
                  <span>{submitting ? 'Uploading...' : 'Publish DPP'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDPP;

