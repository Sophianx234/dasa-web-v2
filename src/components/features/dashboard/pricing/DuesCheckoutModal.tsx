"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ShieldCheck } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { getPayStackConfig } from "@/utils/paystack";
import { toast } from "react-hot-toast";
import { recordTransaction } from "@/actions/transaction";

type PricingPackage = {
  title: string;
  price: string;
  image?: string;
};

type DuesCheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: PricingPackage | null;
};

export default function DuesCheckoutModal({ isOpen, onClose, selectedPackage }: DuesCheckoutModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSuccess = async (reference: any) => {
    console.log("Payment Successful:", reference);
    
    const res = await recordTransaction({
      type: "dues",
      amount: Number(selectedPackage?.price || 0),
      email,
      fullName,
      phone,
      packageTitle: selectedPackage?.title,
      reference: reference.reference || reference.trxref || String(Date.now()),
    });

    if (res.success) {
      toast.success(`Payment for ${selectedPackage?.title} successful!`, {
        style: {
          borderRadius: "12px",
          background: "#33312e",
          color: "#fff",
        },
      });
    } else {
      toast.error("Payment processed, but failed to record. Please contact support.");
    }
    
    // Reset and close
    setFullName("");
    setEmail("");
    setPhone("");
    onClose();
  };

  const handleClose = () => {
    console.log("Payment dialog closed.");
  };

  const initializePayment = usePaystackPayment(
    getPayStackConfig(selectedPackage?.price || "0", email || "student@dasa-ug.com")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!phone) {
      toast.error("Please enter your phone number.");
      return;
    }
    initializePayment({ onSuccess: handleSuccess, onClose: handleClose });
  };

  if (!isOpen || !selectedPackage) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="relative w-full max-w-5xl bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close button (Absolute over image on desktop, over form on mobile if image is hidden) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Form */}
          <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-14 flex flex-col justify-center bg-white relative z-10">
            <div className="mb-8">
             
              <h2 className="text-3xl lg:text-4xl font-black font-rethink mb-3 text-gray-900 tracking-tight">Secure Checkout</h2>
              <p className="text-gray-500 font-poppins text-sm leading-relaxed">
                You are paying for the <strong className="text-gray-800">{selectedPackage.title}</strong> package.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Yussif Mutawakil"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#f9f7f4] border border-gray-200 focus:bg-white focus:border-dasadeep focus:ring-1 focus:ring-dasadeep rounded-xl px-4 py-3.5 text-sm transition-all outline-none font-poppins placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    placeholder="student@st.ug.edu.gh"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f9f7f4] border border-gray-200 focus:bg-white focus:border-dasadeep focus:ring-1 focus:ring-dasadeep rounded-xl px-4 py-3.5 text-sm transition-all outline-none font-poppins placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    placeholder="e.g. 0540000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#f9f7f4] border border-gray-200 focus:bg-white focus:border-dasadeep focus:ring-1 focus:ring-dasadeep rounded-xl px-4 py-3.5 text-sm transition-all outline-none font-poppins placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold bg-zinc-900 text-white hover:bg-black transition-all duration-300 shadow-md shadow-zinc-900/20"
                >
                  <span className="uppercase tracking-wider text-sm">Pay GH₵{selectedPackage.price}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Image */}
          <div className="w-full md:w-[45%] relative min-h-[300px] md:min-h-full hidden md:block bg-gray-100">
            <Image 
              src={selectedPackage.image || "https://i.ibb.co/wZ3SdYx2/e-5.jpg"} 
              alt={selectedPackage.title} 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center" 
            />
            {/* Soft overlay to blend image into the white form */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/40 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
