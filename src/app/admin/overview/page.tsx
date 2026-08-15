import React, { Suspense } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Users,
  CalendarDays,
  Megaphone,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GridLoader, HashLoader } from "react-spinners";
import {
  getDasaDashboardStats,
  getDasaChartData,
  getRecentAnonymousMessages,
  getRecentNotifications,
} from "@/lib/dasa-admin-data";
import { RecentMessagesFilter, ActivityChartClient } from "./client-components";
import { SystemAlertBanner } from "./system-alert-banner";

export default async function DashboardPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const searchQuery =
    typeof searchParams.search === "string" ? searchParams.search : "";

  return (
    <div className="flex-1 space-y-8 pb-10 max-w-7xl mx-auto">
      <Suspense
        fallback={
          <div className="h-[74px] bg-white border-none flex items-center justify-center">
            <GridLoader size={10} color="hsl(var(--primary))" />
          </div>
        }
      >
        <SystemAlertBanner />
      </Suspense>

      {/* ---------- HEADER ---------- */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
        <div>
          <h2 className="text-[18px] uppercase tracking-widest font-bold text-[#222222]">
            Overview
          </h2>
          <p className="text-[12px] text-text-muted mt-1 uppercase tracking-wider font-medium">
            Insight into DaSA community and operations
          </p>
        </div>
        <button className="bg-black text-white px-5 py-2.5 text-[11px] uppercase tracking-wider font-bold hover:bg-opacity-90 transition-colors w-fit rounded-2xl">
          Download Report
        </button>
      </header>

      <Suspense
        fallback={
          <div className="h-[200px] flex items-center justify-center">
            <HashLoader size={18} color="hsl(var(--primary))" />
          </div>
        }
      >
        <StatsSection />
      </Suspense>

      {/* ---------- REGISTRATIONS + NOTIFICATIONS ---------- */}
      <section className="grid gap-5 lg:grid-cols-3">
        <Suspense
          fallback={
            <div className="lg:col-span-2 h-[450px] bg-white border-none flex justify-center items-center rounded-2xl">
              <GridLoader size={18} color="hsl(var(--primary))" />
            </div>
          }
        >
          <ActivityChartSection />
        </Suspense>

        <Suspense
          fallback={
            <div className="bg-white border-none flex justify-center items-center rounded-2xl">
              <GridLoader size={18} color="hsl(var(--primary))" />
            </div>
          }
        >
          <RecentNotificationsSection />
        </Suspense>
      </section>

      {/* ---------- RECENT MESSAGES ---------- */}
      <section className="bg-white border-none overflow-hidden rounded-2xl">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-[13px] uppercase tracking-widest font-bold text-[#222222]">
              Anonymous Messages
            </h3>
            <p className="text-[11px] text-text-muted mt-1 uppercase tracking-wider">
              Recent messages received from students
            </p>
          </div>
          <RecentMessagesFilter />
        </div>

        <div className="overflow-x-auto">
          <Suspense
            fallback={
              <div className="h-[300px] flex items-center justify-center">
                <GridLoader size={18} color="hsl(var(--primary))" />
              </div>
            }
          >
            <RecentMessagesSection search={searchQuery} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function StatsSection() {
  const stats = await getDasaDashboardStats();

  return (
    <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          title: "Total Members",
          icon: Users,
          value: stats.totalUsers,
          desc: stats.descriptions?.users,
        },
        {
          title: "Upcoming Events",
          icon: CalendarDays,
          value: stats.upcomingEvents,
          desc: stats.descriptions?.events,
        },
        {
          title: "Announcements",
          icon: Megaphone,
          value: stats.totalAnnouncements,
          desc: stats.descriptions?.announcements,
        },
        {
          title: "Anonymous Msgs",
          icon: MessageSquare,
          value: stats.totalMessages,
          desc: stats.descriptions?.messages,
        },
      ].map((stat, i) => (
        <div
          key={i}
          className="bg-white p-6 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group cursor-default relative overflow-hidden rounded-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-start justify-between mb-6">
            <h3 className="text-[11px] uppercase tracking-wider font-bold text-text-muted group-hover:text-[#222222] transition-colors mt-1.5">
              {stat.title}
            </h3>
            <div className="w-9 h-9 rounded-full bg-dasalight flex items-center justify-center  group-hover:scale-110 transition-all duration-300">
              <stat.icon className="w-4 h-4 text-primary" strokeWidth={2} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-semibold text-[#222222] mb-1.5 tracking-tight">
              {stat.value}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-text-muted/70 group-hover:text-text-muted transition-colors">
              {stat.desc || "N/A"}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

async function ActivityChartSection() {
  const chartData = await getDasaChartData();

  return (
    <div className="lg:col-span-2 bg-white border-none p-6 flex flex-col rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] uppercase tracking-widest font-bold text-[#222222]">
          Community Growth
        </h3>
      </div>
      <p className="text-[11px] text-text-muted uppercase tracking-wider mb-6">
        Student Registrations (Last 6 Months)
      </p>
      <ActivityChartClient data={chartData} />
    </div>
  );
}

async function RecentNotificationsSection() {
  const notifications = await getRecentNotifications();

  return (
    <div className="bg-white border-none p-6 flex flex-col rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] uppercase tracking-widest font-bold text-[#222222]">
          Recent Notifications
        </h3>
        <Link
          href="/admin/notifications"
          className="text-[10px] uppercase tracking-widest font-bold  hover:text-black transition-colors flex items-center"
        >
          View All <ArrowUpRight className="w-3 h-3 ml-1" />
        </Link>
      </div>
      <p className="text-[11px] text-text-muted uppercase tracking-wider mb-6">
        Latest system alerts
      </p>

      <div className="space-y-4 overflow-y-auto pr-2 max-h-[350px] custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[11px] uppercase tracking-widest text-text-muted">
              No recent notifications
            </p>
          </div>
        ) : (
          notifications.map((item: any) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-3 border-none  transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dasadeep/30 relative overflow-hidden rounded-full">
                  <Image
                    src={item.notificationImg || "/placeholder.svg"}
                    alt="Notification Icon"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#222222] line-clamp-1 group-hover: transition-colors">
                    {item.content || "System Notification"}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {item.type || "Alert"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-text-muted font-medium">
                  {new Date(item.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short"
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

async function RecentMessagesSection({ search }: { search: string }) {
  const filteredMessages = await getRecentAnonymousMessages(search);

  if (filteredMessages.length === 0) {
    return (
      <div className="p-12 text-center ">
        <p className="text-[13px] font-medium text-text-muted">
          No messages found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-dasadeep/20 border-none">
        <TableRow className="hover:bg-transparent border-none">
          <TableHead className="text-[10px] uppercase tracking-widest font-bold text-text-muted h-12">
            Message ID
          </TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest font-bold text-text-muted h-12">
            Sender Name
          </TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest font-bold text-text-muted h-12">
            Date
          </TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest font-bold text-text-muted h-12">
            Type
          </TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest font-bold text-text-muted h-12 text-right">
            Content Preview
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredMessages.map((msg: any) => (
          <TableRow
            key={msg._id}
            className=" hover:bg-dasadeep/10 transition-colors cursor-pointer group border-none"
          >
            <TableCell className="font-medium text-[13px] text-[#222222] group-hover: transition-colors">
              #{msg._id.toString().slice(-6).toUpperCase()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-dasadeep/50 border-none flex items-center justify-center overflow-hidden">
                  <span className="text-[10px] font-bold text-text-muted">
                    {msg.anonymousName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#222222]">
                    {msg.anonymousName}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-[12px] text-text-muted">
              {new Date(msg.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell>
              <span
                className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border-none rounded-2xl ${msg.type === 'file' ? 'bg-orange-50 text-orange-600' : 'bg-primary/5 text-primary'}`}
              >
                {msg.type}
              </span>
            </TableCell>
            <TableCell className="text-right text-[13px] font-medium text-[#222222] max-w-[200px] truncate">
              {msg.content}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
