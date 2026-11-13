
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

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Physics Mirror API running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
