"use client";
import { useState, useEffect, useRef } from "react";
import { IoMenu, IoHeart, IoClose } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { toggleNav, setIsLoggedIn, setUser } from "../slices/navSlice";
import { DasaLogo } from "./DasaLogo";
import { HandHeart, User, ChevronDown, LogOut } from "lucide-react";
import { useAppStore } from "@/store";
import { logoutAction } from "@/app/actions/apiActions";

const bannerEvents = [
  {
    icon: "🎉",
    text: "Upcoming DaSA National Conference 2026.",
    linkText: "Register now!",
    linkUrl: "/contact",
  },
  {
    icon: "🏆",
    text: "Join us for the Annual Dinner and Awards Night.",
    linkText: "Get Tickets",
    linkUrl: "/contact",
  },
];

// --------------------------------------------------------
// HEADER COMPONENT (Default Export)
// --------------------------------------------------------
export default function Header() {
  const [showBanner, setShowBanner] = useState(true);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  
  const { isLoggedIn, user } = useAppStore((state) => state.nav);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    setIsLoggedIn(false);
    setUser({});
  };

  // Rotate banner text every 5 seconds
  useEffect(() => {
    if (!showBanner) return;
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % bannerEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [showBanner]);

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty('--header-height', `${headerRef.current.offsetHeight}px`);
      }
    };
    // small timeout to ensure DOM is painted
    setTimeout(updateHeight, 0);
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [showBanner]);

  // Navigation Links Array
  // Added an 'isDummy' flag for links that shouldn't navigate anywhere yet
  const navItems: { name: string; path: string; isDummy?: boolean }[] = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Anonymous", path: "/anonymous" },
    { name: "Dues", path: "/dues",  },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header ref={headerRef} className="sticky left-0 right-0 top-0 z-50 flex flex-col">
      {/* -------------------------------------------------------- */}
      {/* NOTIFICATION BANNER */}
      {/* -------------------------------------------------------- */}
      {showBanner && (
        <div className="w-full bg-zinc-900 text-white px-4 py-2.5 flex items-center justify-center relative shadow-sm min-h-[40px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentEventIndex}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-xs md:text-sm font-medium font-poppins text-center pr-8"
            >
              <span className="mr-2 hidden sm:inline">{bannerEvents[currentEventIndex].icon}</span>
              {bannerEvents[currentEventIndex].text}{" "}
              <Link href={bannerEvents[currentEventIndex].linkUrl} className="underline font-bold text-dasadeep hover:text-white transition-colors ml-1">
                {bannerEvents[currentEventIndex].linkText}
              </Link>
            </motion.p>
          </AnimatePresence>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* MAIN NAVBAR */}
      {/* -------------------------------------------------------- */}
      <div className="w-full bg-[#FEF3E7]/80 backdrop-blur-md border-b border-zinc-200/50 shadow-sm transition-all duration-300">
        <div className="max-w-[90rem] mx-auto flex items-center justify-between px-3 sm:px-8 h-[5.6rem]">
        
        {/* Logo Section */}
        <DasaLogo 
          title="Dagbon Students Association" 
          clns="group-hover:opacity-80 transition-opacity duration-300" 
        />

        {/* Desktop Navigation (Hidden on Mobile) */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            
            // Render a dead link with active hover styles if 'isDummy' is true
            if (item.isDummy) {
              return (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => e.preventDefault()} // Stops navigation entirely
                  className="relative text-sm font-semibold tracking-wide py-2 transition-colors duration-300 group text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  {item.name}
                  {/* Animated Bottom Border */}
                  <span className="absolute bottom-0 left-0 h-[2px] bg-dasadeep transition-all duration-300 w-0 group-hover:w-full" />
                </a>
              );
            }

            // Render standard Next Link for routes
            const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`relative text-sm font-semibold tracking-wide py-2 transition-colors duration-300 group ${
                  isActive ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {item.name}
                {/* Animated Bottom Border */}
                <span 
                  className={`absolute bottom-0 left-0 h-[2px] bg-dasadeep transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} 
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-3 lg:gap-4">
          
          {/* Desktop Donation Button */}
          <Link
            href="/dues?tab=donation"
                     className="hidden sm:flex items-center justify-center gap-2 bg-dasadeep text-white font-bold text-sm py-2.5 px-6 rounded-full  transition-all duration-300  group"
          >
            <HandHeart className="w-4 h-4  transition-transform duration-300" />
            Make Donation
          </Link>

          {/* User Profile / Login */}
          {isLoggedIn ? (
            <div className="relative hidden sm:flex items-center h-full z-50" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900 font-bold text-sm transition-colors duration-300 focus:outline-none"
              >
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt="User Avatar" 
                    className="w-9 h-9 rounded-full object-cover border border-zinc-200" 
                  />
                ) : (
                  <User className="w-[22px] h-[22px]" strokeWidth={1.5} />
                )}
                <div className="truncate max-w-[100px]">
                  <span>Hello, </span>
                  {user?.fullName ? user.fullName.split(" ")[0] : "Account"}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 text-zinc-400 ${isUserMenuOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
              </button>

              <div className={`absolute top-[3.5rem] right-0 pt-2 w-48 transition-all duration-300 ${isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className={`relative bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden flex flex-col transform transition-transform duration-300 ${isUserMenuOpen ? 'translate-y-0' : 'translate-y-2'}`}>
                    <Link href="/account" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <button onClick={() => { handleLogout(); setIsUserMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                       <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center justify-center bg-zinc-900 text-[#FEF3E7] font-bold text-sm py-2.5 px-7 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => toggleNav()}
            className="lg:hidden p-2 rounded-xl text-zinc-800 hover:text-zinc-900 transition-all duration-300 active:scale-95"
            aria-label="Open Menu"
          >
            <IoMenu className="w-7 h-7" />
          </button>
        </div>
      </div>
      </div>
    </header>
  );
}