import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Play,
  Clock,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  GraduationCap,
  Shield,
  UserCheck,
  Send,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Calendar,
  Zap,
  Navigation,
  Compass,
  Building,
  ExternalLink,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const LandingPage = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    mobile: '',
    email: '',
    targetClass: '12th',
    preferredBatchTime: 'Any / Flexible Timing',
    message: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBatchesAndCourses();
  }, []);

  const fetchBatchesAndCourses = async () => {
    try {
      setLoadingData(true);
      const [bRes, cRes] = await Promise.all([
        api.get('/batches').catch(() => ({ data: { data: [] } })),
        api.get('/courses').catch(() => ({ data: { data: [] } })),
      ]);
      setBatches(bRes.data?.data || []);
      setCourses(cRes.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/enquiries', enquiryForm);
      setEnquirySubmitted(true);
      setTimeout(() => {
        setEnquirySubmitted(false);
        setEnquiryModalOpen(false);
        setEnquiryForm({
          name: '',
          mobile: '',
          email: '',
          targetClass: '12th',
          preferredBatchTime: '05:00 AM - 07:00 AM',
          message: '',
        });
      }, 1800);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit enquiry');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section - Matches WhatsApp Image 2026-11-08 at 9.13.21 AM.jpeg */}
      <section className="relative bg-[#0c2356] text-white pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-grid-pattern">
        {/* Subtle glowing radial background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center sm:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column (Hero Content) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Badge (Matches WhatsApp Image 2026-11-08 at 9.13.21 AM.jpeg) */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#183980]/80 border border-[#ffc700]/30 text-xs sm:text-sm font-semibold text-[#ffc700] shadow-sm">
                <Sparkles className="w-4 h-4 text-[#ffc700]" />
                <span>Admissions Open 2026–27</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15]">
                See Physics{' '}
                <span className="text-[#ffc700] relative inline-block drop-shadow-[0_2px_8px_rgba(255,199,0,0.3)]">
                  clearly.
                </span>{' '}
                <br className="hidden sm:block" />
                Score{' '}
                <span className="text-white drop-shadow-md">
                  brilliantly.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-sky-100/90 leading-relaxed max-w-2xl">
                Concept-first coaching for Class 9 to 12, JEE and NEET with{' '}
                <span className="font-bold text-white underline decoration-[#ffc700] decoration-2 underline-offset-4">
                  Arun Sir
                </span>{' '}
                — where every formula reflects a real idea.
              </p>

              {/* CTAs (Matches WhatsApp Image 2026-11-08 at 9.13.21 AM.jpeg) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  onClick={() => setEnquiryModalOpen(true)}
                  className="px-8 py-4 bg-[#ffc700] hover:bg-[#eeb900] text-[#0c2356] font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition duration-150 flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>Enquire for Admission</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="#batches"
                  className="px-7 py-4 bg-transparent hover:bg-white/10 text-white font-bold text-base rounded-2xl border-2 border-white/40 hover:border-white transition flex items-center justify-center space-x-2"
                >
                  <Clock className="w-4 h-4 text-[#ffc700]" />
                  <span>Explore Batch Timings</span>
                </a>
              </div>

              {/* Class Catered Pills */}
              <div className="pt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-200">
                <span className="text-slate-400">Classes Covered:</span>
                {['Class 9th', 'Class 10th', 'Class 11th', 'Class 12th', 'JEE Mains & Advanced', 'NEET Physics'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-white/10 text-white border border-white/10 hover:border-[#ffc700]/50 transition"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

            </div>

            {/* Right Column (Hero Visual Card & Direct Portals) */}
            <div className="lg:col-span-5">
              <div className="relative bg-gradient-to-br from-[#122e6b] to-[#081738] p-6 sm:p-8 rounded-3xl border border-sky-400/20 shadow-2xl space-y-6">

                {/* Visual Header */}
                <div className="flex items-center space-x-4 pb-4 border-b border-sky-400/20">
                  <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center overflow-hidden">
                    <img
                      src="/logo.jpg"
                      alt="Physics Mirror Logo"
                      className="w-full h-full object-contain rounded-xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/logo.png';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">
                      PHYSICS <span className="text-[#ffc700]">MIRROR</span>
                    </h3>
                    <p className="text-xs font-bold text-sky-300">INSTITUTE MANAGEMENT SYSTEM</p>
                    <p className="text-[11px] text-slate-400">Direct Role-Based Portal Access</p>
                  </div>
                </div>

                {/* Quick Login Portals Box */}
                <div className="space-y-3">
                  <Link
                    to="/login?role=student"
                    className="w-full p-4 bg-[#ffc700] hover:bg-[#eeb900] text-[#0c2356] font-bold rounded-2xl shadow-md transition flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#0c2356] text-[#ffc700] rounded-xl">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-extrabold leading-tight">Student Portal</p>
                        <p className="text-xs font-medium text-[#0c2356]/80">Dashboard, Fees, Attendance & Courses</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#0c2356] transform group-hover:translate-x-1 transition" />
                  </Link>

                  <Link
                    to="/login?role=faculty"
                    className="w-full p-4 bg-[#14357c] hover:bg-[#194094] text-white font-bold rounded-2xl border border-sky-400/30 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-sky-500/20 text-[#ffc700] rounded-xl">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-extrabold leading-tight">Faculty Portal</p>
                        <p className="text-xs font-normal text-sky-200">Active Batches, Students & Attendance System</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-sky-300 transform group-hover:translate-x-1 transition" />
                  </Link>

                  <Link
                    to="/login?role=admin"
                    className="w-full p-4 bg-[#0a1b42] hover:bg-[#0e245a] text-white font-bold rounded-2xl border border-white/10 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 text-[#ffc700] rounded-xl">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-extrabold leading-tight">Admin Desk</p>
                        <p className="text-xs font-normal text-slate-300">Complete Institute Management & Fee Collection</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 transform group-hover:translate-x-1 transition" />
                  </Link>
                </div>

                <div className="pt-2 text-center text-xs text-sky-300">
                  <p>📍 Offline Classrooms & Smart Hybrid Labs</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Key Statistics Box - Matches WhatsApp Image 2026-11-08 at 9.13.22 AM.jpeg */}
      <section className="relative z-20 -mt-10 sm:-mt-14 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

          <div className="pt-4 lg:pt-0">
            <h3 className="text-3xl sm:text-4xl font-black text-[#0c2356]">10+</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Years of teaching</p>
          </div>

          <div className="pt-4 lg:pt-0">
            <h3 className="text-3xl sm:text-4xl font-black text-[#0c2356]">2500+</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Students guided</p>
          </div>

          <div className="pt-4 lg:pt-0">
            <h3 className="text-3xl sm:text-4xl font-black text-[#0c2356]">95%</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Board pass with distinction</p>
          </div>

          <div className="pt-4 lg:pt-0">
            <h3 className="text-3xl sm:text-4xl font-black text-[#0c2356]">6</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Programs offered</p>
          </div>

        </div>
      </section>

      {/* About Section - Matches WhatsApp Image 2026-11-08 at 9.13.22 AM.jpeg */}
      <section id="about" className="py-20 sm:py-28 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffc700]"></span>
                <span>ABOUT PHYSICS MIRROR</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0c2356] leading-tight">
                A mirror that{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#0c2356]">reflects concepts</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[#ffc700] -z-0"></span>
                </span>
                , not just answers
              </h2>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                PHYSICS MIRROR was founded with one core belief — when students truly understand the underlying physics, top marks follow naturally. We do not believe in rote memorization or endless mindless formula cramming.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Led personally by <strong>Arun Sir</strong>, our methodology connects everyday natural phenomena to mathematical equations, making complex topics like Electrodynamics, Ray Optics, and Rotational Mechanics intuitive and memorable.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-slate-200">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Concept-First Visuals</h4>
                    <p className="text-[11px] text-slate-500">Physical demonstrations & animated ray diagrams.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-slate-200">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Personal Doubt Desk</h4>
                    <p className="text-[11px] text-slate-500">Daily 1-on-1 doubt solving with Arun Sir.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800"
                  alt="Classroom Physics Teaching"
                  className="w-full h-96 object-cover opacity-90 hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2356] via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ffc700] text-[#0c2356] px-2.5 py-0.5 rounded-full">
                    Arun Sir Mentorship
                  </span>
                  <h4 className="text-lg font-bold mt-1">Physics that clicks in seconds</h4>
                  <p className="text-xs text-sky-200">Available across all 6 dedicated batch timings.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Batches Section - Synced with Database */}
      <section id="batches" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-[#163b96] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              TIMETABLE & BATCHES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0c2356]">
              {batches.length > 0
                ? `${batches.length} Specialized Batches by Timing & Focus`
                : 'Specialized Batches by Timing & Focus'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Morning early bird batches to evening boosters — designed to fit seamlessly around your school schedule.
            </p>
          </div>

          {loadingData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-16 bg-slate-200 rounded w-full"></div>
                  <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
                </div>
              ))}
            </div>
          ) : batches.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#1967d2] flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">New Batches Being Scheduled</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upcoming academic batches for the new session are currently being scheduled. Submit an enquiry to reserve your preferred timing slot.
              </p>
              <button
                onClick={() => {
                  setEnquiryForm((prev) => ({
                    ...prev,
                    preferredBatchTime: 'Any / Flexible Timing',
                  }));
                  setEnquiryModalOpen(true);
                }}
                className="mt-2 px-6 py-2.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs rounded-xl shadow transition"
              >
                Enquire for Batch Timings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map((batch) => {
                const isActive = batch.status === 'Active';
                const daysText = Array.isArray(batch.days)
                  ? batch.days.join(', ')
                  : (batch.days || 'Monday – Saturday');

                return (
                  <div
                    key={batch._id}
                    className={`rounded-2xl p-6 border-2 transition relative flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#f8fafc] border-slate-200 hover:border-[#163b96] hover:shadow-lg'
                        : 'bg-slate-100/70 border-dashed border-slate-300 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center space-x-1 ${
                            isActive ? 'bg-[#0c2356] text-[#ffc700]' : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{batch.timeSlot}</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0c2356]">{batch.name}</h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {batch.targetClass} {batch.courseName ? `• ${batch.courseName}` : ''}
                      </p>
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                        {batch.course?.description ||
                          'Comprehensive physics mastery sessions covering theory, derivations, and intensive numerical drills with Arun Sir.'}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-200/60 text-xs text-slate-500 space-y-1">
                        <p>
                          👨‍🏫 Faculty: <span className="font-bold text-slate-800">{batch.facultyName || 'Arun Sir'}</span>
                        </p>
                        <p>
                          🏢 Room: <span className="font-medium text-slate-700">{batch.room || 'Main Lecture Hall'}</span>
                        </p>
                        <p>
                          📅 Days: <span className="font-medium text-slate-700">{daysText}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!isActive) return;
                        setEnquiryForm((prev) => ({
                          ...prev,
                          preferredBatchTime: `${batch.timeSlot} (${batch.name})`,
                          targetClass: batch.targetClass?.includes('11')
                            ? '11th'
                            : batch.targetClass?.includes('10')
                            ? '10th'
                            : batch.targetClass?.includes('9')
                            ? '9th'
                            : batch.targetClass?.includes('NEET')
                            ? 'NEET'
                            : batch.targetClass?.includes('JEE')
                            ? 'JEE Mains'
                            : '12th',
                        }));
                        setEnquiryModalOpen(true);
                      }}
                      disabled={!isActive}
                      className={`mt-6 w-full py-2.5 font-bold text-xs rounded-xl transition ${
                        isActive
                          ? 'bg-white border border-[#0c2356] hover:bg-[#0c2356] hover:text-white text-[#0c2356]'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isActive ? `Join ${batch.name}` : 'Batch Currently Closed'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Courses Offered Section - Synced with Database */}
      <section id="courses" className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-[#163b96] bg-sky-100 px-3 py-1 rounded-full">
              TARGET PROGRAMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0c2356]">
              Courses Tailored to Every Goal
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              From Class 9th fundamentals to cracking JEE Mains and NEET Physics with 99+ percentile.
            </p>
          </div>

          {loadingData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                  <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-20 bg-slate-200 rounded w-full"></div>
                  <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#1967d2] flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Academic Programs Under Revision</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                New session courses and syllabus modules are being published. Contact us or enquire below for program schedules and fee structures.
              </p>
              <button
                onClick={() => {
                  setEnquiryForm((prev) => ({
                    ...prev,
                    message: 'Enquiring for upcoming course details and admissions',
                  }));
                  setEnquiryModalOpen(true);
                }}
                className="mt-2 px-6 py-2.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs rounded-xl shadow transition"
              >
                Enquire for Courses & Syllabus
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const formattedFee = course.totalFee
                  ? `₹${course.totalFee.toLocaleString('en-IN')}${course.duration ? ` / ${course.duration}` : ''}`
                  : 'Fee on Enquiry';

                const featuresList =
                  course.features && course.features.length > 0
                    ? course.features
                    : [
                        'Full NCERT & Advanced Theory',
                        'Daily Practice Problem (DPP) Handouts',
                        'Direct 1-on-1 Arun Sir Doubt Clearing',
                        'Weekly Numerical Drill Tests',
                      ];

                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider bg-sky-100 text-[#0c2356] px-2.5 py-0.5 rounded-full">
                          {course.targetClass || 'Target Course'}
                        </span>
                        <span className="text-sm font-extrabold text-emerald-700">
                          {formattedFee}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{course.name}</h3>
                      {course.description && (
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      )}
                      <ul className="space-y-2 text-xs text-slate-600">
                        {featuresList.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setEnquiryForm((prev) => ({
                          ...prev,
                          targetClass: ['9th', '10th', '11th', '12th', 'JEE Mains', 'NEET', 'Dropper'].includes(course.targetClass)
                            ? course.targetClass
                            : '12th',
                          message: `Enquiring for ${course.name}`,
                        }));
                        setEnquiryModalOpen(true);
                      }}
                      className="w-full py-2.5 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs rounded-xl transition"
                    >
                      Enroll Now
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Physics Mirror Methodology Section */}
      <section id="methodology" className="py-20 bg-[#0c2356] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#ffc700] uppercase tracking-wider">
              OUR TEACHING METHODOLOGY
            </span>
            <h2 className="text-3xl font-black">The Proven Arun Sir Learning System</h2>
            <p className="text-sky-200 text-sm">
              Structured classroom pedagogy designed to transform complex derivations into natural intuition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Root Concept Visualization',
                desc: 'Every chapter starts with fundamental physical phenomena before formulas, eliminating rote memorization.',
                tag: 'Foundation',
              },
              {
                icon: CheckCircle2,
                title: 'Graded Numerical Drills',
                desc: 'Step-by-step problem sets categorized from Board level to JEE Advanced & NEET tricky scenarios.',
                tag: 'Problem Solving',
              },
              {
                icon: Award,
                title: 'Personal Doubt Desk',
                desc: 'Arun Sir conducts daily 1-on-1 doubt sessions after every batch so no conceptual confusion remains.',
                tag: 'Individual Care',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-sky-950/60 rounded-2xl p-6 border border-sky-800/60 shadow-lg space-y-4 hover:border-[#ffc700]/50 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ffc700]/10 border border-[#ffc700]/30 text-[#ffc700] flex items-center justify-center">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#ffc700] uppercase tracking-wider">
                    {feature.tag}
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-sky-200 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section - Sole Master Faculty (Arun Sir) */}
      <section id="faculty" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-[#163b96] uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
              MEET YOUR MENTOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0c2356]">
              Mentored Exclusively by Arun Sir
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              At Physics Mirror, every single lecture, doubt desk, and batch is taken personally by Arun Sir — 100% direct mentorship with zero junior lecturers.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Arun Sir Profile Card */}
            <div className="lg:col-span-5 flex flex-col items-center text-center p-6 bg-gradient-to-br from-[#0c2356] to-[#163b96] text-white rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc700]/10 rounded-full blur-2xl"></div>

              <div className="relative w-28 h-28 rounded-full bg-white p-1 shadow-2xl mb-4 border-2 border-[#ffc700] overflow-hidden">
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

              <span className="px-3 py-1 bg-[#ffc700] text-[#0c2356] text-xs font-extrabold rounded-full uppercase tracking-wider mb-2">
                Solo Master Mentor
              </span>
              <h3 className="text-2xl font-black text-white">Arun Sir</h3>
              <p className="text-xs text-sky-200 font-semibold mt-1">Founder, Director & Physics Faculty</p>
              <p className="text-xs text-slate-300 mt-2 font-mono">M.Sc. Physics (Gold Medalist)</p>

              <div className="w-full mt-6 pt-4 border-t border-sky-400/20 grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/10 rounded-xl p-2.5">
                  <p className="text-lg font-black text-[#ffc700]">10+ Yrs</p>
                  <p className="text-[10px] text-sky-200">Teaching Experience</p>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5">
                  <p className="text-lg font-black text-[#ffc700]">2500+</p>
                  <p className="text-[10px] text-sky-200">Students Guided</p>
                </div>
              </div>
            </div>

            {/* Arun Sir Teaching Edge Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#163b96] uppercase tracking-wider">
                  WHY DIRECT TEACHING MATTERS
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-[#0c2356]">
                  No Outsourced Teaching. Pure Physics Mastery.
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Unlike corporate institutes where famous teachers appear only on billboards while inexperienced assistants take classes, <strong>Arun Sir teaches all batches personally</strong> from first concept to final revision.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Every Batch Taught Personally</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    5 AM morning batch to 8 PM night series — every lecture delivered directly by Arun Sir.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Daily 1-on-1 Doubt Desk</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Face-to-face personal clearing of complex numericals, derivations, and DPP questions every day.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Hand-Crafted DPP Sets</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Curated practice problem sets graded from Board to JEE Advanced & NEET top percentile levels.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#0c2356] font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Consistent Mentorship</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Your progress, tests, and attendance are tracked directly by Arun Sir for guaranteed growth.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setEnquiryModalOpen(true)}
                  className="px-6 py-3 bg-[#0c2356] hover:bg-[#163b96] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-2"
                >
                  <span>Talk with Arun Sir for Admission</span>
                  <ArrowRight className="w-4 h-4 text-[#ffc700]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Our Institute Section (Exact Address & Directions Requested by User) */}
      <section id="visit" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#163b96] uppercase tracking-widest bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1 rounded-full">
              OFFLINE CAMPUS & DIRECT ADMISSION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0c2356]">
              Visit Our Institute
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Step into our classroom for admissions, offline batch counseling, and personal study guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Address Card */}
            <div className="lg:col-span-7 bg-[#0c2356] text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffc700]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-[#ffc700]">
                  <Building className="w-3.5 h-3.5" />
                  <span>HEADQUARTERS & CLASSROOMS</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                    PHYSICS <span className="text-[#ffc700]">MIRROR</span>
                  </h3>
                  <p className="text-sm font-semibold text-sky-200 mt-1">
                    Pipradi, Jhajha, District – Jamui, Bihar, India.
                  </p>
                </div>

                <div className="pt-3 border-t border-sky-400/20 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Navigation className="w-5 h-5 text-[#ffc700] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Location & Directions
                      </h4>
                      <p className="text-xs text-sky-100 leading-relaxed mt-1">
                        Located approximately <strong>100 metres west of Sadar Hospital, Jhajha</strong>, and approximately <strong>20 metres east of the residence of Former MLA Dr. Ravindra Yadav</strong>, along the same road.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <Compass className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Find Us Easily
                      </h4>
                      <p className="text-xs text-sky-100 font-semibold mt-1">
                        Pipradi, Jhajha, Jamui, Bihar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-sky-400/20 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 relative z-10">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Pipradi,+Jhajha,+Jamui,+Bihar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#ffc700] hover:bg-[#eeb900] text-[#0c2356] font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="tel:+919876543210"
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition flex items-center justify-center space-x-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#ffc700]" />
                  <span>Call Us: +91 98765 43210</span>
                </a>
              </div>
            </div>

            {/* Quick Visit Details Card */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-base font-bold text-[#0c2356] flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#163b96]" />
                  <span>Visiting & Counseling Hours</span>
                </h4>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-800">Monday – Saturday</span>
                    <span className="font-bold text-[#0c2356]">06:00 AM – 08:30 PM</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-800">Sunday</span>
                    <span className="font-bold text-amber-700">08:00 AM – 01:00 PM</span>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Key Landmarks Nearby
                  </h5>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#163b96]"></span>
                      <span><strong>Sadar Hospital, Jhajha</strong> (100 metres east of institute)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#163b96]"></span>
                      <span><strong>Residence of Former MLA Dr. Ravindra Yadav</strong> (20m west)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#163b96]"></span>
                      <span>Located along main connecting road in Pipradi, Jhajha</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="w-full py-3 bg-[#0c2356] hover:bg-[#163b96] text-white font-bold text-xs rounded-xl shadow transition text-center"
              >
                Schedule an In-Person Campus Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#07173b] text-white pt-16 pb-12 border-t border-sky-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-sky-900/60 text-xs">

            {/* Col 1 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white p-1 overflow-hidden flex items-center justify-center shadow-md">
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
                  <div className="text-base font-black">
                    PHYSICS <span className="text-[#ffc700]">MIRROR</span>
                  </div>
                  <p className="text-[10px] text-sky-200">PREMIER PHYSICS COACHING</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Premier Physics coaching institute for Classes 9th, 10th, 11th, 12th, JEE Mains & NEET. Turning complex equations into clear concepts.
              </p>
            </div>

            {/* Col 2 */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Active Batches</h4>
              <ul className="space-y-1.5 text-slate-300">
                {batches && batches.length > 0 ? (
                  batches.slice(0, 6).map((b) => (
                    <li key={b._id}>
                      {b.timeSlot} — {b.name}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400">Timetable available on enquiry</li>
                )}
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Portal Access</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login?role=student" className="text-[#ffc700] hover:underline flex items-center space-x-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student Portal Login</span>
                  </Link>
                </li>
                <li>
                  <Link to="/login?role=faculty" className="text-sky-300 hover:underline flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Faculty Portal Login</span>
                  </Link>
                </li>
                <li>
                  <Link to="/login?role=admin" className="text-slate-300 hover:underline flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Desk (Institute Management)</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4 - Visit Our Institute Address */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Visit Our Institute</h4>
              <div className="space-y-2 text-slate-300">
                <p className="font-bold text-white tracking-wide">PHYSICS MIRROR</p>
                <p className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-[#ffc700] mt-0.5 flex-shrink-0" />
                  <span className="leading-snug">Pipradi, Jhajha,<br />District – Jamui, Bihar, India.</span>
                </p>
                <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                  ~100m West of Sadar Hospital, Jhajha & ~20m East of Former MLA Dr. Ravindra Yadav's residence.
                </p>
                <p className="text-xs text-[#ffc700] pl-6 font-semibold">
                  Find Us Easily – Pipradi, Jhajha, Jamui, Bihar.
                </p>
                <p className="flex items-center space-x-2 pt-1">
                  <Phone className="w-3.5 h-3.5 text-[#ffc700]" />
                  <span>+91 98765 43210</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-[#ffc700]" />
                  <span>contact@physicsmirror.com</span>
                </p>
              </div>
            </div>

          </div>

          <div className="pt-6 text-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Physics Mirror. Pipradi, Jhajha, Jamui, Bihar. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Admission Enquiry Modal */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0c2356]">Admission Enquiry</h3>
                <p className="text-xs text-slate-500">Pipradi, Jhajha, Jamui, Bihar • Mentored by Arun Sir</p>
              </div>
              <button onClick={() => setEnquiryModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            {enquirySubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Enquiry Submitted!</h4>
                <p className="text-xs text-slate-500">Arun Sir and our admissions counselor will call you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student / Parent Name *</label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#0c2356]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={enquiryForm.mobile}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-[#0c2356]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Class / Goal</label>
                    <select
                      value={enquiryForm.targetClass}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, targetClass: e.target.value })}
                      className="w-full px-2 py-2 border rounded-xl outline-none"
                    >
                      <option value="9th">Class 9th</option>
                      <option value="10th">Class 10th</option>
                      <option value="11th">Class 11th</option>
                      <option value="12th">Class 12th</option>
                      <option value="JEE Mains">JEE Mains</option>
                      <option value="NEET">NEET</option>
                      <option value="Dropper">Dropper</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Preferred Time / Batch</label>
                    <select
                      value={enquiryForm.preferredBatchTime}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, preferredBatchTime: e.target.value })}
                      className="w-full px-2 py-2 border rounded-xl outline-none"
                    >
                      <option value="Any / Flexible Timing">Any / Flexible Timing</option>
                      {batches && batches.length > 0 ? (
                        batches.map((b) => (
                          <option key={b._id} value={`${b.timeSlot} (${b.name})`}>
                            {b.timeSlot} — {b.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Morning Batch">Morning Batch</option>
                          <option value="Evening Batch">Evening Batch</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Any specific requirement</label>
                  <textarea
                    rows={2}
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    placeholder="e.g. Weak in Mechanics, need personal guidance"
                    className="w-full px-3 py-2 border rounded-xl outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#ffc700] hover:bg-[#eeb900] text-[#0c2356] font-extrabold rounded-xl shadow transition"
                  >
                    Submit Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;

