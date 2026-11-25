import mongoose from "mongoose";

/**
 * Connect to MongoDB using the configured URI.
 */
export async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  const conn = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}
