"use client";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import {
  IoLockClosedOutline,
  IoMailOutline,
  IoPersonOutline,
  IoBusinessOutline,
  IoCallOutline,
  IoArrowBackOutline,
  IoCameraOutline,
} from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "@/components/features/ui/FormInput";
import PrivacyPolicy from "@/components/features/ui/PrivacyPolicy";
import Select from "@/components/features/ui/Select";
import Terms from "@/components/features/ui/Terms";
import { DatePicker } from "@/components/features/ui/DatePicker";
import { DasaLogo } from "@/components/features/ui/DasaLogo";
import { signup, uploadImages, changeProfile } from "@/services/apiServices";

export type signupFormValues = {
  fullName: string;
  course: string;
  hall: string;
  email: string;
  contact: string;
  password: string;
  sex: string;
  confirmPassword: string;
  birthDate: Date;
  profilePicture?: FileList;
};

export default function SignupPage() {
  const router = useRouter();
  const { handleSubmit, register, watch, control } =
    useForm<signupFormValues>();
  

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState(1);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(
    null,
  );

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError(null);
    }
  }, [password, confirmPassword]);

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleCompleteSignup = async (data: signupFormValues) => {
    const files = data.profilePicture;
    if (!files || files.length === 0) {
      handleSkip();
      return;
    }
    
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      
      const uploadRes = await uploadImages(formData);
      if (uploadRes.status === "success") {
         const imageUrl = uploadRes.data?.secure_url || uploadRes.data?.url || uploadRes.url || "";
         if (imageUrl) {
           await changeProfile({ profileImage: imageUrl });
         }
      }
      router.push("/dashboard");
    } catch(err) {
      toast.error("Failed to upload image");
      router.push("/dashboard");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit: SubmitHandler<signupFormValues> = async (data) => {
    if (step === 1) {
      setStep(2);
      return;
    }
    
    if (step === 2) {
      if (password !== confirmPassword) {
        setPasswordMatchError("Passwords do not match");
        return;
      }
      
      setIsSigningUp(true);
      try {
        const res = await signup(data);
        if (res.status === "success") {
           if (res.token) localStorage.setItem("token", res.token);
           setStep(3);
        } else {
           toast.error(res.message || "Failed to create account");
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      } finally {
        setIsSigningUp(false);
      }
      return;
    }

    if (step === 3) {
      await handleCompleteSignup(data);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" as any },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" as any } },
  };

  const inputStyle =
    "bg-white border border-gray-200 hover:border-gray-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-sm rounded-xl transition-all";

  return (
    <div className="w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-50/50">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl sm:max-w-full bg-white overflow-hidden grid lg:grid-cols-[1fr_1.2fr] min-h-[640px] sm:min-h-dvh"
      >
        {/* === FORM SECTION === */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative border-r border-gray-100/50">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2 mb-8">
            <DasaLogo clns="text-sm" title="Dagbon Students Association" />
            <h1 className="font-rethink text-3xl md:text-4xl font-extrabold tracking-tight text-[#33312e] leading-[1.1]">
              Create Account.
            </h1>
            <p className="text-[#33312e]/70 text-sm font-poppins mt-1">
              Step {step} of 3. Already registered?{" "}
              <Link
                href="/login"
                className="text-zinc-900 font-semibold hover:underline transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>

          <Toaster
            position="top-center"
            toastOptions={{
              className: "font-poppins text-sm rounded-2xl shadow-xl",
            }}
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-sm mx-auto relative overflow-hidden px-1 py-1 -mx-1"
          >
            <AnimatePresence mode="wait">
              {/* === STEP 1: Personal Details === */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <FormInput
                    type="text"
                    register={register}
                    inputName="fullName"
                    placeholder="Full name"
                    style={inputStyle}
                    icon={
                      <IoPersonOutline className="absolute left-3 text-gray-400 text-lg" />
                    }
                  />

                  <FormInput
                    type="email"
                    register={register}
                    inputName="email"
                    placeholder="Email address"
                    style={inputStyle}
                    icon={
                      <IoMailOutline className="absolute left-3 text-gray-400 text-lg" />
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      register={register}
                      inputName="hall"
                      type="select"
                      placeholder="Hall of Residence"
                      style={inputStyle}
                      icon={
                        <IoBusinessOutline className="absolute left-3 text-gray-400 text-lg" />
                      }
                    />
                    <Controller
                      name="birthDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker type="signup" field={field} />
                      )}
                    />
                  </div>



                  <Select
                    register={register}
                    inputName="course"
                    type="select"
                    placeholder="Course"
                    style={inputStyle}
                    icon={
                      <IoBusinessOutline className="absolute left-3 text-gray-400 text-lg" />
                    }
                  />

                  <Select
                    register={register}
                    inputName="sex"
                    type="select"
                    placeholder="Gender"
                    style={inputStyle}
                    icon={
                      <IoPersonOutline className="absolute left-3 text-gray-400 text-lg" />
                    }
                  />

                  <FormInput
                    register={register}
                    inputName="contact"
                    type="tel"
                    placeholder="Contact number"
                    style={inputStyle}
                    icon={
                      <IoCallOutline className="absolute left-3 text-gray-400 text-lg" />
                    }
                  />

                  <button className="w-full mt-4 py-3.5 text-sm font-bold tracking-wide uppercase bg-zinc-900 text-white rounded-xl hover:bg-black hover:shadow-lg transition-all duration-300">
                    Continue
                  </button>
                </motion.div>
              )}

              {/* === STEP 2: Security === */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <FormInput
                    register={register}
                    inputName="password"
                    type="password"
                    placeholder="Create Password"
                    style={inputStyle}
                    icon={
                      <IoLockClosedOutline className="absolute left-3 text-gray-400 text-lg" />
                    }
                  />

                  <div className="space-y-1">
                    <FormInput
                      register={register}
                      inputName="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      style={inputStyle}
                      icon={
                        <IoLockClosedOutline className="absolute left-3 text-gray-400 text-lg" />
                      }
                    />
                    {passwordMatchError && (
                      <p className="text-xs text-red-500 font-medium px-2">
                        {passwordMatchError}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 font-poppins px-1 py-2">
                    By continuing, you agree to our{" "}
                    <span
                      className="text-zinc-900 font-semibold cursor-pointer hover:underline"
                      onClick={() => setOpenTerms(true)}
                    >
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span
                      className="text-zinc-900 font-semibold cursor-pointer hover:underline"
                      onClick={() => setOpenPrivacy(true)}
                    >
                      Privacy Policy
                    </span>
                    .
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 flex items-center justify-center text-sm font-bold bg-gray-100 text-zinc-900 rounded-xl hover:bg-gray-200 transition-all duration-300"
                    >
                      <IoArrowBackOutline className="text-lg" />
                    </button>
                    <button
                      type="submit"
                      disabled={isSigningUp}
                      className={`w-2/3 py-3.5 text-sm font-bold tracking-wide uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                        ${isSigningUp ? "bg-zinc-700 text-white/70 cursor-not-allowed" : "bg-zinc-900 text-white hover:bg-black hover:shadow-lg"}`}
                    >
                      {isSigningUp ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>

                  {openTerms && <Terms handleClose={setOpenTerms} />}
                  {openPrivacy && (
                    <PrivacyPolicy handleClose={setOpenPrivacy} />
                  )}
                </motion.div>
              )}

              {/* === STEP 3: Profile Picture === */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6 text-center"
                >
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-900">
                      Profile Picture
                    </label>
                    <p className="text-xs text-gray-500 pb-2">
                      Add a photo so your community can recognize you.
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    {...register("profilePicture")}
                    ref={(e) => {
                      register("profilePicture").ref(e);
                      fileInputRef.current = e;
                    }}
                    className="hidden"
                  />

                  <div className="flex justify-center py-4">
                    {watch("profilePicture")?.[0] ? (
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <img
                          src={URL.createObjectURL(watch("profilePicture")![0])}
                          alt="preview"
                          className="h-32 w-32 rounded-full object-cover shadow-md ring-4 ring-gray-50"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <IoCameraOutline className="text-white text-3xl" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="h-32 w-32 border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center rounded-full cursor-pointer hover:border-zinc-900 hover:bg-gray-100 transition-colors group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <IoCameraOutline className="text-gray-400 group-hover:text-zinc-900 text-3xl mb-1 transition-colors" />
                        <span className="text-[10px] text-gray-400 group-hover:text-zinc-900 font-medium uppercase tracking-wider">
                          Upload
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="w-1/3 py-3.5 flex items-center justify-center text-sm font-bold bg-gray-100 text-zinc-900 rounded-xl hover:bg-gray-200 transition-all duration-300"
                    >
                      Skip
                    </button>
                    <button
                      type="submit"
                      disabled={isUploadingImage}
                      className={`w-2/3 py-3.5 text-sm font-bold tracking-wide uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                        ${isUploadingImage ? "bg-zinc-700 text-white/70 cursor-not-allowed" : "bg-zinc-900 text-white hover:bg-black hover:shadow-lg"}`}
                    >
                      {isUploadingImage ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        "Complete Setup"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Footer */}
            <p className="text-center text-sm text-[#33312e]/60 font-poppins pt-4 mt-6 border-t border-gray-100">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#33312e] font-semibold hover:underline transition-colors"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>

        {/* === IMAGE SECTION === */}
        <div className="hidden lg:block relative bg-[#33312e] overflow-hidden group">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#33312e]/90 via-[#33312e]/40 to-transparent z-20"></div>

          <img
            src="https://i.ibb.co/XW5MRmH/photo-60-2024-10-31-06-52-36.jpg"
            alt="Dagbon Students Association Signup"
            className="w-full h-full object-cover opacity-80 transform transition-transform duration-1000"
          />

        </div>
      </motion.div>
    </div>
  );
}
