"use client";

import Image from "next/image";
import PricingCheck from "./PricingCheck";
import { ArrowRight } from "lucide-react";

type PricingCardProps = {
  mainIcon?: ReactNode; // Kept for backwards compatibility but we might not use it in the horizontal design
  badgeIcon?: ReactNode;
  title: string;
  subTitle: string;
  price: string;
  priceStrike?: string; // Kept but probably won't show it for a cleaner look
  badgeTitle?: string; // Optional subtitle badge (like TEAM or STANDARD from the image)
  planPackage: string[];
  type?: "personal" | "standard" | "pro";
  image?: string;
  onSelect?: () => void;
};

export default function PricingCard({
  title,
  subTitle,
  price,
  badgeTitle,
  planPackage,
  type = "personal",
  image,
  onSelect
}: PricingCardProps) {

  // Determine styles based on type
  const isMostPopular = type === "standard";
  
  // Alternating themes: Most popular is dasadeep, others are zinc-900
  const bgClass = isMostPopular ? "bg-dasadeep" : "bg-zinc-900";
  const borderClass = isMostPopular ? "border-white/20" : "border-zinc-800";
  const innerBorderClass = isMostPopular ? "border-white/20" : "border-zinc-800";
  const badgeClass = isMostPopular ? "border-white/30 text-white/90" : "border-zinc-700 text-zinc-400";
  const titleClass = "text-white";
  const priceClass = "text-white";
  const subTitleClass = isMostPopular ? "text-white/80" : "text-zinc-400";
  const middleSectionBg = isMostPopular ? "bg-black/10" : "bg-black/20";
  
  const buttonClass = isMostPopular 
    ? "bg-white text-dasadeep hover:bg-gray-100 " 
    : "bg-dasadeep text-white   ";
    
  const gradientClass = isMostPopular
    ? "from-zinc-900 via-zinc-900/40 to-transparent" 
    : "from-zinc-900 via-zinc-900/40 to-transparent";

  return (
    <div className="relative w-full">
      {isMostPopular && (
        <div className="absolute -top-4 left-6 z-10">
          <div className="uppercase font-bold text-[11px] tracking-wider px-4 py-1.5 rounded-md bg-white text-dasadeep shadow-md">
            Most Popular
          </div>
        </div>
      )}
      
      <div
        className={`w-full ${bgClass} rounded-2xl border ${borderClass} transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 
          flex flex-col md:flex-row overflow-hidden min-h-[320px]`}
      >
        {/* Left Side: Pricing Info */}
        <div className={`p-8 md:p-10 ${image ? "md:w-[35%]" : "md:w-[40%]"} flex flex-col justify-center border-b md:border-b-0 md:border-r ${innerBorderClass}`}>
          {badgeTitle && (
            <div className="mb-6">
               <span className={`uppercase text-xs font-bold tracking-widest px-3 py-1.5 rounded border ${badgeClass}`}>
                {badgeTitle}
              </span>
            </div>
          )}
          
          <div className={`flex items-start gap-1 font-rethink mb-2 ${priceClass}`}>
            <span className="text-3xl font-bold mt-1">GH₵</span>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter">
              {price.split('.')[0]}
              {price.includes('.') && (
                <span className="text-3xl font-bold opacity-70">.{price.split('.')[1]}</span>
              )}
            </h1>
          </div>
          
          <h2 className={`font-poppins text-sm leading-relaxed mb-8 mt-2 max-w-[200px] ${subTitleClass}`}>
            {subTitle}
          </h2>
          
          <button
            onClick={(e: React.FormEvent) => {
              e.preventDefault();
              onSelect?.();
            }}
            className={`group w-fit flex items-center gap-2 py-3 px-6 text-sm rounded-lg font-bold transition-all duration-300 ${buttonClass}`}
          >
            Pay now
            <ArrowRight className="w-4 h-4 transition-transform duration-300 " />
          </button>
        </div>

        {/* Middle Side: Features */}
        <div className={`p-8 md:p-10 ${image ? "md:w-[35%]" : "md:w-[60%]"} flex flex-col justify-center ${middleSectionBg}`}>
          <div className="space-y-4">
            {planPackage && planPackage.map((plan, idx) => (
              <PricingCheck key={idx} desc={plan} isFeatured={isMostPopular} />
            ))}
          </div>
        </div>

        {/* Right Side: Image */}
        {image && (
          <div className="hidden md:block md:w-[30%] relative">
            <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-center" />
            <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} pointer-events-none`} />
          </div>
        )}
      </div>
    </div>
  );
}
