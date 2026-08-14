"use server";

import connectToDatabase from "@/lib/mongoose";
import AnonymousMessage from "@/lib/models/AnonymousMessage";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher";

export async function postAnonymousMessage(message: string, authorName: string, avatarUrl: string) {
  try {
    if (!message || message.trim().length === 0) {
      return { success: false, error: "Message cannot be empty." };
    }
    if (!authorName || !avatarUrl) {
      return { success: false, error: "Identity missing." };
    }

    await connectToDatabase();
    
    const newMessage = await AnonymousMessage.create({ 
      message: message.trim(),
      authorName,
      avatarUrl
    });
    
    revalidatePath("/anonymous"); // Revalidate to refresh any cached pages
    
    const serializedMsg = JSON.parse(JSON.stringify(newMessage));
    
    // Broadcast instantly to all connected users
    await pusherServer.trigger("presence-anonymous", "new-message", serializedMsg);
    
    return { success: true, data: serializedMsg };
  } catch (error) {
    console.error("Error posting anonymous message:", error);
    return { success: false, error: "Failed to post message." };
  }
}

export async function getAnonymousMessages(limit = 50) {
  try {
    await connectToDatabase();
    
    const messages = await AnonymousMessage.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
      
    // Serialize for client
    const serialized = messages.map((msg) => ({
      ...msg,
      _id: msg._id.toString(),
      createdAt: (msg.createdAt as Date).toISOString(),
    }));
    
    return { success: true, data: serialized };
  } catch (error) {
    console.error("Error fetching anonymous messages:", error);
    return { success: false, data: [] };
  }
}
