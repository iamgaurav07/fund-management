import mongoose from 'mongoose';
import logger from './logger';
import { MONGO_URI } from '.'; // Your config file

// Improved connection with retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

export const connectDB: any = async (retryCount = 0) => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    
    logger.info('✅ MongoDB connected successfully');
  } catch (err) {
    logger.error(`❌ MongoDB connection attempt ${retryCount + 1}/${MAX_RETRIES} failed`);
    
    if (retryCount < MAX_RETRIES - 1) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(retryCount + 1);
    }
    
    logger.error('💥 Critical: Could not connect to MongoDB after retries');
    process.exit(1);
  }
};

// Event handlers
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to DB cluster');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected - attempting reconnection...');
  setTimeout(connectDB, RETRY_DELAY_MS);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Mongoose connection closed due to app termination');
  process.exit(0);
});

export default connectDB;