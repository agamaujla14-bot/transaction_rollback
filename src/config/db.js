import mongoose from 'mongoose';

/**
 * Establish a connection to MongoDB using environment variable MONGODB_URI.
 * Throws if URI is not set or connection fails.
 * Works with local MongoDB, MongoDB Atlas, or any MongoDB-compatible URI.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI must be defined in environment');
  }

  // connection options for reliability on cloud platforms (Render, Heroku, etc.)
  const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds for socket timeout
  };

  try {
    await mongoose.connect(uri, mongoOptions);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}

/**
 * Disconnect from MongoDB.
 */
export async function disconnectDB() {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
}

// expose mongoose in case callers need it (for transactions, sessions, etc.)
export { mongoose };
