import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Clock,
  GraduationCap,
  CreditCard,
  BarChart3,
  Bell,
  Award,
  Settings,
  CalendarCheck,
  BookMarked,
  UserCheck,
  CheckCircle,
  LogOut,
  FolderOpen,
  FileUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ role = 'admin', isOpen = true, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Batches', path: '/admin/batches', icon: Clock },
    { name: 'Faculties', path: '/admin/faculties', icon: GraduationCap },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Notices', path: '/admin/notices', icon: Bell },
    { name: 'Settings & Security', path: '/admin/settings', icon: Settings },
  ];

  const facultyNav = [
    { name: 'Dashboard', path: '/faculty', icon: LayoutDashboard },
    { name: 'My Active Batches', path: '/faculty/active-batches', icon: Clock },
    { name: 'My Students', path: '/faculty/students', icon: Users },
    { name: 'My Assigned Batches', path: '/faculty/assigned-batches', icon: BookMarked },
    { name: 'Manage Attendance', path: '/faculty/attendance', icon: CalendarCheck },
    { name: 'Upload DPP', path: '/faculty/dpp', icon: FileUp },
  ];

  const studentNav = [
    { name: 'Student Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Your Enrollments', path: '/student/enrollments', icon: FolderOpen },
    { name: 'My Profile', path: '/student/profile', icon: UserCheck },
    { name: 'My Courses & DPP', path: '/student/courses', icon: BookOpen },
    { name: 'Fee & Receipts', path: '/student/fees', icon: CreditCard },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'faculty' ? facultyNav : studentNav;

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="py-5 px-3">
        {/* Role tag */}
        <div className="px-4 py-2 mb-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            PORTAL ACCESS
          </span>
          <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0c2356] text-[#ffc700]">
            {role}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/admin' || item.path === '/faculty' || item.path === '/student'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-[#e8f0fe] text-[#1967d2] font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User card at bottom */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#0c2356] text-[#ffc700] font-bold flex items-center justify-center flex-shrink-0 text-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'PM'}
            </div>
            <div className="truncate text-left">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.studentId || user?.facultyId || user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

