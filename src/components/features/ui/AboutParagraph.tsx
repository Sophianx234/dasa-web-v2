"use client";
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

type AboutParagraphProps = {
  title?: string;
  content: string;
  index: number;
  total?: number;
  image: string; 
  bgColor?: string;
  numFont?: string;
  isDark?: boolean;
};

function AboutParagraph({ title, content, index, total = 5, image, bgColor = "bg-white", numFont = "font-chewy", isDark = false }: AboutParagraphProps) {
  const formattedIndex = (index + 1).toString().padStart(2, "0");
  
  // High-performance intersection observer for entry animations
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15, // Trigger when 15% of the card is visible
    rootMargin: "0px 0px -50px 0px"
  });

  return (
    <motion.div 
      ref={ref}
      className="sticky w-full origin-top"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
      style={{ 
        top: `calc(15vh + ${index * 40}px)`,
        // Hardware acceleration hint
        willChange: "transform, opacity"
      }}
    >
      <div 
        className={`${bgColor} w-full h-auto md:h-[75vh] rounded-[2.5rem] ${isDark ? '' : 'border-none'} border-2 flex flex-col md:flex-row items-stretch relative overflow-hidden`}
        style={{
          // Mathematically perfect stacking height:
          // By reducing the height by the exact same amount the top is pushed down,
          // the bottom edge of EVERY card aligns at the exact same pixel!
          "--card-height": `calc(82vh - ${index * 40}px)`
        } as React.CSSProperties}
      >
        
        {/* Left/Top column: Image */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0 p-4 md:p-8 flex flex-col z-20">
          <div className="w-full h-full relative rounded-[2rem] overflow-hidden bg-white/50 border border-white/20">
            <img 
              src={image} 
              alt={title || "DaSA Section Image"} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 will-change-transform"
            />
            {/* Replaced expensive mix-blend-mode with a performant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Right column: Content */}
        <div className="w-full md:w-3/5 p-8 md:p-12 lg:p-16 relative z-10 flex flex-col overflow-hidden scrollbar-hide min-h-0">
          
          {/* Huge Fun Numbering Typography (Clipped Bottom-Right Graphic) */}
          <div className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 pointer-events-none select-none z-0 opacity-[0.12]">
            <span className={`text-[160px] md:text-[220px] lg:text-[280px] ${isDark ? 'text-white' : 'text-black'} leading-none tracking-tighter ${numFont}`}>
              {formattedIndex}
            </span>
          </div>
          
          <div className="relative z-10 my-auto pb-8 md:pb-0">
            {title && (
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#33312e]'} font-rethink leading-[1.1] mb-6`}>
                {title}
              </h2>
            )}
            <p className={`text-base md:text-xl text-justify leading-relaxed md:leading-[1.8] ${isDark ? 'text-zinc-300' : 'text-[#33312e]/80'} font-poppins`}>
              {content}
            </p>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}

export default AboutParagraph;
