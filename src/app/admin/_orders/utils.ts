import { Clock, Truck, CheckCircle, XCircle } from "lucide-react";

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  processing: {
    label: "Processing",
    color: "bg-primary/10  ",
    icon: Clock,
  },
  in_transit: {
    label: "In Transit",
    color: "bg-dasadeep/50 text-[#222222] ",
    icon: Truck,
  },
  arrived: {
    label: "Arrived",
    color: "bg-dasadeep/50 text-[#222222] ",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-primary/10  ",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700 ",
    icon: XCircle,
  },
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(
    amount,
  );

export const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";
