"use client";
import { useState, useEffect, useRef } from "react";
import { IoMenu, IoHeart, IoClose } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { toggleNav, setIsLoggedIn, setUser } from "../slices/navSlice";
import { DasaLogo } from "./DasaLogo";
import { HandHeart, User, ChevronDown, LogOut, Bell, X, CheckCheck } from "lucide-react";
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
  
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dismissedNotifs, setDismissedNotifs] = useState<string[]>([]);

  // Load dismissed notifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dasa_dismissed_notifs");
      if (stored) {
        try {
          setDismissedNotifs(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse dismissed notifications");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      import("@/actions/anonymous").then(({ getAnonymousMessages }) => {
        getAnonymousMessages().then((res) => {
          if (res?.success && res.data) {
            // Filter out any messages that the user has already dismissed
            const activeNotifs = res.data.filter((msg: any) => !dismissedNotifs.includes(msg._id));
            setNotifications(activeNotifs);
          }
        });
      });
    }
  }, [isLoggedIn, dismissedNotifs]);

  const handleClearItem = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newDismissed = [...dismissedNotifs, id];
    setDismissedNotifs(newDismissed);
    localStorage.setItem("dasa_dismissed_notifs", JSON.stringify(newDismissed));
  };

  const handleClearAll = () => {
    const allCurrentIds = notifications.map(n => n._id);
    const newDismissed = [...dismissedNotifs, ...allCurrentIds];
    setDismissedNotifs(newDismissed);
    localStorage.setItem("dasa_dismissed_notifs", JSON.stringify(newDismissed));
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 2); // 2px buffer
    }
  };

  // Check scroll on notifications load or menu toggle
  useEffect(() => {
    if (isNotifMenuOpen) {
      // Slight delay to allow DOM render
      setTimeout(checkScroll, 50);
    }
  }, [isNotifMenuOpen, notifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifMenuOpen(false);
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
            <div className="relative flex items-center gap-1 lg:gap-2 h-full z-50" ref={userMenuRef}>
              
              {/* Notification Bell */}
              <div className="relative flex items-center h-full" ref={notifMenuRef}>
                
                <button
                 onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
                  className="relative p-2 text-zinc-600 hover:text-zinc-900 transition-colors focus:outline-none rounded-full ">
                <Bell className="w-[20px] h-[20px]" strokeWidth={1.5} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1.5 font-extrabold w-3 h-3 flex items-center justify-center  text-[7px] bg-dasadeep rounded-full border border-white" >{notifications.length}</span>
                )}
              </button> 
                

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {isNotifMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-[120%] -right-16 sm:right-0 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] bg-white border border-zinc-100 rounded-2xl shadow-xl shadow-zinc-200/50 py-3 flex flex-col z-[100]"
                    >
                      <div className="px-5 pb-3 border-b border-zinc-100 mb-2 flex items-center justify-between">
                        <h3 className="font-bold font-montserrat text-zinc-800">Anonymous Messages</h3>
                        {notifications.length > 0 && (
                          <button 
                            onClick={handleClearAll}
                            className="text-xs font-medium text-dasadeep hover:text-dasadeep/80 transition-colors flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" /> Clear all
                          </button>
                        )}
                      </div>
                      <div 
                        ref={scrollContainerRef}
                        onScroll={checkScroll}
                        className="flex-1 overflow-y-auto max-h-80 px-2 py-1 [&::-webkit-scrollbar]:hidden"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                          {notifications.length === 0 ? (
                            <div className="py-6 text-center text-zinc-500 text-sm">
                              <Bell className="w-8 h-8 mx-auto text-zinc-300 mb-2" strokeWidth={1} />
                              No new messages
                            </div>
                          ) : (
                            notifications.map((msg, idx) => (
                              <Link 
                                key={msg._id || idx} 
                                href="/anonymous" 
                                onClick={() => {
                                  setIsNotifMenuOpen(false);
                                  handleClearItem(msg._id);
                                }}
                                className="flex items-start gap-3 p-3 hover:bg-zinc-50 rounded-xl cursor-pointer transition-colors mb-1 group relative"
                              >
                                {/* Avatar */}
                                <div className="flex-shrink-0 relative">
                                  {msg.avatarUrl ? (
                                    <img 
                                      src={msg.avatarUrl} 
                                      alt="Anonymous Avatar" 
                                      className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                                      <User className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
                                    </div>
                                  )}
                                  <div className="absolute -bottom-1 -right-1 bg-dasadeep rounded-full p-1 border-2 border-white">
                                    <Bell className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                  </div>
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0 pt-0.5 pr-4">
                                  <p className="text-sm text-zinc-800 leading-tight mb-1">
                                    <span className="font-bold text-zinc-900 group-hover:text-dasadeep transition-colors">
                                      {msg.authorName || "Anonymous User"}
                                    </span>{" "}
                                    <span className="text-zinc-600">texted...</span>
                                  </p>
                                  <p className="text-xs text-zinc-500 line-clamp-1 mb-1">{msg.message}</p>
                                  <span className="text-[10px] font-medium text-zinc-400">
                                    {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                
                                {/* Clear Individual Button */}
                                <button
                                  onClick={(e) => handleClearItem(msg._id, e)}
                                  className="absolute top-3 right-3 p-1.5 text-zinc-300 hover:text-zinc-600 hover:bg-zinc-200 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                  title="Dismiss notification"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </Link>
                            ))
                          )}
                        </div>
                        {/* Scroll Caret Indicator */}
                        {canScrollDown && (
                          <div className="flex justify-center items-center py-1 bg-white border-t border-zinc-50 rounded-b-2xl">
                            <ChevronDown className="w-4 h-4 text-zinc-400" strokeWidth={2} />
                          </div>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-6 w-[1px] bg-zinc-200 mx-1 hidden lg:block" />

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
                <div className="truncate hidden sm:block max-w-[70px] sm:max-w-[100px]">
                  <span className="hidden sm:inline">Hello, </span>
                  {user?.fullName ? user.fullName.split(" ")[0] : "Account"}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform hidden sm:block duration-300 text-zinc-400 ${isUserMenuOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
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
            className="lg:hidden block sm:p-2 sm:mr-0 rounded-xl text-zinc-800 hover:text-zinc-900 transition-all duration-300 active:scale-95"
            aria-label="Open Menu"
          >
            <IoMenu className="w-10 h-10" />
          </button>



        </div>
      </div>
      </div>
    </header>
  );
}