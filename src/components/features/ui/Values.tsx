"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { FaScaleUnbalanced } from "react-icons/fa6";
import { LiaSeedlingSolid, LiaSlideshare } from "react-icons/lia";
import { PiUsersFourFill } from "react-icons/pi";

// 1. Abstracted data for a clean, DRY component structure
const coreValues = [
  {
    id: "01",
    icon: FaScaleUnbalanced,
    title: "Integrity",
    desc: "We uphold honesty, accountability, and transparency in all our actions, believing that true leadership grows from unwavering moral principles.",
  },
  {
    id: "02",
    icon: LiaSlideshare,
    title: "Teamwork",
    desc: "We achieve more together. Through collaboration and mutual respect, we build relationships that empower every member to contribute and succeed.",
  },
  {
    id: "03",
    icon: PiUsersFourFill,
    title: "Unity & Community",
    desc: "We are one family, bonded by shared heritage and purpose. Our strength lies in unity and in creating a welcoming space for all.",
  },
  {
    id: "04",
    icon: LiaSeedlingSolid,
    title: "Growth & Learning",
    desc: "We value lifelong learning and curiosity. Through innovation and adaptability, we inspire growth within and beyond the DaSA community.",
  },
];

// Framer Motion staggered animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 20 } 
  },
};

export default function Values() {
  return (
    <section className="w-full py-28 md:py-40 px-6 bg-[#161412] relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-dasadeep/[0.03] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-orange-600/[0.04] rounded-full blur-[100px] pointer-events-none translate-y-1/3" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* === HEADER === */}
        <div className="max-w-3xl mx-auto text-center mb-20 md:mb-32 flex flex-col items-center">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-transparent via-dasadeep to-transparent mb-8 rounded-full"
          />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-rethink font-extrabold text-5xl md:text-6xl lg:text-7xl text-white tracking-tighter leading-[1.05] mb-8"
          >
            What We <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dasadeep to-orange-300">
              Stand For.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-[#a39f99] font-poppins leading-relaxed max-w-2xl"
          >
            The core principles that unite us, inspire our journey, and guide our service to Dagbon and beyond.
          </motion.p>
        </div>

        {/* === VALUES GRID === */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {coreValues.map((value, i) => {
            const Icon = value.icon;
            // Create a slight staggering layout by pushing evens down slightly on desktop
            const offsetClass = i % 2 !== 0 ? "md:mt-12" : "";
            
            return (
              <motion.div
                key={value.id}
                variants={cardVariants}
                className={`group relative bg-[#1c1a18] rounded-[2rem] p-10 lg:p-12 border border-white/[0.03] overflow-hidden hover:border-dasadeep/30 transition-all duration-700 hover:shadow-[0_0_40px_rgba(232,126,56,0.08)] ${offsetClass}`}
              >
                {/* Ethereal Hover Glow */}
                <div className="absolute -inset-4 bg-gradient-to-br from-dasadeep/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />

                {/* Top Row: Icon & Watermark */}
                <div className="flex justify-between items-start mb-12 relative z-10">
                  {/* Premium Icon Container */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-dasadeep/10 rounded-2xl group-hover:bg-dasadeep/20 group-hover:rotate-6 transition-all duration-500 ease-out" />
                    <div className="absolute inset-0 border border-dasadeep/20 rounded-2xl group-hover:border-dasadeep/50 group-hover:-rotate-3 transition-all duration-500 ease-out" />
                    <Icon className="w-8 h-8 text-dasadeep relative z-10 group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-md" />
                  </div>

                  {/* Watermark Number */}
                  <div className="text-white/[0.04] font-rethink font-extrabold text-7xl leading-none select-none group-hover:text-dasadeep/10 transition-colors duration-700">
                    {value.id}
                  </div>
                </div>

                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="font-rethink font-bold text-3xl text-white mb-5 group-hover:text-dasadeep transition-colors duration-500">
                    {value.title}
                  </h3>
                  <p className="font-poppins text-[#a39f99] text-lg leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                    {value.desc}
                  </p>
                </div>

                {/* Decorative Bottom Line (Animated) */}
                <div className="absolute bottom-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-dasadeep/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out opacity-0 group-hover:opacity-100"></div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
