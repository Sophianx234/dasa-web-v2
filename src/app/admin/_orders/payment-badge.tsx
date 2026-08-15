import { PaymentStatus } from "./page";

export default function PaymentBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    paid: "bg-primary/10  ",
    pending: "bg-orange-50 text-orange-700 ",
    failed: "bg-red-50 text-red-700 ",
  };
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border-none ${styles[status]}`}
    >
      {status}
    </span>
  );
}
