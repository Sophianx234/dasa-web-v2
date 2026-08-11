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
        top: `calc(10vh + ${index * 24}px)`,
        willChange: "transform, opacity"
      }}
    >
      <div 
        className={`${bgColor} w-full h-auto md:h-[var(--card-height)] rounded-[2.5rem] ${isDark ? 'border-zinc-800' : 'border-black/5'} border relative overflow-hidden flex flex-col`}
        style={{
          // Taller base height and smaller step offsets allow the cards to fit much more content
          // while still guaranteeing perfect bottom eclipsing!
          "--card-height": `calc(88vh - ${index * 24}px)`
        } as React.CSSProperties}
      >
        
        {/* Massive Centered Watermark - Pure Pinterest aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <span className={`text-[250px] md:text-[350px] lg:text-[450px] leading-none ${isDark ? 'text-white' : 'text-black'} opacity-[0.03] ${numFont}`}>
            {formattedIndex}
          </span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center h-full w-full p-8 md:p-10 lg:p-14 gap-8 lg:gap-12 overflow-hidden min-h-0">
            
            {/* TEXT COLUMN */}
            <div className="w-full md:w-1/2 flex flex-col h-full justify-center">
              
              
              
              {title && (
                <h2 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#33312e]'} font-rethink leading-[1.05] mb-4 md:mb-6 drop-shadow-sm`}>
                  {title}
                </h2>
              )}
              
              <p className={`text-base md:text-lg lg:text-xl leading-relaxed ${isDark ? 'text-zinc-300' : 'text-[#33312e]/80'} font-poppins max-w-lg`}>
                {content}
              </p>
            </div>

            {/* IMAGE COLUMN - The Tilted Editorial Polaroid */}
            <div className="w-full md:w-1/2 h-full flex items-center justify-center relative mt-10 md:mt-0 pb-10 md:pb-0">
              
              <div className=" max-w-sm lg:max-w-md aspect-[4/4] w-2xl relative z-20 transform md:rotate-3 transition-all duration-700   group cursor-pointer">
                  
                  {/* Glowing ambient blob behind the image */}
                  <div className={`absolute -inset-10 -z-10 rounded-full blur-3xl opacity-50 transition-opacity duration-700 group-hover:opacity-80 ${isDark ? 'bg-zinc-700' : 'bg-dasadeep'}`}></div>

                  {/* Physical Photo Frame */}
                  <div className="absolute inset-0 bg-white shadow-2xl rounded-2xl p-3 pb-16 ring-1 ring-black/5 flex flex-col">
                      <div className="w-full flex-grow relative rounded-xl overflow-hidden bg-gray-100">
                          <img 
                            src={image} 
                            alt={title || "DaSA Heritage"} 
                            className="w-full h-full object-cover transition-transform duration-1000 "
                          />
                          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl"></div>
                      </div>
                      
                      {/* Photo Caption */}
                      <div className="absolute bottom-5 left-0 w-full text-center flex justify-center items-center gap-2">
                        <span className="font-poppins font-semibold text-zinc-400 text-xl">Dagbon Students Association</span>
                      </div>
                  </div>

              </div>

            </div>

        </div>
      </div>
    </motion.div>
  );
}

export default AboutParagraph;
