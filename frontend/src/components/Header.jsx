import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, ChevronDown, LogOut, Bell, Shield, GraduationCap, Home, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#0c2356] text-white shadow-md z-30 sticky top-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left section: Hamburger + Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 lg:hidden focus:outline-none"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white p-0.5 flex items-center justify-center shadow-sm overflow-hidden">
                <img
                  src="/logo.jpg"
                  alt="PM"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo.png';
                  }}
                />
              </div>
              <div className="flex items-baseline">
                <span className="font-extrabold text-base tracking-tight text-white">PHYSICS</span>
                <span className="font-extrabold text-base tracking-tight text-[#ffc700] ml-1">MIRROR</span>
              </div>
            </Link>
          </div>

          {/* Right section: Profile Dropdown */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              title="Go to Public Website"
              className="p-2 text-sky-200 hover:text-white hover:bg-white/10 rounded-full transition hidden sm:flex items-center space-x-1 text-xs"
            >
              <Home className="w-4 h-4" />
              <span>Website</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 py-1.5 px-3 rounded-full hover:bg-white/10 transition focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-[#ffc700] text-[#0c2356] font-extrabold flex items-center justify-center text-xs">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold capitalize tracking-wide text-white">
                  {user?.role || 'User'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-sky-300" />
              </button>

              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-2 z-50 text-slate-800 border border-slate-100 animate-in fade-in-50 duration-150"
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-[#0c2356] px-2 py-0.5 rounded">
                      {user?.role}
                    </span>
                  </div>

                  <Link
                    to="/"
                    className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0c2356]"
                  >
                    <Home className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    Visit Website
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setChangePasswordOpen(true);
                    }}
                    className="w-full flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0c2356] text-left"
                  >
                    <Lock className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    Change Password
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </header>
  );
};

export default Header;

