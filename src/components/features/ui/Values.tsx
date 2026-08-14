"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const coreValues = [
  {
    id: "01",
    imgSrc: "https://i.ibb.co/pjc7DfZF/m-1.jpg",
    title: "Integrity",
    desc: "We uphold honesty, accountability, and transparency in all our actions, believing that true leadership grows from unwavering moral principles.",
    imagePosition: "left"
  },
  {
    id: "02",
    imgSrc: "https://i.ibb.co/XW5MRmH/photo-60-2024-10-31-06-52-36.jpg",
    title: "Teamwork",
    desc: "We achieve more together. Through collaboration and mutual respect, we build relationships that empower every member to contribute and succeed.",
    imagePosition: "right"
  },
  {
    id: "03",
    imgSrc: "https://i.ibb.co/fpQD24L/photo-8-2024-10-31-06-53-18.jpg",
    title: "Unity",
    desc: "We are one family, bonded by shared heritage and purpose. Our strength lies in unity and in creating a welcoming space for all.",
    imagePosition: "left"
  },
  {
    id: "04",
    imgSrc: "https://i.ibb.co/QFSYQW1j/m-3.jpg",
    title: "Growth",
    desc: "We value lifelong learning and curiosity. Through innovation and adaptability, we inspire growth within and beyond the DaSA community.",
    imagePosition: "right"
  },
];

export default function Values() {
  return (
    <section className="w-full bg- pt-24  md:pt-16 overflow-hidden">
      
      {/* === HEADER === */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 md:mb-16 flex flex-col items-center">
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-rethink text-5xl md:text-6xl lg:text-7xl  font-extrabold tracking-tighter leading-[1] mb-6"
          >
            What We <br className="hidden md:block" /> Stand For
          </motion.h2>
         
        </div>
      </div>

      {/* === SEAMLESS CHECKERBOARD Z-GRID === */}
      <div className="flex flex-col w-full">
        {coreValues.map((value, i) => {
          const isImageLeft = value.imagePosition === "left";
          return (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`flex flex-col lg:flex-row w-full ${
                isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              
              {/* Visual/Image Side */}
              <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] relative overflow-hidden group">
                <Image 
                  src={value.imgSrc} 
                  alt={value.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover scale-100  transition-transform duration-1000 ease-out"
                />
                {/* Subtle dark overlay to match the theme */}
                <div className="absolute inset-0 bg-[#161412]/20 group-hover:bg-transparent transition-colors duration-700" />
              </div>

              {/* Text Content Side */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center items-start text-left p-12 md:p-20 lg:p-32 bg-[#1c1a18]">
                
                 
                 <h3 className="font-rethink font-extrabold text-4xl md:text-5xl lg:text-6xl text-white tracking-tight mb-8">
                   {value.title}
                 </h3>
                 
                 <p className="font-poppins text-[#a39f99] text-base md:text-lg leading-[1.8] max-w-lg">
                   {value.desc}
                 </p>
              </div>

            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
