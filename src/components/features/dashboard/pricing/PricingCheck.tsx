import { BsCheck2Circle } from "react-icons/bs";

type PricingCheckProps = {
  desc: string;
  isFeatured?: boolean;
};

function PricingCheck({ desc, isFeatured }: PricingCheckProps) {
  return (
    <div className="flex items-start gap-4">
      <BsCheck2Circle 
        className={`size-5 mt-0.5 flex-shrink-0 ${isFeatured ? "text-white" : "text-dasadeep"}`} 
      />
      <span className={`text-[15px] font-poppins ${isFeatured ? "text-white/90" : "text-zinc-300"}`}>
        {desc}
      </span>
    </div>
  );
}

export default PricingCheck;
