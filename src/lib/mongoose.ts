import mongoose from "mongoose";
import dns from "dns";

// Force Node.js to use Google DNS to bypass ISP/Router DNS blocks on SRV queries
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn("Could not set DNS servers", e);
}

const DATABASE = process.env.DATABASE || process.env.MONGODB_URI;
const DATABASE_LOCAL = process.env.DATABASE_LOCAL;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

if (!DATABASE && !DATABASE_LOCAL) {
  throw new Error("Please define the DATABASE or DATABASE_LOCAL environment variable inside .env.local");
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
      family: 4, // Force IPv4 to fix SRV lookup issues on Node 18+
    };
    
    let uri = DATABASE as string;
    if (DATABASE && DATABASE_PASSWORD) {
        uri = uri.replace("<db_password>", DATABASE_PASSWORD);
    }

    cached.promise = mongoose.connect(uri, opts)
      .then((mongoose) => mongoose)
      .catch((err) => {
        console.error("Database connection failed:", err.message);
        throw err;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // reset so it can be retried
    throw e;
  }
  
  return cached.conn;
}

export default connectToDatabase;
