
const dotenv = require('dotenv');
const path = require('path');
const dns = require('node:dns');

// Configure DNS before connecting to MongoDB
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

const app = require('./app');
const connectDB = require('./config/db');
const User = require('./models/User');

const PORT = process.env.PORT || 5000;

async function syncAdminCredentials() {
  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail) return;

  try {
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.findOne({ role: 'admin' });
    }

    if (admin) {
      let changed = false;
      if (admin.email !== adminEmail) {
        admin.email = adminEmail;
        changed = true;
      }
      if (adminPassword) {
        admin.password = adminPassword;
        changed = true;
      }
      if (changed) {
        await admin.save();
        console.log(`✅ Admin credentials synchronized with environment: ${admin.email}`);
      }
    } else {
      await User.create({
        name: process.env.ADMIN_NAME || 'Arun Sir (Admin & Director)',
        email: adminEmail,
        password: adminPassword || 'PhysicsMirror123',
        role: 'admin',
        phone: '9876543210',
      });
      console.log(`✅ Created default Admin user from environment: ${adminEmail}`);
    }
  } catch (err) {
    console.error('⚠️ Note: Could not auto-sync admin credentials:', err.message);
  }
}

async function startServer() {
  try {
    await connectDB();
    await syncAdminCredentials();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Physics Mirror API running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
