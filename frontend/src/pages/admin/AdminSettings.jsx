import React, { useState } from 'react';
import {
  Shield,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  Phone,
  MapPin,
  Server,
  Database,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminSettings = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/auth/updatepassword', {
        currentPassword,
        newPassword,
      });

      if (res.data?.success) {
        setSuccess('Admin password has been changed successfully! Your account security is updated.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update admin password. Please confirm your current password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Settings & Security
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Physics Mirror Institute Administration, Security & Password Management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Change Password Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-[#0c2356] text-[#ffc700] flex items-center justify-center shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Change Admin Password</h2>
              <p className="text-xs text-slate-500">
                Update your administrative login credentials
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                CURRENT PASSWORD <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current admin password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-[#0c2356] outline-none pr-11 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                NEW PASSWORD <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-[#0c2356] outline-none pr-11 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                CONFIRM NEW PASSWORD <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-[#0c2356] outline-none pr-11 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                <Save className="w-4 h-4 text-[#ffc700]" />
                <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
              </button>
            </div>
          </form>

          <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 text-[11px] text-sky-900 leading-relaxed">
            🔒 <strong>Security Note:</strong> Changing your admin password invalidates existing sessions. Remember to note down your new password safely.
          </div>
        </div>

        {/* Right Column: Admin Profile & Institute Info */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Admin Profile Details */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Administrator Profile
            </h3>

            <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-[#0c2356] text-[#ffc700] font-black text-xl flex items-center justify-center shadow-md">
                AS
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{user?.name || 'Arun Sir'}</h4>
                <p className="text-xs text-slate-500">{user?.email || 'admin@physicsmirror.com'}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Director & Super Admin
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Role Level:</span>
                <span className="font-bold text-[#0c2356]">Full Access (Admin)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Institute ID:</span>
                <span className="font-mono font-bold text-slate-800">PM-ADMIN-DIR</span>
              </div>
            </div>
          </div>

          {/* Institute Campus Card */}
          <div className="bg-[#0c2356] text-white rounded-3xl shadow-xl p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc700]/10 rounded-full blur-2xl"></div>

            <div className="flex items-center space-x-2.5 text-[#ffc700] text-xs font-bold">
              <Building className="w-4 h-4" />
              <span>HEADQUARTERS</span>
            </div>

            <div>
              <h4 className="text-lg font-black text-white">PHYSICS MIRROR</h4>
              <p className="text-xs text-sky-200 mt-0.5">Pipradi, Jhajha, District – Jamui, Bihar, India.</p>
            </div>

            <div className="pt-3 border-t border-sky-800/60 space-y-2 text-xs text-slate-300">
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#ffc700]" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#ffc700]" />
                <span>contact@physicsmirror.com</span>
              </p>
              <p className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#ffc700] mt-0.5 flex-shrink-0" />
                <span>~100m West of Sadar Hospital, Jhajha</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminSettings;

