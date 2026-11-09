import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, Shield, UserCheck, Phone, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handlePortalRedirect = () => {
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'faculty') navigate('/faculty');
    else navigate('/student');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0c2356] text-white shadow-md border-b border-[#163b96]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="relative w-12 h-12 rounded-full bg-white p-1 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Physics Mirror Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://cdn-icons-png.flflaticon.com/512/3067/3067260.png';
                }}
              />
            </div>
            <div>
              <div className="flex items-center text-xl sm:text-2xl font-black tracking-tight leading-none">
                <span className="text-white">PHYSICS</span>
                <span className="text-[#ffc700] ml-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">MIRROR</span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-sky-200 uppercase mt-0.5">
                BY ARUN SIR
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium">
            <Link to="/" className="text-white hover:text-[#ffc700] transition">
              Home
            </Link>
            <a href="#about" className="text-sky-100 hover:text-[#ffc700] transition">
              About Us
            </a>
            <a href="#courses" className="text-sky-100 hover:text-[#ffc700] transition">
              Courses
            </a>
            <a href="#batches" className="text-sky-100 hover:text-[#ffc700] transition">
              Batches
            </a>
            <a href="#faculty" className="text-sky-100 hover:text-[#ffc700] transition">
              Our Faculty
            </a>
            <a href="#youtube" className="text-sky-100 hover:text-[#ffc700] transition">
              YouTube Classes
            </a>
            <a href="#contact" className="text-sky-100 hover:text-[#ffc700] transition">
              Contact Us
            </a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePortalRedirect}
                  className="px-4 py-2 bg-[#ffc700] hover:bg-[#eeb900] text-[#0c2356] font-bold text-sm rounded-full shadow-md transition flex items-center space-x-1.5"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>My Portal ({user.role})</span>
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-semibold text-sky-200 hover:text-white border border-sky-400/30 hover:border-white rounded-full transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login?role=student"
                  className="px-4 py-2 bg-[#ffc700] hover:bg-[#eeb900] text-[#0c2356] font-bold text-xs sm:text-sm rounded-full shadow transition flex items-center space-x-1.5 active:scale-95"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Login</span>
                </Link>
                <Link
                  to="/login?role=faculty"
                  className="px-3.5 py-2 bg-[#163b96] hover:bg-[#1f4ebb] text-white font-medium text-xs sm:text-sm rounded-full border border-sky-400/30 transition flex items-center space-x-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#ffc700]" />
                  <span>Faculty</span>
                </Link>
                <Link
                  to="/login?role=admin"
                  className="px-3.5 py-2 bg-[#081738] hover:bg-[#0c2356] text-white font-medium text-xs sm:text-sm rounded-full border border-sky-400/30 transition flex items-center space-x-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-[#ffc700]" />
                  <span>Admin</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#143888] text-white hover:bg-[#1a47ac] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Matches WhatsApp Image 2026-11-08 at 9.13.20 AM.jpeg exactly!) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c2356]/95 backdrop-blur-md flex flex-col p-6 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-6 border-b border-sky-800/60">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white p-1">
                <img src="/logo.png" alt="PM" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-xl font-black text-white">
                  PHYSICS <span className="text-[#ffc700]">MIRROR</span>
                </div>
                <div className="text-xs font-semibold text-sky-200">BY ARUN SIR</div>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full bg-sky-950/60 text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-4 py-8 text-lg font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#ffc700] py-2 px-3 rounded-lg bg-sky-900/40"
            >
              Home
            </Link>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-[#ffc700] py-2 px-3"
            >
              About Us
            </a>
            <a
              href="#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-[#ffc700] py-2 px-3"
            >
              Courses
            </a>
            <a
              href="#batches"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-[#ffc700] py-2 px-3"
            >
              Batches (6 Timings)
            </a>
            <a
              href="#faculty"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-[#ffc700] py-2 px-3"
            >
              Our Faculty
            </a>
            <a
              href="#youtube"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-[#ffc700] py-2 px-3"
            >
              YouTube Classes
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-[#ffc700] py-2 px-3"
            >
              Contact Us
            </a>
          </nav>

          <div className="mt-auto space-y-3 pt-6 border-t border-sky-800/60">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handlePortalRedirect();
                  }}
                  className="w-full py-3.5 bg-[#ffc700] text-[#0c2356] font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Go to My Dashboard ({user.role})</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-3 bg-red-600/80 text-white font-semibold rounded-2xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login?role=student"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 bg-[#ffc700] text-[#0c2356] font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Student Login</span>
                </Link>
                <Link
                  to="/login?role=faculty"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-[#163b96] border border-sky-400/40 text-white font-semibold rounded-2xl flex items-center justify-center space-x-2"
                >
                  <UserCheck className="w-5 h-5 text-[#ffc700]" />
                  <span>Faculty Login</span>
                </Link>
                <Link
                  to="/login?role=admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-[#081738] border border-sky-400/30 text-white font-semibold rounded-2xl flex items-center justify-center space-x-2"
                >
                  <Shield className="w-5 h-5 text-[#ffc700]" />
                  <span>Admin Login</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

