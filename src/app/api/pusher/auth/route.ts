import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const socketId = data.get("socket_id") as string;
    const channelName = data.get("channel_name") as string;
    
    // We pass name and avatar from client via auth endpoints
    const name = data.get("name") as string;
    const avatar = data.get("avatar") as string;
    
    if (!socketId || !channelName || !name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    
    const presenceData = {
      user_id: socketId,
      user_info: {
        name,
        avatar,
      },
    };
    
    const authResponse = pusherServer.authorizeChannel(socketId, channelName, presenceData);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
