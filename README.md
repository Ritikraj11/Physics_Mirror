# 🌟 Physics Mirror — Institute Management System
> **Premier Physics Coaching for Classes 9th, 10th, 11th, 12th, JEE Mains & NEET**  
> **Founder & Director:** Arun Sir  
> **Tagline:** *"See Physics clearly. Score brilliantly."*

---

## 🎨 Brand Identity & Theme
Built strictly adhering to the **Physics Mirror** color palette and visual assets provided:
- **Primary Navy:** `#0c2356` (Header, Active Sidebar, Primary Buttons)
- **Brand Yellow / Gold:** `#ffc700` (Logo Bulb, "MIRROR" highlight, Warning / Pending Fee Card, High-priority CTA)
- **Accent Blues:** `#163b96`, `#1967d2` (Badges, Links, Active Tabs)
- **Backgrounds:** Clean `#f8fafc` and `#f1f5f9` with subtle blueprint grid pattern (`bg-grid-pattern`)

---

## 🚀 Full-Stack Production Architecture
- **Frontend:** React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, Axios
- **Backend:** Node.js, Express.js, JWT Authentication, Bcryptjs password hashing, Morgan logging, CORS
- **Database:** MongoDB with Mongoose ODM (includes an instant zero-config embedded JSON datastore fallback for immediate offline testing)
- **Security:** `.gitignore` configured to keep `.env` and sensitive credentials secure

---

## 🔑 Demo Login Credentials

| Role | Username / Identifier | Password | Associated Details |
| :--- | :--- | :--- | :--- |
| **🛡️ Admin** | `admin@physicsmirror.com` | `admin123` | Arun Sir (Admin & Director) |
| **👨‍🏫 Faculty** | `arunsir@physicsmirror.com` | `faculty123` | Founder & Head Physics Faculty |
| **👨‍🏫 Faculty** | `rksharma@physicsmirror.com` | `faculty123` | Er. R. K. Sharma (JEE Advanced) |
| **👨‍🏫 Faculty** | `priya.verma@physicsmirror.com` | `faculty123` | Dr. Priya Verma (NEET Specialist) |
| **🎓 Student** | `PM26009` *(or `9876543209`)* | `student123` | **Sneha Joshi** (Class 11, Arjun Batch) |
| **🎓 Student** | `STU2026090010` | `student123` | **Student 10** (Rahul Verma, Class 12) |
| **🎓 Student** | `PM26001` | `student123` | **Aarav Sharma** (Class 12, Pratigya Batch) |

*Tip: On the `/login` page, you can also use the one-click "Demo Fill" buttons to immediately sign in as any role.*

---

## ⏰ Batches Configured by Time & Name

As specified, 6 timed batches are integrated with active/inactive status controls:

1. **05:00 AM – 07:00 AM** — **Pratigya Batch** *(Class 12th + JEE Mains)* — `Active`
2. **08:00 AM – 10:00 AM** — **Arjun Batch** *(Class 11th + NEET Focus)* — `Active`
3. **10:30 AM – 12:30 PM** — **Sankalp Batch** *(Class 10th Foundation)* — `Active`
4. **03:00 PM – 05:00 PM** — **Lakshya Batch** *(Class 9th Foundation)* — `Active`
5. **05:30 PM – 07:30 PM** — **Vijeta Batch** *(Class 12th Board Booster)* — `Active`
6. **08:00 PM – 10:00 PM** — **Brahmastra Batch** *(Dropper Target JEE/NEET)* — `Inactive` *(Ready to toggle)*

---

## 📌 Features Breakdown

### 1. 🛡️ Admin Portal (`/admin`)
- **Dashboard** *(Matches `Dashboard.png`)*:
  - Header with `+ Add Student` and `Collect Fee`
  - 4 Summary Cards: Total Students (Active count), Total Courses & Batches (6 / 6), Fees Collected (₹), Pending Fees (₹)
  - Split Tables: Recent Admissions & Recent Payments (with instant PDF/Printable receipt action)
