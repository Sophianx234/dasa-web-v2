"use server";

import connectToDatabase from "@/lib/mongoose";
import User from "@/models/userModel";
import { Media } from "@/models/Media";
import Event from "@/models/eventsModel";
import Announcement from "@/models/announcementModel";
import Message from "@/models/messagesModel";
import Notification from "@/models/notifications";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookies } from "next/headers";

// Helper to verify token
const verifyToken = async (token?: string | null) => {
  const cookieStore = await cookies();
  const activeToken = token || cookieStore.get('token')?.value;
  if (!activeToken) throw new Error("Not logged in");
  const decoded: any = jwt.verify(activeToken, process.env.JWT_SECRET as string);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error("User no longer exists");
  return user;
};

// --- AUTH ---

export async function loginAction(creds: any) {
  try {
    await connectToDatabase();
    const { email, password } = creds;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.isCorrectPassword(password))) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    const userObj = user.toObject() as any;
    userObj.password = undefined;
    userObj._id = userObj._id.toString();
    
    const cookieStore = await cookies();
    cookieStore.set('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60, 
      path: '/' 
    });

    return { status: "success", token, user: userObj };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function signupAction(userInfo: any) {
  try {
    await connectToDatabase();
    
    if (userInfo.email) {
      const existingUser = await User.findOne({ email: userInfo.email });
      if (existingUser) {
        return { status: "fail", message: "Email is already in use" };
      }
    }

    console.log("Signup userInfo received:", userInfo);

    const newUser = await User.create(userInfo);
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    const userObj = JSON.parse(JSON.stringify(newUser));
    userObj.password = undefined;
    
    const cookieStore = await cookies();
    cookieStore.set('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60, 
      path: '/' 
    });

    return { status: "success", token, user: userObj };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  return { status: "success" };
}

export async function forgotPasswordAction(email: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // In a real app, send email here
    return { status: "success", message: "Token sent to email (simulated)" };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function resetPasswordAction(tokenStr: string, body: any) {
  try {
    await connectToDatabase();
    const hashedToken = crypto.createHash("sha256").update(tokenStr).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token invalid or expired");
    user.password = body.password;
    user.confirmPassword = body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    const userObj = user.toObject() as any;
    userObj._id = userObj._id.toString();
    return { status: "success", token, user: userObj };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

// --- USERS ---

export async function getUserAction(token: string) {
  try {
    await connectToDatabase();
    const user = await verifyToken(token);
    const userObj = user.toObject() as any;
    userObj._id = userObj._id.toString();
    return { status: "success", user: userObj };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function getUsersAction(token: string) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    const users = await User.find().lean();
    return { status: "success", data: users.map((u: any) => ({ ...u, _id: u._id.toString() })) };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function updateUserAction(token: string, update: any) {
  try {
    await connectToDatabase();
    const user = await verifyToken(token);
    const updated = await User.findByIdAndUpdate(user._id, update, { new: true, runValidators: true }).lean();
    return { status: "success", data: { ...updated, _id: updated?._id.toString() } };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function changeProfileAction(token: string, update: any) {
  return updateUserAction(token, update);
}

export async function removeUserAction(token: string, id: string) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    await User.findByIdAndDelete(id);
    return { status: "success" };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function changeUserRoleAction(token: string, id: string, role: string) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    const updated = await User.findByIdAndUpdate(id, { role }, { new: true }).lean();
    return { status: "success", data: { ...updated, _id: updated?._id.toString() } };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

// --- MESSAGES ---

export async function getAnonymousAction(token: string, lim: number | null) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    let query = Message.find({ isAnonymous: true }).lean();
    if (lim) query = query.limit(lim);
    const msgs = await query;
    return { status: "success", anonymous: { messages: msgs.map((m: any) => ({ ...m, _id: m._id.toString() })) } };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

// --- ANNOUNCEMENTS ---

export async function getAnnouncementsAction(token: string) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    const ann = await Announcement.find().lean();
    return { status: "success", announcements: ann.map((a: any) => ({ ...a, _id: a._id.toString() })) };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function createAnnouncementAction(token: string, body: any) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    const ann = await Announcement.create(body);
    const annObj = ann.toObject() as any;
    annObj._id = annObj._id.toString();
    return { status: "success", data: annObj };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function updateAnnouncementAction(token: string, id: string, body: any) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    const updated = await Announcement.findByIdAndUpdate(id, body, { new: true }).lean();
    return { status: "success", data: { ...updated, _id: updated?._id.toString() } };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function deleteAnnouncementAction(token: string, id: string) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    await Announcement.findByIdAndDelete(id);
    return { status: "success" };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

// --- EVENTS ---

export async function getEventsAction(token: string) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    const evts = await Event.find().lean();
    return { status: "success", events: evts.map((e: any) => ({ ...e, _id: e._id.toString() })) };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function createEventAction(token: string, body: any) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    const evt = await Event.create(body);
    const evtObj = evt.toObject() as any;
    evtObj._id = evtObj._id.toString();
    return { status: "success", data: evtObj };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function updateEventAction(token: string, id: string, body: any) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    const updated = await Event.findByIdAndUpdate(id, body, { new: true }).lean();
    return { status: "success", data: { ...updated, _id: updated?._id.toString() } };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

export async function removeEventAction(token: string, id: string) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    await Event.findByIdAndDelete(id);
    return { status: "success" };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

// --- NOTIFICATIONS ---

export async function getNotificationsAction(token: string) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    const notifs = await Notification.find().lean();
    return { status: "success", data: notifs.map((n: any) => ({ ...n, _id: n._id.toString() })) };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}

// --- MEDIA --- (Delegating uploadImages to actions.ts where uploadMediaAction is)

export async function removeImageAction(token: string, imageId: string) {
  try {
    await connectToDatabase();
    await verifyToken(token);
    await Media.findByIdAndDelete(imageId);
    return { status: "success" };
  } catch (error: any) {
    return { status: "fail", message: error.message };
  }
}
