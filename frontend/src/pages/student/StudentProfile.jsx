import React, { useState, useEffect } from 'react';
import { UserCheck, Lock, Check, AlertCircle, Phone, Mail, MapPin, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Change password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdErr, setPwdErr] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPwdMsg('');
    setPwdErr('');

    if (newPassword.length < 6) {
      setPwdErr('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdErr('New passwords do not match');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await api.put('/auth/updatepassword', {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        setPwdMsg('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPwdErr(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwdLoading(false);
    }
  };

  const sName = profile?.name || user?.name || 'Student';
  const sId = profile?.studentId || user?.studentId || '—';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Student Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Physics Mirror registered profile, guardian contact & account security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Basic Bio */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-[#0c2356] border-2 border-[#ffc700] overflow-hidden flex items-center justify-center mx-auto shadow-md">
            <img
              src={
                profile?.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(sName)}&background=0c2356&color=ffc700&bold=true`
              }
              alt={sName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(sName)}&background=0c2356&color=ffc700&bold=true`;
              }}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{sName}</h2>
            <p className="text-xs font-mono font-bold text-[#1967d2] mt-0.5">{sId}</p>
            <p className="text-xs text-slate-500 mt-1">Roll No: {profile?.rollNo || '—'}</p>
            {profile?.seatNumber && (
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#0c2356] text-[#ffc700] shadow-sm">
                🪑 {profile.seatNumber}
              </span>
            )}
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-center space-x-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              Status: Active
            </span>
          </div>
        </div>

        {/* Right Section: Details & Security */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">MOBILE</span>
                <p className="font-bold text-slate-800">{profile?.mobile || user?.phone || '—'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">EMAIL</span>
                <p className="font-bold text-slate-800 truncate">{profile?.email || user?.email || '—'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">GUARDIAN NAME</span>
                <p className="font-bold text-slate-800">{profile?.guardianName || '—'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">GUARDIAN MOBILE</span>
                <p className="font-bold text-slate-800">{profile?.guardianMobile || '—'}</p>
              </div>

              <div className="col-span-1 sm:col-span-2 p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">RESIDENTIAL ADDRESS</span>
                <p className="font-medium text-slate-700">{profile?.address || '—'}</p>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Change Password</span>
            </h3>

            {pwdMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{pwdMsg}</span>
              </div>
            )}

            {pwdErr && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{pwdErr}</span>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0c2356]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0c2356]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#0c2356]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="px-5 py-2.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold rounded-xl shadow transition disabled:opacity-60"
                >
                  {pwdLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentProfile;

