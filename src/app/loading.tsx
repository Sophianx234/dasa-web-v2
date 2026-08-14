"use client";

import React from "react";
import { HashLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-[#f9f7f4]">
      <HashLoader loading={true} color="#18181B" size={80} />
    </div>
  );
}
