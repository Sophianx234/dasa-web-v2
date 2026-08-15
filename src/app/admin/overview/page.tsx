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
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GridLoader } from "react-spinners";
import {
  getDashboardStats,
  getRecentOrders,
  getSalesData,
  getStockAlerts,
} from "@/lib/admin-data";
import { RecentOrdersFilter, SalesChartClient } from "./client-components";
import { SystemAlertBanner } from "./system-alert-banner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    delivered: " text-primary bg-primary/5",
    processing: "] text-[#222222] bg-dasadeep/30",
    cancelled: " text-red-600 bg-red-50",
    in_transit: "] text-[#222222] bg-dasadeep/30",
    awaiting_payment: "] text-[#222222] bg-dasadeep/30",
    awaiting_pickup: "] text-[#222222] bg-dasadeep/30",
    packed: "] text-[#222222] bg-dasadeep/30",
    ready_for_dispatch: "] text-[#222222] bg-dasadeep/30",
    dispatched: "] text-[#222222] bg-dasadeep/30",
    arrived: " text-primary bg-primary/5",
    delivery_attempted: " text-orange-600 bg-orange-50",
    paid: " text-primary bg-primary/5",
  };
  return map[status] || " text-text-muted bg-transparent";
};

export default async function DashboardPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const statusFilter =
    typeof searchParams.status === "string" ? searchParams.status : "all";
  const searchQuery =
    typeof searchParams.search === "string" ? searchParams.search : "";

  return (
    <div className="flex-1 space-y-8 pb-10 max-w-7xl mx-auto">
      <Suspense
        fallback={
          <div className="h-[74px] bg-white border-none flex items-center justify-center">
            <GridLoader size={10} color="#5B7763" />
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
            Insight into your store performance and operations
          </p>
        </div>
        <button className="bg-black text-white px-5 py-2.5 text-[11px] uppercase tracking-wider font-bold hover:bg-opacity-90 transition-colors w-fit">
          Download Report
        </button>
      </header>

      <Suspense
        fallback={
          <div className="h-[200px] flex items-center justify-center">
            <GridLoader size={18} color="#5B7763" />
          </div>
        }
      >
        <StatsSection />
      </Suspense>

      {/* ---------- SALES + INVENTORY ---------- */}
      <section className="grid gap-5 lg:grid-cols-3">
        <Suspense
          fallback={
            <div className="lg:col-span-2 h-[450px] bg-white border-none flex justify-center items-center">
              <GridLoader size={18} color="#5B7763" />
            </div>
          }
        >
          <SalesChartSection />
        </Suspense>

        <Suspense
          fallback={
            <div className="bg-white border-none flex justify-center items-center">
              <GridLoader size={18} color="#5B7763" />
            </div>
          }
        >
          <StockAlertsSection />
        </Suspense>
      </section>

      {/* ---------- RECENT ORDERS ---------- */}
      <section className="bg-white border-none overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-[13px] uppercase tracking-widest font-bold text-[#222222]">
              Recent Orders
            </h3>
            <p className="text-[11px] text-text-muted mt-1 uppercase tracking-wider">
              Latest transactions from your store
            </p>
          </div>
          <RecentOrdersFilter />
        </div>

        <div className="overflow-x-auto">
          <Suspense
            fallback={
              <div className="h-[300px] flex items-center justify-center">
                <GridLoader size={18} color="#5B7763" />
              </div>
            }
          >
            <RecentOrdersSection status={statusFilter} search={searchQuery} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function StatsSection() {
  const stats = await getDashboardStats();

  return (
    <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          title: "Total Revenue",
          icon: DollarSign,
          value: `₵${stats.totalRevenue}`,
          desc: stats.descriptions?.revenue,
        },
        {
          title: "Orders",
          icon: ShoppingBag,
          value: stats.totalOrders,
          desc: stats.descriptions?.orders,
        },
        {
          title: "Active Customers",
          icon: Users,
          value: stats.totalCustomers,
          desc: stats.descriptions?.customers,
        },
        {
          title: "Low Stock Items",
          icon: Package,
          value: stats.lowStockCount,
          desc: stats.descriptions?.stock,
        },
      ].map((stat, i) => (
        <div
          key={i}
          className="bg-white p-6 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group cursor-default relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-start justify-between mb-6">
            <h3 className="text-[11px] uppercase tracking-wider font-bold text-text-muted group-hover:text-[#222222] transition-colors mt-1.5">
              {stat.title}
            </h3>
            <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
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

async function SalesChartSection() {
  const salesChartData = await getSalesData();

  return (
    <div className="lg:col-span-2 bg-white border-none p-6 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] uppercase tracking-widest font-bold text-[#222222]">
          Sales Overview
        </h3>
      </div>
      <p className="text-[11px] text-text-muted uppercase tracking-wider mb-6">
        Revenue across the last 7 days
      </p>
      <SalesChartClient data={salesChartData} />
    </div>
  );
}

async function StockAlertsSection() {
  const stockAlerts = await getStockAlerts();

  return (
    <div className="bg-white border-none p-6 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] uppercase tracking-widest font-bold text-[#222222]">
          Stock Alerts
        </h3>
        <Link
          href="/admin/products"
          className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-black transition-colors flex items-center"
        >
          View All <ArrowUpRight className="w-3 h-3 ml-1" />
        </Link>
      </div>
      <p className="text-[11px] text-text-muted uppercase tracking-wider mb-6">
        Items needing attention
      </p>

      <div className="space-y-4 overflow-y-auto pr-2 max-h-[350px] custom-scrollbar">
        {stockAlerts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[11px] uppercase tracking-widest text-text-muted">
              No stock alerts
            </p>
          </div>
        ) : (
          stockAlerts.map((item: any) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-3 border-none hover:bg-primary/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dasadeep/30 relative overflow-hidden">
                  <Image
                    src={item.images?.[0] || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#222222] line-clamp-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 bg-red-50 text-red-600 border-none text-[10px] font-bold uppercase tracking-wider">
                  {item.stock} left
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

async function RecentOrdersSection({
  status,
  search,
}: {
  status: string;
  search: string;
}) {
  const filteredOrders = await getRecentOrders(status, search);

  if (filteredOrders.length === 0) {
    return (
      <div className="p-12 text-center ">
        <p className="text-[13px] font-medium text-text-muted">
          No orders found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-dasadeep/20">
        <TableRow className="hover:bg-transparent ">
          <TableHead className="text-[10px] uppercase tracking-widest font-bold text-text-muted h-12">
            Order ID
          </TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest font-bold text-text-muted h-12">
            Customer
          </TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest font-bold text-text-muted h-12">
            Date
          </TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest font-bold text-text-muted h-12">
            Status
          </TableHead>
          <TableHead className="text-[10px] uppercase tracking-widest font-bold text-text-muted h-12 text-right">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.map((order: any) => (
          <TableRow
            key={order._id}
            className=" hover:bg-dasadeep/10 transition-colors cursor-pointer group"
          >
            <TableCell className="font-medium text-[13px] text-[#222222] group-hover:text-primary transition-colors">
              <Link href={`/admin/orders/${order._id}`}>
                #{order._id.slice(-6).toUpperCase()}
              </Link>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-dasadeep/50 border-none flex items-center justify-center overflow-hidden">
                  {order.avatar ? (
                    <img
                      src={order.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-text-muted">
                      {order.initials}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#222222]">
                    {order.customerName}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {order.customerEmail}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-[12px] text-text-muted">
              {new Date(order.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell>
              <span
                className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border-none ${getStatusColor(order.status)}`}
              >
                {order.status.replace(/_/g, " ")}
              </span>
            </TableCell>
            <TableCell className="text-right text-[13px] font-bold text-[#222222]">
              {formatCurrency(order.totalAmount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
