const mongoose = require('mongoose');
const logger   = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize:     10,
      serverSelectionTimeoutMS: 2000, // Faster failure for local check
      socketTimeoutMS: 45000,
    });
    logger.info(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`❌  Local MongoDB connection failed: ${err.message}`);
    
    if (process.env.NODE_ENV === 'development') {
      try {
        logger.info('💾  Starting MongoDB Memory Server as fallback...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        
        await mongoose.connect(uri);
        logger.info('✨  MongoDB Memory Server connected! (Data will be lost on restart)');

        // Auto-seed basic admin for development
        const User = require('../models/User');
        const bcrypt = require('bcryptjs');
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
          await User.create({
            firstName: 'Tarek',
            lastName: 'Baloush',
            email: 'admin@study.com',
            password: 'admin@123',
            role: 'admin',
          });
          logger.info('👤  Default Admin (Tarek Baloush) created in memory.');
        }
      } catch (memErr) {
        logger.error(`❌  Memory Server fallback failed: ${memErr.message}`);
        logger.warn('⚠️  Continuing in LIMITED MODE (Database operations will fail)');
      }
    } else {
      logger.warn('⚠️  Continuing in LIMITED MODE (Database operations will fail)');
    }
  }
};

// Log disconnection events
mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
mongoose.connection.on('reconnected',  () => logger.info('MongoDB reconnected'));

module.exports = connectDB;
