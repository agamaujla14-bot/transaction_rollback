import mongoose from 'mongoose';

/**
 * Establish a connection to MongoDB using environment variable MONGODB_URI.
 * Throws if URI is not set or connection fails.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI must be defined in environment');
  }

  // support connection options as needed
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
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
