"use client";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { IoArrowBackOutline, IoLockClosedOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

import FormInput from "@/components/features/ui/FormInput";
import { DasaLogo } from "@/components/features/ui/DasaLogo";
import { useResetPassword } from "@/components/features/utils/hooks";

export type resetPassFormValues = {
  password: string;
  confirmPassword: string;
};

function ResetPasswordForm() {
  const navigate = useRouter();
  const { handlePassReset } = useResetPassword(navigate);
  const { register, handleSubmit } = useForm<resetPassFormValues>();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const onSubmit = async (body: resetPassFormValues) => {
    setErrorMsg(null);
    if (body.password !== body.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (!token) {
      setErrorMsg("Invalid or missing token");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await handlePassReset({ token, body });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const inputStyle = "bg-white border border-gray-200 hover:border-gray-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-sm transition-all";

  return (
    <div className="flex items-center justify-center h-dvh overflow-hidden bg-gray-50/50">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full min-h-screen bg-white overflow-hidden grid lg:grid-cols-[1fr_1.2fr]"
      >
        {/* === FORM SECTION === */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2 mb-8">
            <DasaLogo clns="text-sm" title="Dagbon Students Association" />
            <h1 className="font-rethink text-3xl md:text-4xl font-extrabold tracking-tight text-[#33312e] leading-[1.1]">
              Create New Password.
            </h1>
            <p className="text-[#33312e]/70 text-sm font-poppins mt-2 max-w-xs mx-auto">
              Please enter your new password below. Make sure it's secure.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto space-y-6">
            
            <div className="space-y-4">
              <FormInput
                register={register}
                inputName="password"
                type="password"
                placeholder="New password"
                style={inputStyle}
                icon={<IoLockClosedOutline className="absolute left-3 text-gray-400 text-lg pointer-events-none" />}
              />
              <FormInput
                register={register}
                inputName="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                style={inputStyle}
                icon={<IoLockClosedOutline className="absolute left-3 text-gray-400 text-lg pointer-events-none" />}
              />
            </div>

            {errorMsg && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 font-medium px-1 text-center">
                {errorMsg}
              </motion.p>
            )}

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              className={`w-full relative flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold tracking-wide uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 ${
                isSubmitting
                  ? "bg-zinc-900/70 cursor-not-allowed text-white/50"
                  : "bg-zinc-900 text-white hover:bg-black hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>

            {/* Back to Login Footer */}
            <div className="flex justify-center pt-6">
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors group"
              >
                <IoArrowBackOutline className="text-lg transform transition-transform group-hover:-translate-x-1" />
                Return to Log in
              </Link>
            </div>
            
          </form>
        </div>

        {/* === IMAGE SECTION === */}
        <div className="hidden lg:block relative bg-[#33312e] overflow-hidden group">
          <img
            src="https://i.ibb.co/fpQD24L/photo-8-2024-10-31-06-53-18.jpg"
            alt="Dagbon Students Association Security"
            className="w-full h-full object-cover opacity-80 transform transition-transform duration-1000"
          />

          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#33312e]/90 via-[#33312e]/40 to-transparent z-20"></div>
          
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
