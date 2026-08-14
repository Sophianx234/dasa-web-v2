"use client";

import React, { useState, useEffect } from "react";
import { HashLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // When the component mounts on the client, we wait a moment for the DOM to be ready
    // You can adjust the timeout if you want the splash screen to show longer
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading simulation for smooth visual transition

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="global-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex justify-center items-center h-[100dvh] w-screen bg-[#f9f7f4]"
        >
          <HashLoader loading={true} color="#18181B" size={80} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
