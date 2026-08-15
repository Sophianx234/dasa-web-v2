import { connectToDatabase } from "./connectDB";
import { ActivityLog } from "@/models/ActivityLog";
export async function logActivity(action: string, details: string, targetId?: string) {
  try {
    // temporarily disabled
    
    await connectToDatabase();
    await ActivityLog.create({
      user: null,
      action,
      details,
      targetId,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}
