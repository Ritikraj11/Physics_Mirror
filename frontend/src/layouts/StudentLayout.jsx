import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LoadingSplash from '../components/LoadingSplash';
import { useAuth } from '../context/AuthContext';

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSplash progress={80} delay={750} />;
  }

  if (!user || (user.role !== 'student' && user.role !== 'admin')) {
    return <Navigate to="/login?role=student" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar role="student" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
