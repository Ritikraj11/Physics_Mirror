const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/User');

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      parsed[key] = value;
    }
  }
  return parsed;
}

function prompt(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ Error: MONGO_URI not found in backend/.env');
    process.exit(1);
  }

  const args = parseArgs();

  let name = args.name || 'Physics Mirror Admin';
  let email = args.email;
  let password = args.password;
  let phone = args.phone || '9876543210';

  // If missing and interactive terminal available
  if (!email && process.stdin.isTTY) {
    email = await prompt('Enter Admin Email: ');
  }
  if (!password && process.stdin.isTTY) {
    password = await prompt('Enter Admin Password (min 6 characters): ');
  }

  if (!email || !password) {
    console.error('❌ Error: Email and password are required.');
    console.log('Usage: node backend/src/scripts/createAdmin.js --email <email> --password <password> [--name <name>] [--phone <phone>]');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('❌ Error: Password must be at least 6 characters long.');
    process.exit(1);
  }

  email = email.toLowerCase().trim();

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to Database.');

    let user = await User.findOne({ email }).select('+password');

    if (user) {
      user.name = name;
      user.password = password;
      user.role = 'admin';
      user.phone = phone;
      user.isActive = true;
      await user.save();
      console.log('\n===========================================');
      console.log('✅ Existing user updated to Super Admin:');
      console.log(`   Name:     ${user.name}`);
      console.log(`   Email:    ${user.email}`);
      console.log(`   Role:     ${user.role}`);
      console.log('===========================================\n');
    } else {
      user = await User.create({
        name,
        email,
        password,
        role: 'admin',
        phone,
        isActive: true,
      });
      console.log('\n===========================================');
      console.log('✅ New Admin user created successfully:');
      console.log(`   Name:     ${user.name}`);
      console.log(`   Email:    ${user.email}`);
      console.log(`   Role:     ${user.role}`);
      console.log('===========================================\n');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create/update admin:', err.message);
    process.exit(1);
  }
}

run();

