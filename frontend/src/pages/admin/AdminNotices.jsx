import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Calendar, AlertCircle, Check } from 'lucide-react';
import api from '../../services/api';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNoticeOpen, setNewNoticeOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [priority, setPriority] = useState('Normal');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notices');
      setNotices(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/notices', {
        title,
        content,
        targetAudience,
        priority,
      });
      if (res.data.success) {
        setNotices([res.data.data, ...notices]);
        setNewNoticeOpen(false);
        setTitle('');
        setContent('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post notice');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await api.delete(`/notices/${id}`);
        setNotices((prev) => prev.filter((n) => n._id !== id));
      } catch (err) {
        alert('Failed to delete notice');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Institute Announcements & Notices
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast test schedules, holiday notifications & batch updates
          </p>
        </div>

        <button
          onClick={() => setNewNoticeOpen(true)}
          className="px-5 py-2.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#ffc700]" />
          <span>+ Post Notice</span>
        </button>
      </div>

      {newNoticeOpen && (
        <form onSubmit={handleCreateNotice} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900">Create New Announcement</h3>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunday Physics Mega Mock Test on Electrostatics"
              className="w-full px-3 py-2 border rounded-xl outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl outline-none"
              >
                <option value="all">All (Students & Faculty)</option>
                <option value="student">Students Only</option>
                <option value="faculty">Faculty Only</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl outline-none"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Message Content *</label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed announcement content..."
              className="w-full px-3 py-2 border rounded-xl outline-none"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setNewNoticeOpen(false)}
              className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0c2356] text-white rounded-xl font-bold"
            >
              Post Announcement
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {notices.map((n) => (
          <div key={n._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    n.priority === 'High' || n.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-sky-100 text-[#0c2356]'
                  }`}
                >
                  {n.priority}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Target: {n.targetAudience}
                </span>
              </div>
              <button
                onClick={() => handleDelete(n._id)}
                className="text-slate-400 hover:text-rose-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900">{n.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>

            <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100">
              <span>Posted by: <strong className="text-slate-600">{n.postedBy || 'Arun Sir'}</strong></span>
              <span>{new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminNotices;

