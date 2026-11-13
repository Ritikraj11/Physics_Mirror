import React, { useState, useEffect } from 'react';

const LoadingSplash = ({ progress = 0, delay = 0 }) => {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible) return null;

  const currentProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const circumference = 314.16; // 2 * Math.PI * 50
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0c2356]/95 backdrop-blur-xl text-white p-6 select-none animate-fadeIn">
      {/* Soft Ambient Radial Background Glow */}
      <div className="absolute w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-[#ffc700]/10 blur-2xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-7">
        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-2xl border-2 border-[#ffc700]/70 flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png?v=3"
              alt="Physics Mirror Logo"
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.jpg?v=3';
              }}
            />
          </div>
          <h2 className="text-lg font-black tracking-widest text-white uppercase">
            PHYSICS <span className="text-[#ffc700]">MIRROR</span>
          </h2>
        </div>

        {/* Round Circular Loader with Live Percentage */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg
            className="w-full h-full -rotate-90 transform"
            viewBox="0 0 120 120"
          >
            <defs>
              <linearGradient id="pmProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffc700" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Background Track Circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="7"
              fill="transparent"
            />

            {/* Dynamic Animated Progress Stroke */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#pmProgressGradient)"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-200 ease-out"
            />
          </svg>

          {/* Centered Percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black text-white font-mono tracking-tight flex items-baseline">
              {currentProgress}
              <span className="text-xs font-bold text-[#ffc700] ml-0.5">%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSplash;
