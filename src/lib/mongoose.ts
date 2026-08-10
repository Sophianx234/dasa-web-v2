import mongoose from "mongoose";

const DATABASE = process.env.DATABASE;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

if (!DATABASE) {
  throw new Error("Please define the DATABASE environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    
    // Support the custom replace logic from dasa-api
    let uri = DATABASE as string;
    if (DATABASE_PASSWORD) {
        uri = uri.replace("<db_password>", DATABASE_PASSWORD);
    }

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
