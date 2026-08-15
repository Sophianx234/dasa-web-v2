"use client";
import React, { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { User, Mail, BookOpen, MapPin, Phone, Camera, Save, Loader2, CheckCircle2 } from "lucide-react";
import FormInput from "@/components/features/ui/FormInput";
import Select from "@/components/features/ui/Select";
import { motion } from "framer-motion";
import { updateUserAction } from "@/app/actions/apiActions";
import { useAppStore } from "@/store";
import { setUser } from "@/components/features/slices/navSlice";

type AccountFormValues = {
  fullName: string;
  email: string;
  contact: string;
  hall: string;
  course: string;
  sex: string;
};

export default function AccountClient({ initialUser }: { initialUser: any }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormValues>({
    defaultValues: {
      fullName: initialUser?.fullName || "",
      email: initialUser?.email || "",
      contact: initialUser?.contact || "",
      hall: initialUser?.hall || "",
      course: initialUser?.course || "",
      sex: initialUser?.sex || "",
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [profileImage, setProfileImage] = useState(initialUser?.profileImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "dasa_preset";
      formData.append("upload_preset", uploadPreset);
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dtytb8qrc";
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const uploadRes = await fetch(cloudinaryUrl, { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Failed to upload image to Cloudinary");

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.secure_url;

      // Automatically save new profile image to backend
      const res = await updateUserAction("", { profileImage: imageUrl });
      if (res?.status === "success") {
        setProfileImage(imageUrl);
        setUser(res.data);
        setSuccessMsg("Profile picture updated successfully!");
      } else {
        throw new Error(res?.message || "Failed to update profile image in database");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit: SubmitHandler<AccountFormValues> = async (data) => {
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await updateUserAction("", data);
      if (res?.status === "success") {
        setSuccessMsg("Account details updated successfully!");
        setUser(res.data); // Update global store
      } else {
        setErrorMsg(res?.message || "Failed to update account details");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-12 md:pt-2">
      <div className="bg-white rounded-3xl   border border-zinc-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-zinc-900 px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-dasadeep via-zinc-900 to-zinc-900" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            
            {/* Avatar Upload */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-zinc-800 shadow-lg">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <User size={48} />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 p-3 rounded-full bg-dasadeep text-white shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold font-montserrat mb-2">My Account</h1>
              <p className="text-zinc-400 text-sm max-w-md">
                Update your personal information, contact details, and academic profile here.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-12">
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 border border-green-100">
              <CheckCircle2 className="w-5 h-5" /> {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 border border-red-100">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-100 font-bold">!</span> {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input
                    type="text"
                    {...register("fullName", { required: "Full name is required" })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-dasadeep/20 focus:border-dasadeep outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>

              {/* Email (Disabled) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input
                    type="email"
                    {...register("email")}
                    disabled
                    className="w-full bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-xl py-3 pl-12 pr-4 text-sm cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input
                    type="tel"
                    {...register("contact", { required: "Contact is required" })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-dasadeep/20 focus:border-dasadeep outline-none transition-all"
                    placeholder="020 000 0000"
                  />
                </div>
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
              </div>
              
              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Gender</label>
                <select
                  {...register("sex", { required: "Gender is required" })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-dasadeep/20 focus:border-dasadeep outline-none transition-all appearance-none"
                >
                  <option value="" disabled hidden>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.sex && <p className="text-red-500 text-xs mt-1">{errors.sex.message}</p>}
              </div>

              {/* Course */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Course of Study</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input
                    type="text"
                    {...register("course")}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-dasadeep/20 focus:border-dasadeep outline-none transition-all"
                    placeholder="BSc Computer Science"
                  />
                </div>
              </div>
              
              {/* Hall */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Hall </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <input
                    type="text"
                    {...register("hall")}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-dasadeep/20 focus:border-dasadeep outline-none transition-all"
                    placeholder="Legon Hall"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end border-t border-zinc-100">
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-opacity-90 text-white font-bold py-3.5 px-8 rounded-full  transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
