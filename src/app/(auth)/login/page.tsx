"use client";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoLockClosedOutline,
  IoPersonOutline,
} from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Switch from "react-switch";
import { motion } from "framer-motion";
import FormInput from "@/components/features/ui/FormInput";
import { DasaLogo } from "@/components/features/ui/DasaLogo";
import { login } from "@/services/apiServices";
import { setIsLoggedIn, setUser } from "@/components/features/slices/navSlice";

export type loginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<loginFormValues>();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [viewPass, setViewPass] = useState<"text" | "password">("password");
  const [serverError, setServerError] = useState<string | null>(null);

  // Pre-fill email if "Remember Me" was used previously
  useEffect(() => {
    const savedEmail = localStorage.getItem("dasa_remembered_email");
    if (savedEmail) {
      setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit: SubmitHandler<loginFormValues> = async (data) => {
    setIsLoggingIn(true);
    setServerError(null);

    if (!data.email || !data.password) {
      setIsLoggingIn(false);
      return;
    }

    if (rememberMe) {
      localStorage.setItem("dasa_remembered_email", data.email);
    } else {
      localStorage.removeItem("dasa_remembered_email");
    }

    try {
      const res = await login(data);
      if (res.status === "success") {
        setIsLoggedIn(true);
        setUser(res.user);
        router.push("/dashboard");
      } else {
        setServerError(res.message || "Invalid email or password");
      }
    } catch (err: any) {
      setServerError(err.message || "Failed to log in");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleToggle = (nextChecked: boolean) => setRememberMe(nextChecked);

  return (
    <div className="w-full min-h-dvh flex items-center justify-center overflow-hidden bg-gray-50/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full sm:max-w-full bg-white overflow-hidden grid lg:grid-cols-[1fr_1.2fr] min-h-screen"
      >
        {/* === FORM SECTION === */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 max-w-sm w-full mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-2 mb-8">
              <DasaLogo clns="text-sm" title="Dagbon Students Association" />
              <h1 className="font-rethink text-3xl md:text-4xl font-bold tracking-tight text-[#33312e]">
                Welcome Back.
              </h1>
              <p className="text-[#33312e]/60 text-sm font-poppins">
                Enter your credentials to continue
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <FormInput
                register={register}
                inputName="email"
                style="bg-white border border-gray-200 focus:border-dasalight focus:ring-1 focus:ring-dasalight text-sm rounded-lg transition-all"
                icon={
                  <span className="absolute left-0 px-3 h-full flex items-center rounded-l-md pointer-events-none">
                    <IoPersonOutline className="text-gray-400 text-lg" />
                  </span>
                }
                type="email"
                placeholder="Email address"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 font-medium px-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <FormInput
                register={register}
                inputName="password"
                style="bg-white border border-gray-200 focus:border-dasalight focus:ring-1 focus:ring-dasalight text-sm rounded-lg transition-all pr-12"
                type={viewPass}
                icon={
                  <span className="absolute left-0 px-3 h-full flex items-center rounded-l-md pointer-events-none">
                    <IoLockClosedOutline className="text-gray-400 text-lg" />
                  </span>
                }
                icon2={
                  <button
                    type="button"
                    className="absolute right-0 px-3 h-full flex items-center rounded-r-lg hover:bg-gray-50 transition-colors focus:outline-none"
                    onClick={() =>
                      setViewPass((prev) =>
                        prev === "password" ? "text" : "password",
                      )
                    }
                    aria-label={
                      viewPass === "password"
                        ? "Show password"
                        : "Hide password"
                    }
                  >
                    {viewPass === "password" ? (
                      <IoEyeOutline className="text-gray-400 hover:text-gray-600 text-lg transition-colors" />
                    ) : (
                      <IoEyeOffOutline className="text-gray-400 hover:text-gray-600 text-lg transition-colors" />
                    )}
                  </button>
                }
                placeholder="Password"
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 font-medium px-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm font-poppins pt-2">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setRememberMe(!rememberMe)}
              >
                <Switch
                  onChange={handleToggle}
                  onColor="#18181B"
                  offColor="#e5e7eb"
                  uncheckedIcon={false}
                  checkedIcon={false}
                  height={20}
                  width={36}
                  handleDiameter={16}
                  checked={rememberMe}
                  className="shadow-sm"
                />
                <span className="text-[#33312e]/70 select-none">
                  Remember me
                </span>
              </div>

              <Link
                href="/forgotpassword"
                className="font-medium hover:text-zinc-900 hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {serverError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 font-medium px-1 text-center">
                {serverError}
              </motion.p>
            )}

            {/* Submit Button */}
            <button
              disabled={isLoggingIn}
              className={`w-full relative flex items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-bold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dasalight ${
                isLoggingIn
                  ? " bg-zinc-900 text-white"
                  : "bg-zinc-900 text-white"
              }`}
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Authenticating...
                </>
              ) : (
                "Log In"
              )}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-[#33312e]/60 font-poppins pt-4 border-t border-gray-100">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#33312e] font-semibold hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>

        {/* === IMAGE SECTION === */}
        <div className="hidden lg:block relative bg-[#33312e] overflow-hidden group">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#33312e]/90 via-[#33312e]/40 to-transparent z-20"></div>

          <img
            src="https://i.ibb.co/fpQD24L/photo-8-2024-10-31-06-53-18.jpg"
            alt="Dagbon Students Association Members"
            className="w-full h-full object-cover opacity-80 transform transition-transform duration-1000"
          />

          
        </div>
      </motion.div>

    </div>
  );
}
