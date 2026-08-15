"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageSlider({ images }: { images: string[] }) {
 const [[page, direction], setPage] = useState([0, 0]);

 const imageIndex = Math.abs(page % images.length);

 const paginate = (newDirection: number) => {
 setPage([page + newDirection, newDirection]);
 };

 return (
 <div className="relative w-full h-72 md:h-96 overflow-hidden bg-neutral-900">
 <AnimatePresence initial={false} custom={direction}>
 <motion.img
 key={page}
 src={images[imageIndex]}
 custom={direction}
 initial={{
 x: direction > 0 ? 300 : -300,
 opacity: 0,
 }}
 animate={{
 x: 0,
 opacity: 1,
 }}
 exit={{
 x: direction > 0 ? -300 : 300,
 opacity: 0,
 }}
 transition={{ duration: 0.4 }}
 className="w-full h-full object-cover rounded-xl"
 />
 </AnimatePresence>

 {/* Prev Button */}
 <button
 onClick={() => paginate(-1)}
 className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
 >
 <ChevronLeft />
 </button>

 {/* Next Button */}
 <button
 onClick={() => paginate(1)}
 className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
 >
 <ChevronRight />
 </button>
 </div>
 );
}
