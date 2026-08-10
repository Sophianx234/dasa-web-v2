"use client";
import { AnimatePresence } from "framer-motion";
import Header from "./Header";
import NavLinks from "./NavLinks";
import { useAppSelector } from "@/components/features/utils/hooks";

export default function NavigationWrapper() {
  const isOpen = useAppSelector((store: any) => store.nav.isOpen);
  return (
    <>
      <Header />
      <AnimatePresence>{isOpen && <NavLinks />}</AnimatePresence>
    </>
  );
}
