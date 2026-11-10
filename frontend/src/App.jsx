import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import FacultyLayout from './layouts/FacultyLayout';
import StudentLayout from './layouts/StudentLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminBatches from './pages/admin/AdminBatches';
import AdminFaculties from './pages/admin/AdminFaculties';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReports from './pages/admin/AdminReports';
import AdminNotices from './pages/admin/AdminNotices';
import AdminCourses from './pages/admin/AdminCourses';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyActiveBatches from './pages/faculty/FacultyActiveBatches';
import FacultyStudents from './pages/faculty/FacultyStudents';
import FacultyAssignedBatches from './pages/faculty/FacultyAssignedBatches';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import FacultyDPP from './pages/faculty/FacultyDPP';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentEnrollments from './pages/student/StudentEnrollments';
import StudentProfile from './pages/student/StudentProfile';
import StudentCourses from './pages/student/StudentCourses';
import StudentFees from './pages/student/StudentFees';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Portal */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="batches" element={<AdminBatches />} />
        <Route path="faculties" element={<AdminFaculties />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="settings" element={<AdminReports />} />
      </Route>

      {/* Faculty Portal */}
      <Route path="/faculty" element={<FacultyLayout />}>
        <Route index element={<FacultyDashboard />} />
        <Route path="active-batches" element={<FacultyActiveBatches />} />
        <Route path="students" element={<FacultyStudents />} />
        <Route path="assigned-batches" element={<FacultyAssignedBatches />} />
        <Route path="attendance" element={<FacultyAttendance />} />
        <Route path="dpp" element={<FacultyDPP />} />
      </Route>

      {/* Student Portal */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="enrollments" element={<StudentEnrollments />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="fees" element={<StudentFees />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

