import React from 'react';
import { Sparkles, Database } from 'lucide-react';

const LoadingSplash = ({ progress = 0, message = 'Fetching data from database...' }) => {
  // Determine contextual progress status
  const getSubStatus = (p) => {
    if (p < 25) return 'Connecting to MongoDB Atlas Database...';
    if (p < 55) return 'Retrieving student & batch records...';
    if (p < 85) return 'Synchronizing timetable & fee ledgers...';
    if (p < 100) return 'Finalizing data payload...';
    return 'Synchronized successfully!';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0c2356]/95 backdrop-blur-md text-white p-4 select-none animate-fadeIn">
      {/* Background Decorative Rings */}
      <div className="absolute w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-[#ffc700]/10 blur-2xl pointer-events-none" />

      {/* Main Content Box */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center space-y-6">

        {/* Glowing Logo Container */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#ffc700] to-sky-400 opacity-60 blur-md animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-white p-1.5 shadow-2xl flex items-center justify-center border-2 border-[#ffc700] overflow-hidden">
            <img
              src="/logo.jpg"
              alt="Physics Mirror Logo"
              className="w-full h-full object-contain rounded-full animate-float"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.png';
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="text-lg font-black tracking-wider uppercase text-white flex items-center justify-center space-x-1.5">
            <span>PHYSICS</span>
            <span className="text-[#ffc700]">MIRROR</span>
            <Sparkles className="w-4 h-4 text-[#ffc700]" />
          </div>
          <p className="text-[11px] font-bold text-sky-200 uppercase tracking-widest">
            INSTITUTE MANAGEMENT SYSTEM
          </p>
        </div>

        {/* Live Percentage Display */}
        <div className="flex flex-col items-center space-y-2 w-full pt-2">
          <div className="flex items-baseline space-x-1 font-mono">
            <span className="text-5xl font-black text-[#ffc700] drop-shadow-[0_0_12px_rgba(255,199,0,0.4)]">
              {Math.min(100, Math.max(0, Math.round(progress)))}
            </span>
            <span className="text-xl font-bold text-sky-300">%</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden border border-sky-800/80 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ffc700] via-sky-400 to-[#ffc700] transition-all duration-200 ease-out shadow-[0_0_10px_#ffc700]"
              style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
            />
          </div>

          {/* Dynamic Status Text */}
          <div className="pt-2 space-y-1">
            <p className="text-xs font-semibold text-white tracking-wide flex items-center justify-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-[#ffc700] animate-pulse" />
              <span>{message}</span>
            </p>
            <p className="text-[11px] text-sky-300 font-mono">
              {getSubStatus(progress)}
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 text-[10px] text-slate-400 font-medium">
          Secure Cloud Sync with MongoDB Atlas
        </div>
      </div>
    </div>
  );
};

export default LoadingSplash;

