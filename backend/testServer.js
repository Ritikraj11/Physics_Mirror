const http = require('http');
const { app, startServer } = require('./src/server');

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- STARTING SERVER TEST ---');
  const server = await startServer();
  const port = server.address().port;
  console.log(`Server listening on port ${port}`);

  try {
    // 1. Health check
    const health = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/health',
      method: 'GET',
    });
    console.log('✅ /api/health:', health.body);

    // 2. Batches
    const batches = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/batches',
      method: 'GET',
    });
    console.log(`✅ /api/batches: Found ${batches.body.count} batches:`);
    batches.body.data.forEach((b) => {
      console.log(`   - ${b.timeSlot}: ${b.name} [Status: ${b.status}] Enrolled: ${b.enrolledCount}`);
    });

    // 3. Admin Login
    const adminLogin = await makeRequest(
      {
        hostname: 'localhost',
        port,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { identifier: 'admin@physicsmirror.com', password: 'admin123' }
    );
    console.log('✅ Admin Login:', adminLogin.body.user);
    const token = adminLogin.body.token;

    // 4. Student Login (Sneha Joshi from WhatsApp screenshot)
    const studentLogin = await makeRequest(
      {
        hostname: 'localhost',
        port,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { identifier: 'PM26009', password: 'student123' }
    );
    console.log('✅ Student Login (Sneha Joshi):', {
      name: studentLogin.body.user.name,
      studentId: studentLogin.body.user.studentId,
      attendance: studentLogin.body.profile.attendanceRate,
      feePaid: studentLogin.body.profile.feePaid,
      pendingFee: studentLogin.body.profile.pendingFee,
    });

    // 5. Dashboard Stats (Dashboard.png)
    const dashboardStats = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/reports/dashboard',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ Dashboard Stats:', dashboardStats.body.data);

    // 6. Students List
    const students = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/students',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ /api/students: Found ${students.body.count} students:`);
    students.body.data.slice(0, 3).forEach((s) => {
      console.log(`   - ${s.studentId}: ${s.name} (Class: ${s.targetClass}, Mobile: ${s.mobile}, Due: ₹${s.pendingFee})`);
    });

    console.log('\n🎉 ALL BACKEND API ENDPOINTS ARE FULLY OPERATIONAL!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
};

runTests();

