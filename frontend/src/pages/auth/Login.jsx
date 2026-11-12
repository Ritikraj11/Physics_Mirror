import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Shield, UserCheck, Lock, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';
  const [activeRole, setActiveRole] = useState(initialRole);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole) => {
    setActiveRole(newRole);
    setSearchParams({ role: newRole });
    setError('');
    // Auto populate demo value based on role
    if (newRole === 'student') {
      setIdentifier('PM26009');
      setPassword('student123');
    } else if (newRole === 'faculty') {
      setIdentifier('arunsir@physicsmirror.com');
      setPassword('faculty123');
    } else {
      setIdentifier('admin@physicsmirror.com');
      setPassword('admin123');
    }
  };

  const handleQuickDemo = (role, id, pwd) => {
    setActiveRole(role);
    setSearchParams({ role });
    setIdentifier(id);
    setPassword(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({
        identifier,
        password,
        role: activeRole,
      });

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'faculty') {
        navigate('/faculty');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c2356] bg-grid-pattern text-white flex flex-col justify-between p-4 sm:p-6 font-sans">

      {/* Top Header - Matches WhatsApp Screenshot */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-6 pt-2">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-full bg-white p-1 shadow-md flex items-center justify-center overflow-hidden border border-slate-100">
            <img
              src="/logo.jpg"
              alt="Physics Mirror Logo"
              className="w-full h-full object-contain rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.png';
              }}
            />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight leading-none">
              PHYSICS <span className="text-[#ffc700]">MIRROR</span>
            </div>
            <p className="text-[11px] font-semibold tracking-widest text-sky-200 uppercase mt-0.5">
              INSTITUTE PORTAL
            </p>
          </div>
        </Link>

        <Link
          to="/"
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center space-x-1 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>
      </div>

      {/* Main Card (Matches WhatsApp Image 2026-11-08 at 9.13.23 AM.jpeg & .24 AM.jpeg) */}
      <div className="max-w-md w-full mx-auto my-auto">

        {/* Role Tabs */}
        <div className="flex bg-[#07173b]/90 p-1.5 rounded-2xl mb-4 border border-sky-400/20 shadow-lg">
          <button
            type="button"
            onClick={() => handleRoleSwitch('student')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${activeRole === 'student'
                ? 'bg-[#ffc700] text-[#0c2356] shadow-md'
                : 'text-slate-300 hover:text-white'
              }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('faculty')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${activeRole === 'faculty'
                ? 'bg-[#ffc700] text-[#0c2356] shadow-md'
                : 'text-slate-300 hover:text-white'
              }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${activeRole === 'admin'
                ? 'bg-[#ffc700] text-[#0c2356] shadow-md'
                : 'text-slate-300 hover:text-white'
              }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* White Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-2xl border border-slate-100">

          {/* Header Icon + Sign In title */}
          <div className="flex items-center space-x-3.5 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#0c2356] text-[#ffc700] flex items-center justify-center shadow-md">
              {activeRole === 'student' ? (
                <GraduationCap className="w-6 h-6" />
              ) : activeRole === 'faculty' ? (
                <UserCheck className="w-6 h-6" />
              ) : (
                <Shield className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                Sign in
              </h2>
              <p className="text-xs text-slate-500 mt-1 capitalize font-medium">
                {activeRole} Portal Access
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1 uppercase tracking-wider text-[10px]">
                {activeRole === 'student'
                  ? 'STUDENT ID / MOBILE / EMAIL'
                  : activeRole === 'faculty'
                    ? 'FACULTY ID / EMAIL'
                    : 'ADMIN EMAIL'}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  activeRole === 'student'
                    ? 'e.g. PM26009 or 9876543209'
                    : activeRole === 'faculty'
                      ? 'e.g. arunsir@physicsmirror.com'
                      : 'admin@physicsmirror.com'
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium text-sm focus:ring-2 focus:ring-[#0c2356] focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1 uppercase tracking-wider text-[10px]">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium text-sm focus:ring-2 focus:ring-[#0c2356] focus:border-transparent outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-extrabold text-sm rounded-xl shadow-lg transition duration-150 disabled:opacity-60 flex items-center justify-center space-x-2 active:scale-98"
            >
              <Lock className="w-4 h-4 text-[#ffc700]" />
              <span>{loading ? 'Authenticating...' : 'Sign in'}</span>
            </button>
          </form>

          {/* Yellow Info Box (Matches WhatsApp Screenshot) */}
          <div className="mt-5 p-3.5 bg-[#fff9db] border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
            Online login is active. For account help or new batch access, call{' '}
            <strong className="underline decoration-amber-600">+91 98765 43210</strong>.
          </div>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
              <KeyRound className="w-3 h-3 mr-1 text-slate-400" />
              QUICK ONE-CLICK DEMO FILL:
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickDemo('student', 'PM26009', 'student123')}
                className="p-1.5 bg-sky-50 hover:bg-sky-100 text-[#0c2356] font-bold rounded-lg border border-sky-100 transition truncate"
                title="Sneha Joshi (Class 11 - PM26009)"
              >
                🎓 Sneha (Student)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('faculty', 'arunsir@physicsmirror.com', 'faculty123')}
                className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-100 transition truncate"
                title="Arun Sir (Head Physics Faculty)"
              >
                👨‍🏫 Arun Sir (Faculty)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin', 'admin@physicsmirror.com', 'admin123')}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg border border-slate-200 transition truncate"
                title="Admin Desk"
              >
                🛡️ Admin Desk
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-sky-200/70 py-2">
        <p>© {new Date().getFullYear()} Physics Mirror • Concept-first coaching for 9th to 12th, JEE & NEET</p>
      </div>

    </div>
  );
};

export default Login;

