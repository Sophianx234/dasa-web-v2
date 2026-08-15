"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#222222] group-[.toaster]: group-[.toaster]:shadow-sm group-[.toaster]:rounded-2xl group-[.toaster]:font-sans",
          description:
            "group-[.toast]:text-text-muted group-[.toast]:text-[12px] group-[.toast]:tracking-wider",
          title:
            "group-[.toast]:text-[12px] group-[.toast]:uppercase group-[.toast]:tracking-wider group-[.toast]:font-bold",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:rounded-2xl group-[.toast]:text-[11px] group-[.toast]:uppercase group-[.toast]:tracking-wider group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-dasadeep/50 group-[.toast]:text-text-muted group-[.toast]:rounded-2xl group-[.toast]:text-[11px] group-[.toast]:uppercase group-[.toast]:tracking-wider group-[.toast]:font-bold",
          success: "group-[.toaster]: group-[.toaster]:",
          error: "group-[.toaster]: group-[.toaster]:",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
