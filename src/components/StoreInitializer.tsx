"use client";
import { useRef } from "react";
import { setIsLoggedIn, setUser } from "./features/slices/navSlice";

export default function StoreInitializer({ user }: { user: any }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    if (user) {
      setIsLoggedIn(true);
      setUser(user);
    } else {
      setIsLoggedIn(false);
      setUser({});
    }
    initialized.current = true;
  }
  return null;
}
