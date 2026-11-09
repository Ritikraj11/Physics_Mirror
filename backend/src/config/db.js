
const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  // Reuse an existing MongoDB connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Reuse an ongoing connection attempt
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not configured');
  }

  connectionPromise = mongoose.connect(uri, {
    dbName: 'physics_mirror',
    serverSelectionTimeoutMS: 10000
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
