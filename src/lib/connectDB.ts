import mongoose from "mongoose";

declare global {
  var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const dbUrl = process.env.DATABASE_URL?.replace('<db_password>', process.env.DATABASE_PASSWORD || '');
    if (!dbUrl) throw new Error("DATABASE_URL is missing");

    cached.promise = mongoose.connect(dbUrl, {
      bufferCommands: true,
    }).then((mongoose) => {
      console.log("Connected to Remote MongoDB");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};