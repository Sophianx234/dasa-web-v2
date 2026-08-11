"use client";
import React from "react";
import { motion } from "framer-motion";

type AboutParagraphProps = {
  title?: string;
  content: string;
  index: number;
  total?: number;
  image: string; 
};

function AboutParagraph({ title, content, index, total = 5, image }: AboutParagraphProps) {
  const formattedIndex = (index + 1).toString().padStart(2, "0");

  return (
    <motion.div 
      className="sticky w-full origin-top"
      style={{ 
        // 40px leaves a very clear, solid strip of the previous card visible
        top: `calc(15vh + ${index * 40}px)`,
      }}
    >
      <div className="bg-white w-full md:h-[75vh] rounded-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col md:flex-row items-stretch relative overflow-hidden transition-all duration-500">
        
        {/* Left/Top column: Image (Now contained in a framed container) */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0 p-4 md:p-8 flex flex-col">
          <div className="w-full h-full relative rounded-[2rem] overflow-hidden bg-gray-50 shadow-inner">
            <img 
              src={image} 
              alt={title || "DaSA Section Image"} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
          </div>
        </div>

        {/* Right column: Content */}
        <div className="w-full md:w-3/5 p-8 md:p-12 lg:p-16 relative z-10 flex flex-col justify-center bg-white overflow-y-auto scrollbar-hide">
          <div className="mb-6 flex items-center gap-4">
            <span className="text-dasadeep font-mono text-xs md:text-sm tracking-widest font-bold uppercase border border-dasadeep/20 px-4 py-1.5 rounded-full bg-dasalight/30 shadow-sm">
              {formattedIndex} / {total.toString().padStart(2, "0")}
            </span>
          </div>
          
          {title && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#33312e] font-rethink leading-tight mb-6">
              {title}
            </h2>
          )}
          <p className="text-base md:text-lg leading-relaxed md:leading-[1.8] text-[#33312e]/75 font-poppins">
            {content}
          </p>
        </div>
        
      </div>
    </motion.div>
  );
}

export default AboutParagraph;
