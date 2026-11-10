
const mongoose = require('mongoose');
const dns = require('node:dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if not permitted
}

let connectionPromise = null;

const connectDB = async () => {
  // Reuse existing MongoDB connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Reuse ongoing connection attempt
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not configured');
  }

  connectionPromise = mongoose.connect(uri, {
    dbName: 'physics_mirror',
    serverSelectionTimeoutMS: 15000
  })
    .then((conn) => {
      console.log('MongoDB connected:', conn.connection.host);
      console.log('Database:', conn.connection.name);

      return conn.connection;
    })
    .catch((error) => {
      connectionPromise = null;

      console.error('MongoDB connection failed:', error.message);

      throw error;
    });

  return connectionPromise;
};

const closeDB = async () => {
  await mongoose.connection.close();
  connectionPromise = null;
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.closeDB = closeDB;