- **Student Management** *(Matches `Student_admin.png`)*:
  - Search by Name, Student ID, Mobile
  - Filter by Course dropdown & Batch dropdown
  - Table: Photo, Student ID, Name, Enrolled Courses & Batches pills, Mobile, Fee Status, Active Status, View/Delete/Collect actions
  - **New Admission Modal** *(Matches `New_admission.png`)*: Auto-generated Student ID (`PM26011`), Personal details, Guardian info, Course & Batch selector, Total Fee, Admission Date, Student Photo upload, Status
- **Batches Section**:
  - Time slots & batch names with Active/Inactive switch
  - Student occupancy progress bars
  - View Batch Student Rosters
  - Add New Batch modal
- **Faculties Section**:
  - Faculty member directory, subject specializations, qualifications, assigned batches
  - Add Faculty modal
- **Fee Collection & Payments**:
  - Collect fee from any student with automatic due balance computation
  - Printable official Computerized Fee Receipt with Physics Mirror seal and Arun Sir signature
- **Reports & Analytics**:
  - Batch occupancy breakdown, class distribution, payment channels
- **Notices**: Broadcast announcements to students, faculty, or all

### 2. 👨‍🏫 Faculty Portal (`/faculty`)
- **Faculty Dashboard**: Welcome card, quick metrics, today's schedule, one-click attendance shortcut
- **My Active Batches**: Assigned running sessions with syllabus progress
- **My Students**: Filter students by batch, view attendance %, test averages, parent contact
- **My Assigned Batches**: Weekly timetable, lesson plan milestones (Optics, Mechanics, Waves, Electrostatics)
- **Manage Attendance with Attendance System**:
  - Select Batch & Date
  - Interactive student roster with Present (green), Absent (red), Late (amber) buttons
  - Quick **"Mark All Present"** and **"Mark All Absent"** buttons
  - Real-time turnout calculation and one-click database sync

### 3. 🎓 Student Portal (`/student`)
- **Student Dashboard** *(Matches WhatsApp Picture `WhatsApp Image 2026-11-08 at 9.13.23 AM (1).jpeg`)*:
  - Deep blue banner with yellow avatar initials: **Sneha Joshi (Class 11 · Roll 11-02 · ID PM26009)**
  - 4 Metric cards:
    - **Attendance:** 94% (Deep blue card)
    - **Test Average:** 82% (White card)
    - **Fee Paid:** ₹15,000 (White card)
    - **Pending Fee:** ₹5,000 (Vibrant Yellow card)
- **Your Enrollments**: Course name, assigned batch timing, duration, agreed fee
- **My Profile**: Personal details, guardian details, address, change password module
- **My Courses & Notes**: Chapterwise formula PDF sheets, numerical problem sets, and syllabus tracking
- **Fee Receipts & Dues**: Transaction history with View/Print official receipt modal

---

## 💻 Running the Application

### 1. Start Backend Server (Connected to MongoDB Atlas)
```bash
# From root directory:
npm run server
# Or directly from backend:
cd backend && npm start
# Backend runs on http://localhost:5000 (MongoDB Atlas Connected: physics_mirror)
```

### 2. Start Frontend Client (Vite + React)
```bash
# From root directory:
npm run client
# Or directly from frontend:
cd frontend && npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Production Deployment & API Endpoint
- **Live Render Backend:** `https://physics-mirror-api.onrender.com`
- When deploying the frontend (e.g. to Vercel, Netlify, or Render), configure the environment variable:
  ```env
  VITE_API_URL=https://physics-mirror-api.onrender.com
  ```
- In local development, the frontend automatically falls back to `https://physics-mirror-api.onrender.com` or whatever is set in `frontend/.env`.

### 4. Re-seed MongoDB Atlas Database (Optional)
```bash
npm run seed
```

