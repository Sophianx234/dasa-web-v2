"use client";

import React, { useState } from "react";
import NavigationWrapper from "@/components/features/ui/NavigationWrapper";
import Footer from "@/components/features/ui/Footer";
import PricingCard from "@/components/features/dashboard/pricing/PricingCard";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { ArrowRight, Heart } from "lucide-react";

export default function DuesPage() {
  const [paymentMode, setPaymentMode] = useState<"Dues" | "Donation">("Dues");
  
  const paymentModes = ["Dues", "Donation"];

  const semesterPackage = [
    "One Semester Dues Payment",
    "Digital copy of DaSA magazine",
    "Opportunity for committee positions",
    "Access to general assemblies",
  ];

  const annualPackage = [
    "Full Academic Year Dues (Two Semesters)",
    "Digital copy of DaSA magazine",
    "Opportunity for committee positions",
    "Access to general assemblies",
    "Priority seating at events",
  ];

  const superPackage = [
    "Full Academic Year Dues (Two Semesters)",
    "Exclusive DaSA T-shirt",
    "Premium DaSA wristband or scarf",
    "Recognition on DaSA Wall of Support",
    "VIP Access to leadership workshops",
    "Personalized online badge",
  ];

  return (
    <div className="text-stone-900 min-h-screen scrollbar-hide w-full bg-[#f9f7f4]">
      <NavigationWrapper />
      
      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-dasadeep/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-dasadeep/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-rethink text-gray-900 leading-[1.1] mb-6 tracking-tighter">
                Simple Payment. <br/>
                <span className="text-dasadeep">Powerful Purpose.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 font-poppins leading-relaxed max-w-2xl mx-auto">
                Support the Dagbon Students Association. Whether you are paying your dues or making a generous donation, every contribution builds a stronger DaSA community.
              </p>
            </motion.div>
          </div>

          {/* === MODE SELECTOR (Ultra-Chic Borderless Design) === */}
          <div className="flex justify-start lg:justify-center mb-16 md:mb-20 overflow-x-auto scrollbar-hide">
            <div className="inline-flex gap-8 md:gap-14 pb-2 px-2 whitespace-nowrap">
              {paymentModes.map(mode => {
                const isActive = paymentMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setPaymentMode(mode as "Dues" | "Donation")}
                    className={`relative py-3 group flex flex-col items-center justify-center text-xl md:text-3xl font-rethink tracking-tight transition-all duration-500 outline-none ${
                      isActive ? "font-extrabold text-[#33312e] scale-105" : "font-medium text-zinc-400 hover:text-[#33312e]/70"
                    }`}
                  >
                    {mode}
                    
                    {/* Chic Sliding Underline Indicator */}
                    {isActive ? (
                      <motion.div
                        layoutId="activePaymentMode"
                        className="absolute -bottom-1 left-0 right-0 h-[4px] bg-[#33312e] rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    ) : (
                      <div className="absolute -bottom-1 left-1/2 right-1/2 h-[4px] bg-zinc-200 rounded-full group-hover:left-0 group-hover:right-0 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {paymentMode === "Dues" && (
              <motion.div 
                key="dues"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-10 max-w-4xl mx-auto"
              >
                <PricingCard
                  type="personal"
                  planPackage={semesterPackage}
                  badgeTitle="SEMESTER"
                  subTitle="For paying dues for a single semester." 
                  title="Semester Dues" 
                  price="35.00" 
                  image="https://i.ibb.co/XW5MRmH/photo-60-2024-10-31-06-52-36.jpg"
                />
                
                <PricingCard
                  type="standard"
                  planPackage={annualPackage}
                  badgeTitle="ANNUAL"
                  subTitle="For paying dues for the entire academic year." 
                  title="One Year Dues" 
                  price="65.00" 
                  image="https://i.ibb.co/dg27dzH/photo-32-2024-10-31-06-53-18.jpg"
                />
                
                <PricingCard
                  type="pro"
                  planPackage={superPackage}
                  badgeTitle="SUPER PACKAGE"
                  subTitle="For paying annual dues plus receiving exclusive DaSA souvenirs." 
                  title="Super Package" 
                  price="110.00" 
                  image="https://i.ibb.co/Fn3jDbD/photo-51-2024-10-31-06-52-36.jpg"
                />
              </motion.div>
            )}

            {paymentMode === "Donation" && (
              <motion.div 
                key="donation"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-xl mx-auto bg-white p-10 md:p-14 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 text-center"
              >
                <div className="mx-auto w-16 h-16 bg-dasadeep/10 text-dasadeep rounded-full flex items-center justify-center mb-8">
                  <Heart className="w-8 h-8 fill-dasadeep" />
                </div>
                <h2 className="text-3xl font-black font-rethink text-gray-900 mb-4">Support Our Vision</h2>
                <p className="text-gray-500 font-poppins mb-10 leading-relaxed text-sm md:text-base">
                  Your generous donation goes directly towards funding our projects, supporting students, and building the future of Dagbon. Thank you for making a difference.
                </p>

                <div className="space-y-6">
                  <div>
                    <input 
                      type="number" 
                      placeholder="Amount (GH₵)"
                      className="w-full text-center text-3xl font-black font-rethink bg-[#f9f7f4] border border-gray-200 focus:bg-white focus:border-dasadeep focus:ring-1 focus:ring-dasadeep rounded-2xl px-6 py-6 transition-all outline-none"
                    />
                  </div>
                  <button className="group w-full flex items-center justify-center gap-2 py-5 px-6 rounded-xl font-bold bg-dasadeep text-white hover:bg-orange-500 transition-all duration-300 shadow-md shadow-dasadeep/20 uppercase tracking-wider text-sm">
                    Donate Now
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Tagline */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center mt-24 mb-8"
          >
            <p className="text-xl md:text-2xl font-black text-gray-300 uppercase tracking-widest font-rethink">
              Be More Than a Member <span className="text-dasadeep/30 mx-4">•</span> Be a Builder
            </p>
          </motion.div>

        </div>
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}
