const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Batch = require('../models/Batch');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const Notice = require('../models/Notice');
const Enquiry = require('../models/Enquiry');
const DPP = require('../models/DPP');
const { connectDB, closeDB } = require('../config/db');

const seedAll = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Batch.deleteMany({});
    await Course.deleteMany({});
    await Payment.deleteMany({});
    await Attendance.deleteMany({});
    await Notice.deleteMany({});
    await Enquiry.deleteMany({});
    await DPP.deleteMany({});

    console.log('🌱 Seeding Courses...');
    const courses = await Course.insertMany([
      {
        name: 'Class 12th Physics Mastery (Board + JEE Mains)',
        code: 'PHY-12-JEE',
        targetClass: '12th',
        totalFee: 24000,
        duration: '1 Year',
        description: 'Comprehensive electrodynamics, ray & wave optics, modern physics with Arun Sir.',
        status: 'Active',
      },
      {
        name: 'Class 11th Physics Foundation + NEET',
        code: 'PHY-11-NEET',
        targetClass: '11th',
        totalFee: 22000,
        duration: '1 Year',
        description: 'Kinematics, Newton laws, rotational motion, thermodynamics, waves and oscillations.',
        status: 'Active',
      },
      {
        name: 'Class 10th Physics Board Excellence',
        code: 'PHY-10-BOARD',
        targetClass: '10th',
        totalFee: 15000,
        duration: '10 Months',
        description: 'Light, human eye, electricity, magnetic effects with board focus.',
        status: 'Active',
      },
      {
        name: 'Class 9th Physics Fundamentals',
        code: 'PHY-09-FUND',
        targetClass: '9th',
        totalFee: 12000,
        duration: '10 Months',
        description: 'Motion, force, gravitation, work & energy, sound concepts.',
        status: 'Active',
      },
      {
        name: 'Dropper / Repeater Brahmastra Target',
        code: 'PHY-DROP-ADV',
        targetClass: 'Dropper',
        totalFee: 28000,
        duration: '1 Year',
        description: 'Intense problem solving, multi-concept questions for JEE Advanced & NEET top percentiles.',
        status: 'Active',
      },
      {
        name: 'Class 12th Board Booster Fast-Track',
        code: 'PHY-12-BOOST',
        targetClass: '12th',
        totalFee: 10000,
        duration: '4 Months',
        description: 'High-yield derivations, numericals and previous year solved questions.',
        status: 'Active',
      },
    ]);

    console.log('🌱 Seeding Users (Admin & Faculty)...');
    const adminUser = await User.create({
      name: 'Arun Sir (Admin & Director)',
      email: 'admin@physicsmirror.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
    });

    const facultyUser1 = await User.create({
      name: 'Arun Sir',
      email: 'arunsir@physicsmirror.com',
      password: 'faculty123',
      role: 'faculty',
      facultyId: 'FAC-ARUN-01',
      phone: '9876543210',
    });

    const facultyUser2 = await User.create({
      name: 'Er. R. K. Sharma',
      email: 'rksharma@physicsmirror.com',
      password: 'faculty123',
      role: 'faculty',
      facultyId: 'FAC-RKS-02',
      phone: '9876543211',
    });

    const facultyUser3 = await User.create({
      name: 'Dr. Priya Verma',
      email: 'priya.verma@physicsmirror.com',
      password: 'faculty123',
      role: 'faculty',
      facultyId: 'FAC-PRV-03',
      phone: '9876543212',
    });

    console.log('🌱 Seeding Faculty Profiles...');
    const faculty1 = await Faculty.create({
      user: facultyUser1._id,
      facultyId: 'FAC-ARUN-01',
      name: 'Arun Sir',
      email: 'arunsir@physicsmirror.com',
      phone: '9876543210',
      designation: 'Founder & Lead Physics Faculty',
      qualification: 'M.Sc. Physics (Gold Medalist), 10+ Years Experience',
      specialization: 'Electrodynamics, Optics & Modern Physics',
      experience: '10+ Years',
      status: 'Active',
    });

    const faculty2 = await Faculty.create({
      user: facultyUser2._id,
      facultyId: 'FAC-RKS-02',
      name: 'Er. R. K. Sharma',
      email: 'rksharma@physicsmirror.com',
      phone: '9876543211',
      designation: 'Senior Faculty (JEE Advanced)',
      qualification: 'B.Tech IIT Roorkee, Ex-Kota Faculty',
      specialization: 'Mechanics & Thermodynamics',
      experience: '8+ Years',
      status: 'Active',
    });

    const faculty3 = await Faculty.create({
      user: facultyUser3._id,
      facultyId: 'FAC-PRV-03',
      name: 'Dr. Priya Verma',
      email: 'priya.verma@physicsmirror.com',
      phone: '9876543212',
      designation: 'Senior Faculty (NEET Specialist)',
      qualification: 'Ph.D. Applied Physics',
      specialization: 'Waves, Oscillations & Electrostatics',
      experience: '7+ Years',
      status: 'Active',
    });

    console.log('🌱 Seeding 6 Batches (Time & Name as requested)...');
    // Prompt: "Batches according to time (e.g. 5am to 7 am, 8am to 10 am (total 6 batches) ) and Name (e.g. 5am to 7am Pratigya batch). Also show Active inactive of batches."
    const batches = await Batch.insertMany([
      {
        name: 'Pratigya Batch',
        code: 'PM-B01',
        timeSlot: '05:00 AM - 07:00 AM',
        targetClass: 'Class 12th + JEE Mains',
        course: courses[0]._id,
        courseName: courses[0].name,
        faculty: faculty1._id,
        facultyName: 'Arun Sir',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        room: 'Hall A - Einstein Wing',
        capacity: 45,
        enrolledCount: 18,
        status: 'Active',
        syllabusProgress: 68,
        description: 'Early morning dedicated batch for high-focus JEE aspirants.',
      },
      {
        name: 'Arjun Batch',
        code: 'PM-B02',
        timeSlot: '08:00 AM - 10:00 AM',
        targetClass: 'Class 11th + NEET',
        course: courses[1]._id,
        courseName: courses[1].name,
        faculty: faculty3._id,
        facultyName: 'Dr. Priya Verma',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        room: 'Hall B - Newton Hall',
        capacity: 40,
        enrolledCount: 16,
        status: 'Active',
        syllabusProgress: 52,
        description: 'Comprehensive foundational NEET preparation batch.',
      },
      {
        name: 'Sankalp Batch',
        code: 'PM-B03',
        timeSlot: '10:30 AM - 12:30 PM',
        targetClass: 'Class 10th Foundation',
        course: courses[2]._id,
        courseName: courses[2].name,
        faculty: faculty2._id,
        facultyName: 'Er. R. K. Sharma',
        days: ['Mon', 'Wed', 'Fri'],
        room: 'Hall C - Feynman Lab',
        capacity: 35,
        enrolledCount: 12,
        status: 'Active',
        syllabusProgress: 75,
        description: 'Board syllabus mastering with Olympiad & NTSE bridge.',
      },
      {
        name: 'Lakshya Batch',
        code: 'PM-B04',
        timeSlot: '03:00 PM - 05:00 PM',
        targetClass: 'Class 9th Foundation',
        course: courses[3]._id,
        courseName: courses[3].name,
        faculty: faculty1._id,
        facultyName: 'Arun Sir',
        days: ['Tue', 'Thu', 'Sat'],
        room: 'Hall A - Einstein Wing',
        capacity: 35,
        enrolledCount: 10,
        status: 'Active',
        syllabusProgress: 60,
        description: 'Concept building from root principles and practical demonstrations.',
      },
      {
        name: 'Vijeta Batch',
        code: 'PM-B05',
        timeSlot: '05:30 PM - 07:30 PM',
        targetClass: 'Class 12th Board Booster',
        course: courses[5]._id,
        courseName: courses[5].name,
        faculty: faculty2._id,
        facultyName: 'Er. R. K. Sharma',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        room: 'Hall B - Newton Hall',
        capacity: 40,
        enrolledCount: 14,
        status: 'Active',
        syllabusProgress: 82,
        description: 'Target 95%+ in 12th CBSE/State Board Physics exam.',
      },
      {
        name: 'Brahmastra Batch',
        code: 'PM-B06',
        timeSlot: '08:00 PM - 10:00 PM',
        targetClass: 'Dropper Target JEE & NEET',
        course: courses[4]._id,
        courseName: courses[4].name,
        faculty: faculty1._id,
        facultyName: 'Arun Sir',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        room: 'Hall A - Einstein Wing',
        capacity: 50,
        enrolledCount: 0,
        status: 'Inactive', // Intentionally Inactive to showcase Active / Inactive switch!
        syllabusProgress: 0,
        description: 'Night master-class series for repeater aspirants (Admission opens next cycle).',
      },
    ]);

    // Link assigned batches to faculty
    await Faculty.findByIdAndUpdate(faculty1._id, {
      assignedBatches: [batches[0]._id, batches[3]._id, batches[5]._id],
    });
    await Faculty.findByIdAndUpdate(faculty2._id, {
      assignedBatches: [batches[2]._id, batches[4]._id],
    });
    await Faculty.findByIdAndUpdate(faculty3._id, {
      assignedBatches: [batches[1]._id],
    });

    console.log('🌱 Seeding Students (Including Sneha Joshi from WhatsApp pic & Student 1-10)...');

    // 1. Sneha Joshi (Exact match with WhatsApp Image 2026-11-08 at 9.13.23 AM (1).jpeg)
    // ID: PM26009, Roll: 11-02, Class: 11, Fee Paid: 15,000, Pending Fee: 5,000, Attendance: 94%, Test Average: 82%
    const snehaUser = await User.create({
      name: 'Sneha Joshi',
      email: 'sneha.joshi@physicsmirror.com',
      password: 'student123',
      role: 'student',
      studentId: 'PM26009',
      phone: '9876543209',
    });

    const snehaStudent = await Student.create({
      studentId: 'PM26009',
      user: snehaUser._id,
      name: 'Sneha Joshi',
      dob: '2008-04-14',
      gender: 'Female',
      mobile: '9876543209',
      email: 'sneha.joshi@physicsmirror.com',
      guardianName: 'Ramesh Joshi',
      guardianMobile: '9876543200',
      address: 'Plot 42, Green Park Avenue, Near City Center',
      rollNo: '11-02',
      targetClass: '11th',
      enrolledCourses: [
        {
          course: courses[1]._id,
          courseName: 'Class 11th Physics Foundation + NEET',
          batch: batches[1]._id,
          batchName: '08:00 AM - 10:00 AM Arjun Batch',
          admissionDate: new Date('2026-08-01'),
          feeAgreed: 20000,
        },
      ],
      totalFee: 20000,
      feePaid: 15000,
      pendingFee: 5000,
      admissionDate: new Date('2026-08-01'),
      status: 'Active',
      attendanceRate: 94,
      testAverage: 82,
    });

    // 2. Student 10 (Matches Dashboard.png and Student_admin.png: STU2026090010)
    const stu10User = await User.create({
      name: 'Student 10 (Rahul Verma)',
      email: 'student10@physicsmirror.com',
      password: 'student123',
      role: 'student',
      studentId: 'STU2026090010',
      phone: '87654321010',
    });

    const stu10 = await Student.create({
      studentId: 'STU2026090010',
      user: stu10User._id,
      name: 'Student 10 (Rahul Verma)',
      dob: '2007-06-20',
      gender: 'Male',
      mobile: '87654321010',
      email: 'student10@physicsmirror.com',
      guardianName: 'Sanjay Verma',
      guardianMobile: '9812345670',
      address: 'Civil Lines, Block B',
      rollNo: '12-10',
      targetClass: '12th',
      enrolledCourses: [
        {
          course: courses[0]._id,
          courseName: 'Class 12th Physics Mastery',
          batch: batches[0]._id,
          batchName: '05:00 AM - 07:00 AM Pratigya Batch',
          admissionDate: new Date('2026-09-12'),
          feeAgreed: 24000,
        },
      ],
      totalFee: 24000,
      feePaid: 5050,
      pendingFee: 18950,
      admissionDate: new Date('2026-09-12'),
      status: 'Active',
      attendanceRate: 90,
      testAverage: 78,
    });

    // Additional sample students
    const sampleNames = [
      { name: 'Aarav Sharma', id: 'PM26001', roll: '12-01', phone: '8765432101', class: '12th', fee: 24000, paid: 24000, batchIdx: 0 },
      { name: 'Diya Patel', id: 'PM26002', roll: '11-03', phone: '8765432102', class: '11th', fee: 22000, paid: 12000, batchIdx: 1 },
      { name: 'Rohan Mehra', id: 'PM26003', roll: '10-01', phone: '8765432103', class: '10th', fee: 15000, paid: 15000, batchIdx: 2 },
      { name: 'Ananya Roy', id: 'PM26004', roll: '09-02', phone: '8765432104', class: '9th', fee: 12000, paid: 8000, batchIdx: 3 },
      { name: 'Kabir Singh', id: 'PM26005', roll: '12-04', phone: '8765432105', class: '12th', fee: 24000, paid: 16000, batchIdx: 4 },
      { name: 'Tanvi Kapoor', id: 'PM26006', roll: '11-05', phone: '8765432106', class: '11th', fee: 22000, paid: 10000, batchIdx: 1 },
      { name: 'Aditya Gupta', id: 'PM26007', roll: '12-07', phone: '8765432107', class: '12th', fee: 24000, paid: 14000, batchIdx: 0 },
      { name: 'Kavya Nair', id: 'PM26008', roll: '10-04', phone: '8765432108', class: '10th', fee: 15000, paid: 15000, batchIdx: 2 },
    ];

    const studentEntities = [snehaStudent, stu10];

    for (const item of sampleNames) {
      const u = await User.create({
        name: item.name,
        email: `${item.id.toLowerCase()}@physicsmirror.com`,
        password: 'student123',
        role: 'student',
        studentId: item.id,
        phone: item.phone,
      });

      const s = await Student.create({
        studentId: item.id,
        user: u._id,
        name: item.name,
        dob: '2008-01-15',
        gender: 'Male',
        mobile: item.phone,
        email: `${item.id.toLowerCase()}@physicsmirror.com`,
        guardianName: 'Parent of ' + item.name,
        guardianMobile: '9988776655',
        address: 'Sector 14, Main Road',
        rollNo: item.roll,
        targetClass: item.class,
        enrolledCourses: [
          {
            course: courses[item.batchIdx]._id,
            courseName: courses[item.batchIdx].name,
            batch: batches[item.batchIdx]._id,
            batchName: `${batches[item.batchIdx].timeSlot} ${batches[item.batchIdx].name}`,
            admissionDate: new Date('2026-09-12'),
            feeAgreed: item.fee,
          },
        ],
        totalFee: item.fee,
        feePaid: item.paid,
        pendingFee: Math.max(0, item.fee - item.paid),
        admissionDate: new Date('2026-09-12'),
        status: 'Active',
        attendanceRate: Math.floor(88 + Math.random() * 10),
        testAverage: Math.floor(75 + Math.random() * 20),
      });

      studentEntities.push(s);
    }

    console.log('🌱 Seeding Payments (Including REC-20260912-2177 ₹5,050)...');
    // From Dashboard.png:
    // RECEIPT #: REC-20260912-2177, STUDENT: Student 1, AMOUNT: ₹5,050.00, DATE: 12 Sep 2026
    await Payment.create({
      receiptNo: 'REC-20260912-2177',
      student: stu10._id,
      studentId: stu10.studentId,
      studentName: 'Student 10 (Rahul Verma)',
      courseName: 'Class 12th Physics Mastery',
      batchName: '05:00 AM - 07:00 AM Pratigya Batch',
      amount: 5050,
      paymentDate: new Date('2026-09-12'),
      paymentMode: 'UPI / QR',
      transactionId: 'UPI-984719284',
      remarks: 'First installment payment',
      balanceDueAfter: 18950,
      collectedBy: 'Arun Sir',
    });

    // Sneha Joshi installment
    await Payment.create({
      receiptNo: 'REC-20260801-1045',
      student: snehaStudent._id,
      studentId: snehaStudent.studentId,
      studentName: snehaStudent.name,
      courseName: 'Class 11th Physics Foundation + NEET',
      batchName: '08:00 AM - 10:00 AM Arjun Batch',
      amount: 15000,
      paymentDate: new Date('2026-08-01'),
      paymentMode: 'UPI / QR',
      transactionId: 'UPI-472918374',
      remarks: 'NEET Foundation Term 1 Fee',
      balanceDueAfter: 5000,
      collectedBy: 'Admin Desk',
    });

    // Additional payments
    await Payment.create({
      receiptNo: 'REC-20260915-3312',
      student: studentEntities[2]._id,
      studentId: studentEntities[2].studentId,
      studentName: studentEntities[2].name,
      courseName: 'Class 12th Physics Mastery',
      batchName: '05:00 AM - 07:00 AM Pratigya Batch',
      amount: 24000,
      paymentDate: new Date('2026-09-15'),
      paymentMode: 'Debit/Credit Card',
      remarks: 'Full Annual Fee Paid in Single Payment',
      balanceDueAfter: 0,
      collectedBy: 'Arun Sir',
    });

    console.log('🌱 Seeding Attendance System records...');
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);

    // Seed attendance for Pratigya Batch (5:00 AM - 7:00 AM)
    const pratigyaStudents = studentEntities.filter((s) =>
      s.enrolledCourses.some((c) => c.batch && c.batch.toString() === batches[0]._id.toString())
    );

    if (pratigyaStudents.length > 0) {
      await Attendance.create({
        batch: batches[0]._id,
        batchName: `${batches[0].timeSlot} ${batches[0].name}`,
        date: yesterdayStr,
        markedBy: faculty1.user,
        markedByName: 'Arun Sir',
        records: pratigyaStudents.map((s, idx) => ({
          student: s._id,
          studentId: s.studentId,
          studentName: s.name,
          rollNo: s.rollNo,
          status: idx === 1 ? 'Absent' : 'Present',
          remarks: idx === 1 ? 'Medical leave' : 'On time',
        })),
        totalStudents: pratigyaStudents.length,
        presentCount: pratigyaStudents.length - 1,
        absentCount: 1,
        lateCount: 0,
      });
    }

    // Seed attendance for Arjun Batch (8:00 AM - 10:00 AM)
    const arjunStudents = studentEntities.filter((s) =>
      s.enrolledCourses.some((c) => c.batch && c.batch.toString() === batches[1]._id.toString())
    );

    if (arjunStudents.length > 0) {
      await Attendance.create({
        batch: batches[1]._id,
        batchName: `${batches[1].timeSlot} ${batches[1].name}`,
        date: yesterdayStr,
        markedBy: faculty3.user,
        markedByName: 'Dr. Priya Verma',
        records: arjunStudents.map((s) => ({
          student: s._id,
          studentId: s.studentId,
          studentName: s.name,
          rollNo: s.rollNo,
          status: 'Present',
          remarks: 'Good participation',
        })),
        totalStudents: arjunStudents.length,
        presentCount: arjunStudents.length,
        absentCount: 0,
        lateCount: 0,
      });
    }

    console.log('🌱 Seeding Notices...');
    await Notice.insertMany([
      {
        title: 'Weekly Mega Physics Mock Test - Optics & Mechanics',
        content:
          'All students of Class 11th, 12th and Dropper batches are notified that the All-India pattern Physics Mock Test will be held this Sunday at 10:00 AM in Hall A and online.',
        targetAudience: 'all',
        priority: 'High',
        postedBy: 'Arun Sir (Director)',
      },
      {
        title: 'Pratigya Batch Extra Class on Electromagnetic Induction',
        content:
          'Special problem-solving session on Lenz Law and Mutual Inductance tomorrow at 5:00 AM sharp. Please bring HC Verma Volume 2.',
        targetAudience: 'student',
        batchName: '05:00 AM - 07:00 AM Pratigya Batch',
        priority: 'Normal',
        postedBy: 'Arun Sir',
      },
      {
        title: 'Faculty Curriculum Review Meeting',
        content:
          'All faculty members are requested to join the monthly syllabus tracking and student progress meeting on Friday at 2:00 PM.',
        targetAudience: 'faculty',
        priority: 'Normal',
        postedBy: 'Arun Sir (Director)',
      },
    ]);

    console.log('🌱 Seeding Enquiries...');
    await Enquiry.insertMany([
      {
        name: 'Vikas Sharma (Parent)',
        mobile: '9812345678',
        email: 'vikas.sharma@gmail.com',
        targetClass: '12th',
        preferredBatchTime: '05:00 AM - 07:00 AM',
        message: 'Interested in JEE Mains + Board preparation under Arun Sir.',
        status: 'New',
      },
      {
        name: 'Pooja Reddy',
        mobile: '9712345678',
        email: 'pooja.reddy@yahoo.com',
        targetClass: 'NEET',
        preferredBatchTime: '08:00 AM - 10:00 AM',
        message: 'Want to enroll in NEET Physics foundation batch.',
        status: 'Contacted',
      },
    ]);

    console.log('🌱 Seeding Daily Practice Problem (DPP) Sheets...');
    const dummyPdfData = 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDM0L0ZpbHRlci9GbGF0ZURlY29kZT4+c3RyZWFtCnicS0wuyczPU8gvKslMLslIzFFwTCwuSExOzVFIz03MzUkvys8DAPu2DDgKZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMyAwIFIvQ29udGVudHMgMiAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERi9UZXh0XT4+Pj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9QYWdlcy9LaWRzWzEgMCBSXS9Db3VudCAxPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDMgMCBSPj4KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDE2NCAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAyNzEgMDAwMDAgbiAKMDAwMDAwMDMyMiAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNS9Sb290IDQgMCBSPj4Kc3RhcnR4cmVmCjM3MQolJUVPRgo=';

    await DPP.insertMany([
      {
        title: 'Ray Optics: Laws of Refraction, Snell’s Law & Total Internal Reflection (DPP-01)',
        code: 'DPP-OPT-01',
        batch: batches[0]._id,
        batchName: '05:00 AM - 07:00 AM Pratigya Batch',
        targetClass: '12th',
        subject: 'Physics',
        unit: 'Ray Optics & Optical Instruments',
        totalQuestions: 25,
        difficulty: 'JEE Mains / NEET',
        description: 'Complete 25 numerical set covering Snell’s law, critical angle calculations, and glass slab lateral displacement.',
        dueDate: '2026-11-15',
        fileName: 'Ray_Optics_DPP_01_SnellsLaw.pdf',
        fileSize: '3.1 MB',
        fileData: dummyPdfData,
        uploadedBy: facultyUser1._id,
        facultyName: 'Arun Sir',
        downloadCount: 18,
      },
      {
        title: 'Kinematics 2D: Projectile Motion on Horizontal & Incline Plane (DPP-02)',
        code: 'DPP-KIN-02',
        batch: batches[1]._id,
        batchName: '08:00 AM - 10:00 AM Arjun Batch',
        targetClass: '11th',
        subject: 'Physics',
        unit: 'Kinematics & Motion',
        totalQuestions: 30,
        difficulty: 'JEE Mains / NEET',
        description: '30 high-yield questions on maximum height, range, equation of trajectory, and relative velocity in 2D.',
        dueDate: '2026-11-16',
        fileName: 'Kinematics_Projectile_Motion_DPP_02.pdf',
        fileSize: '2.8 MB',
        fileData: dummyPdfData,
        uploadedBy: facultyUser3._id,
        facultyName: 'Dr. Priya Verma',
        downloadCount: 14,
      },
      {
        title: 'Electricity: Ohm’s Law, Equivalent Resistance & Kirchhoff’s Rules (DPP-03)',
        code: 'DPP-ELE-03',
        batch: batches[2]._id,
        batchName: '10:30 AM - 12:30 PM Sankalp Batch',
        targetClass: '10th',
        subject: 'Physics',
        unit: 'Current Electricity',
        totalQuestions: 20,
        difficulty: 'Easy',
        description: 'Series and parallel circuit combination numericals with power dissipation calculations for Class 10th board prep.',
        dueDate: '2026-11-18',
        fileName: 'Electricity_Circuits_DPP_03.pdf',
        fileSize: '1.9 MB',
        fileData: dummyPdfData,
        uploadedBy: facultyUser2._id,
        facultyName: 'Er. R. K. Sharma',
        downloadCount: 11,
      },
      {
        title: 'Gravitation & Kepler’s Laws Numerical Drill Sheet (DPP-04)',
        code: 'DPP-GRV-04',
        batch: batches[3]._id,
        batchName: '03:00 PM - 05:00 PM Lakshya Batch',
        targetClass: '9th',
        subject: 'Physics',
        unit: 'Gravitation',
        totalQuestions: 15,
        difficulty: 'Medium',
        description: 'Universal law of gravitation, variation of g with altitude & depth, and weightlessness questions.',
        dueDate: '2026-11-20',
        fileName: 'Gravitation_Fundamentals_DPP_04.pdf',
        fileSize: '2.2 MB',
        fileData: dummyPdfData,
        uploadedBy: facultyUser1._id,
        facultyName: 'Arun Sir',
        downloadCount: 9,
      },
    ]);

    console.log('🎉 Seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('👤 Admin:   admin@physicsmirror.com / admin123');
    console.log('👨‍🏫 Faculty: arunsir@physicsmirror.com / faculty123');
    console.log('            rksharma@physicsmirror.com / faculty123');
    console.log('            priya.verma@physicsmirror.com / faculty123');
    console.log('🎓 Student: PM26009 (Sneha Joshi) / student123');
    console.log('            STU2026090010 (Student 10) / student123');
    console.log('            PM26001 (Aarav Sharma) / student123');
    console.log('----------------------------------------------------');

    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedAll();

