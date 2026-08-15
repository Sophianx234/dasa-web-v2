import { cache } from "react";
import { connectToDatabase } from "@/lib/connectDB";
import User from "@/models/userModel";
import Event from "@/models/eventsModel";
import Announcement from "@/models/announcementModel";
import Message from "@/models/messagesModel";
import Notification from "@/models/notifications";
import mongoose from "mongoose";

export const getDasaDashboardStats = cache(async () => {
  await connectToDatabase();
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalUsers,
    newUsersThisMonth,
    newUsersLastMonth,
    totalEvents,
    upcomingEvents,
    totalAnnouncements,
    totalMessages,
    messagesLast24Hours
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    User.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
    Event.countDocuments(),
    Event.countDocuments({ eventDate: { $gte: now } }),
    Announcement.countDocuments(),
    Message.countDocuments({ anonymousName: { $exists: true } }),
    Message.countDocuments({ 
        anonymousName: { $exists: true }, 
        createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } 
    }),
  ]);

  const userGrowth = newUsersLastMonth === 0 ? 0 : ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100;

  return {
    totalUsers,
    totalEvents,
    upcomingEvents,
    totalAnnouncements,
    totalMessages,
    descriptions: {
      users: `${userGrowth > 0 ? '+' : ''}${userGrowth.toFixed(1)}% growth since last month`,
      events: `${upcomingEvents} upcoming events scheduled`,
      announcements: `Total published announcements`,
      messages: `${messagesLast24Hours} anonymous messages in the last 24h`,
    },
  };
});

export const getDasaChartData = cache(async () => {
  await connectToDatabase();
  
  // Get registrations for the last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1); // Start of month, 5 months ago (total 6 mos)
  
  const registrations = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: { 
        _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" } 
        }, 
        total: { $sum: 1 } 
    } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const result = [];
  
  // Fill in zero for months with no registrations
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1; // 1-indexed for MongoDB
    
    const match = registrations.find((x) => x._id.year === year && x._id.month === month);
    result.push({ 
        name: monthNames[month - 1], 
        value: match ? match.total : 0 
    });
  }
  
  return result;
});

export const getRecentAnonymousMessages = cache(async (search: string) => {
  await connectToDatabase();
  const query: any = { anonymousName: { $exists: true, $ne: null } };
  
  if (search) {
    query.$or = [
      { anonymousName: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const messages = await Message.find(query).sort({ createdAt: -1 }).limit(10).lean();
  
  return JSON.parse(JSON.stringify(messages)).map((msg: any) => ({
      _id: msg._id,
      anonymousName: msg.anonymousName || "Anonymous",
      content: msg.content || (msg.messageType === 'file' ? "Sent an attachment" : "No content"),
      date: msg.createdAt,
      type: msg.messageType,
  }));
});

export const getRecentNotifications = cache(async () => {
  await connectToDatabase();
  const notifs = await Notification.find({}).sort({ createdAt: -1 }).limit(10).lean();
  
  return JSON.parse(JSON.stringify(notifs));
});

