import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_CONFIG } from "./utils";

export default function StatusSelector({
  currentStatus,
  paymentReference,
  onUpdate,
}: {
  currentStatus: string;
  paymentReference: string;
  onUpdate: (ref: string, newStatus: string) => void;
}) {
  const conf = STATUS_CONFIG[currentStatus] || {
    label: currentStatus,
    color: "bg-dasadeep/50 text-[#222222] ",
  };
  return (
    <Select
      value={currentStatus}
      onValueChange={(v) => onUpdate(paymentReference, v)}
    >
      <SelectTrigger
        className={`h-8 text-[9px] uppercase tracking-wider w-[140px] border-none ${conf.color} font-bold rounded-2xl focus:ring-0 px-2 shadow-none`}
      >
        <SelectValue>{conf.label}</SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-2xl shadow-sm">
        {Object.entries(STATUS_CONFIG).map(([k, c]) => (
          <SelectItem
            key={k}
            value={k}
            className="text-[11px] uppercase tracking-wider rounded-2xl cursor-pointer focus:bg-dasadeep/50"
          >
            <div className="flex items-center gap-2">
              <span>{c.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
