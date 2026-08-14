"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MdFileDownload } from "react-icons/md";

export default function ConstitutionSection() {
  return (
    <section className="relative w-full bg-[#f9f7f4] py-24 md:py-32 overflow-hidden">
      
      {/* === BACKGROUND WATERMARK === */}
      {/* Creates a massive, subtle typographic texture behind the content */}
      <div className="absolute top-10 left-4 md:left-10 text-[8rem] md:text-[14rem] font-rethink font-black text-[#33312e]/[0.03] select-none pointer-events-none leading-none tracking-tighter whitespace-nowrap z-0">
        DASA <br /> LAW.
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
        
        {/* === LEFT COLUMN: TYPOGRAPHY & CTA === */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 flex flex-col justify-center"
        >
         

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#33312e] font-rethink leading-[1.05] tracking-tighter mb-6">
            The Foundation <br className="hidden md:block" /> of Our Unity.
          </h1>

          <p className="text-lg md:text-xl text-[#595652] font-poppins leading-relaxed mb-12 max-w-lg">
            The document that anchors our purpose, structures our leadership, and shapes the character of our community. Explore the foundational guidelines of DaSA.
          </p>

          {/* Call to Action Group */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8">
            <a
              href="/draftedConstitution.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 bg-zinc-900 text-white px-8 py-8 rounded-2xl font-bold text-base md:text-lg tracking-wide shadow-lg shadow-dasadeep/20  transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-dasadeep/30"
            >
              <MdFileDownload className="size-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
              <span>Download PDF</span>
            </a>
            
            {/* Metadata File Info */}
            <div className="flex flex-col border-l-2 border-[#33312e]/10 pl-5">
              <span className="text-sm font-bold text-[#2f2d2b] font-rethink tracking-wide">
                Latest Version
              </span>
              <span className="text-xs text-[#5c5955] font-mono mt-1 uppercase tracking-wider">
                PDF format &bull; 2.4 MB
              </span>
            </div>
          </div>
        </motion.div>

        {/* === RIGHT COLUMN: IMAGE & ACCENTS === */}
         <motion.div 
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 lg:col-start-8 relative"
        >
          {/* 
            By removing the forced aspect ratio and absolute inset, 
            the container perfectly wraps the image. object-contain now 
            scales it naturally without leaving empty bordered space.
          */}
          <div className="relative w-full max-w-[280px] lg:max-w-sm mx-auto z-10 group">
            
            {/* Offset Decorative Frame perfectly matching the image size */}
            <div className="absolute inset-0 translate-x-6 translate-y-6 md:translate-x-8 md:translate-y-8 rounded-[2rem] border-2 border-[#161412]/10 z-0 transition-transform duration-500  "></div>
            
            {/* Main Image */}
            <div className="relative w-full aspect-[3/4] z-10">
              <Image
                src="https://i.ibb.co/nqZ0QJYf/winners-brain-Made-with-Poster-My-Wall.jpg"
                alt="DaSA Constitution Cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain rounded-[2rem] shadow-2xl"
              />
            </div>

            {/* Floating Glassmorphism Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-8 -left-8 md:-bottom-10 md:-left-12 z-20 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl flex items-center gap-5 border border-white"
            >
              <div className="w-14 h-14 bg-[#f9f7f4] rounded-full flex items-center justify-center border border-[#161412]/5">
                <span className="font-rethink font-black text-[#161412] text-lg tracking-widest">
                  UG
                </span>
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#161412] font-rethink tracking-wide">
                  Established
                </p>
                <p className="text-xs text-[#5c5955] font-poppins mt-1">
                  Student Constitution
                </p>
              </div>
            </motion.div>
            
          </div>
        </motion.div>

      </div>
    </section>
  );
}
