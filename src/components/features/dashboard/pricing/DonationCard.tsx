"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { getPayStackConfig } from "@/utils/paystack";
import { toast } from "react-hot-toast";
import { recordTransaction } from "@/actions/transaction";

import { useAppStore } from "@/store";

const QUICK_AMOUNTS = [1000, 2500, 5000, 10000];

export default function DonationCard() {
  const { isLoggedIn, user } = useAppStore((state) => state.nav);

  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState(isLoggedIn ? user?.email || "" : "");
  const [fullName, setFullName] = useState(isLoggedIn ? user?.fullName || "" : "");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const onSuccess = async (reference: any) => {
    console.log("Donation Successful:", reference);
    
    const res = await recordTransaction({
      type: "donation",
      amount: Number(amount),
      email,
      fullName,
      isAnonymous,
      reference: reference.reference || reference.trxref || String(Date.now()),
    });

    if (res.success) {
      toast.success(`Thank you for your generous donation!`, {
        style: {
          borderRadius: "12px",
          background: "#33312e",
          color: "#fff",
        },
      });
    } else {
      toast.error("Donation processed, but failed to record. Please contact support.");
    }
    
    // Reset form after successful donation
    setAmount("");
    setEmail("");
    setFullName("");
    setIsAnonymous(false);
  };

  const onClose = () => {
    console.log("Payment dialog closed.");
  };

  // Provide fallback email for initialization to avoid hooks errors, but we validate below
  const initializePayment = usePaystackPayment(getPayStackConfig(amount || "0", email || "donor@dasa-ug.com"));

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }
    if (!email || email === "") {
      toast.error("Please enter your email address.");
      return;
    }
    
    // In a real app, you could also send `fullName` and `isAnonymous` to your backend here
    initializePayment({ onSuccess, onClose });
  };

  return (
    <motion.div
      key="donation"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-5xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col md:flex-row overflow-hidden"
    >
      {/* Left Side: Form */}
      <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-14 flex flex-col justify-center">
        <div className="mb-8">
          
          <h2 className="text-3xl lg:text-4xl font-black font-rethink text-gray-900 mb-3 tracking-tight">Support Our Vision</h2>
          <p className="text-gray-500 font-poppins leading-relaxed text-sm">
            Your generous donation goes directly towards funding our projects, supporting students, and building the future of Dagbon.
          </p>
        </div>

        <form onSubmit={handleDonate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Full Name <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#f9f7f4] border border-gray-200 focus:bg-white focus:border-dasadeep focus:ring-1 focus:ring-dasadeep rounded-xl px-4 py-3.5 text-sm transition-all outline-none font-poppins placeholder:text-gray-400"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f9f7f4] border border-gray-200 focus:bg-white focus:border-dasadeep focus:ring-1 focus:ring-dasadeep rounded-xl px-4 py-3.5 text-sm transition-all outline-none font-poppins placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Donation Amount */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Amount (GH₵) <span className="text-red-500">*</span></label>
            
            {/* Quick Select Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className={`py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 font-rethink
                    ${amount === amt.toString() 
                      ? 'bg-dasadeep text-white shadow-md shadow-dasadeep/20 scale-[1.02]' 
                      : 'bg-[#f9f7f4] text-gray-600 hover:bg-gray-200 border border-transparent hover:border-gray-300'
                    }`}
                >
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold font-rethink text-lg">GH₵</span>
              <input
                type="number"
                placeholder="Other Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#f9f7f4] border border-gray-200 focus:bg-white focus:border-dasadeep focus:ring-1 focus:ring-dasadeep rounded-xl pl-16 pr-5 py-4 text-xl font-black font-rethink transition-all outline-none placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-dasadeep focus:ring-dasadeep cursor-pointer accent-dasadeep"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600 font-poppins cursor-pointer select-none">
              Keep my donation anonymous
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold bg-zinc-900 text-white  transition-all duration-300 shadow-md shadow-dasadeep/20 uppercase tracking-wider text-sm"
            >
              Proceed to Donate
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </div>

      {/* Right Side: Image */}
      <div className="w-full md:w-[45%] relative min-h-[300px] md:min-h-full hidden md:block">
        <Image 
          src="https://i.ibb.co/dg27dzH/photo-32-2024-10-31-06-53-18.jpg" 
          alt="Students of Dagbon" 
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center" 
        />
        {/* Soft overlay to blend image */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/60 via-zinc-900/40 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}
