"use client";

import React, { useState, useEffect } from "react";
import NavigationWrapper from "@/components/features/ui/NavigationWrapper";
import Footer from "@/components/features/ui/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MessageSquareDashed, Clock, RefreshCw, Quote } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { postAnonymousMessage, getAnonymousMessages } from "@/actions/anonymous";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { dagbaniNames } from "@/lib/data/dagbaniNames";
import Pusher from "pusher-js";

dayjs.extend(relativeTime);

type Message = {
  _id: string;
  message: string;
  authorName: string;
  avatarUrl: string;
  createdAt: string;
};

type Identity = {
  name: string;
  avatar: string;
  meaning: string;
};

export default function AnonymousPage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  const generateIdentity = () => {
    const randomIndex = Math.floor(Math.random() * dagbaniNames.length);
    const selected = dagbaniNames[randomIndex];
    const seed = selected.name.replace(/\s+/g, '');
    const newIdentity = {
      name: selected.name,
      meaning: selected.meaning,
      avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=f9f7f4`
    };
    localStorage.setItem("anonymous_identity", JSON.stringify(newIdentity));
    setIdentity(newIdentity);
    return newIdentity;
  };

  // Initialize Secret Identity
  useEffect(() => {
    let savedIdentity = localStorage.getItem("anonymous_identity");
    if (savedIdentity) {
      setIdentity(JSON.parse(savedIdentity));
    } else {
      generateIdentity();
    }
  }, []);

  const handleShuffle = () => {
    generateIdentity();
    toast.success("Identity Shuffled!", {
      icon: "🎲",
      style: {
        borderRadius: "12px",
        background: "#33312e",
        color: "#fff",
      },
    });
  };

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await getAnonymousMessages();
      if (res.success && res.data) {
        setMessages(res.data);
      }
      setIsLoading(false);
    };
    fetchMessages();
  }, []);

  // Initialize Pusher Presence Channel
  useEffect(() => {
    if (!identity) return;
    
    // Enable pusher logging for debugging in dev if needed
    // Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
      auth: {
        params: {
          name: identity.name,
          avatar: identity.avatar,
        },
      },
    });

    const channel = pusher.subscribe("presence-anonymous");

    channel.bind("pusher:subscription_succeeded", (members: any) => {
      // Object containing all currently subscribed members
      const users = Object.keys(members.members).map(id => members.members[id]);
      setActiveUsers(users);
    });

    channel.bind("pusher:member_added", (member: any) => {
      setActiveUsers((prev) => {
        if (prev.find(u => u.name === member.info.name)) return prev;
        return [...prev, member.info];
      });
    });

    channel.bind("pusher:member_removed", (member: any) => {
      setActiveUsers((prev) => prev.filter(u => u.name !== member.info.name));
    });

    // Listen for new chat messages from any user
    channel.bind("new-message", (newMsg: Message) => {
      setMessages((prev) => {
        // Prevent duplicates in case the user is the author and we already pushed it locally
        if (prev.find(m => m._id === newMsg._id)) return prev;
        return [newMsg, ...prev];
      });
    });

    return () => {
      pusher.unsubscribe("presence-anonymous");
      pusher.disconnect();
    };
  }, [identity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please write something before sending.");
      return;
    }
    if (!identity) return;

    setIsSubmitting(true);
    
    // Save to DB via Server Action
    const res = await postAnonymousMessage(message, identity.name, identity.avatar);
    
    if (res.success && res.data) {
      toast.success("Your secret is safe with us!", {
        style: {
          borderRadius: "12px",
          background: "#33312e",
          color: "#fff",
        },
      });
      // Add new message to the top of the list instantly (but check for duplicates in case Pusher already delivered it)
      setMessages((prev) => {
        if (prev.find(m => m._id === res.data._id)) return prev;
        return [res.data, ...prev];
      });
      setMessage("");
    } else {
      toast.error(res.error || "Failed to send message. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="text-stone-900 min-h-screen scrollbar-hide w-full bg-[#f9f7f4] flex flex-col">
      
      <main className="flex-grow pt-10 pb-24 px-6 relative">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-dasadeep/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-80 left-10 w-[400px] h-[400px] bg-zinc-900/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
          {/* Active Users Horizontal Scroll */}
          {activeUsers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl mx-auto mb-8 bg-white/60 backdrop-blur-md p-4 rounded-3xl  border border-white flex items-center gap-4 overflow-x-auto scrollbar-hide"
            >
              <div className="flex gap-3 px-2">
                <AnimatePresence>
                  {activeUsers.map((user, idx) => (
                    <motion.div 
                      key={`${user.name}-${idx}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="relative flex-shrink-0 cursor-pointer group"
                      title={user.name}
                    >
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full bg-gray-50 border-2 border-white shadow ring-2 ring-transparent group-hover:ring-dasadeep transition-all duration-300"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 max-w-2xl"
          >
           
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-rethink text-gray-900 leading-[1.1] mb-4 tracking-tighter">
              Speak Your Mind. <br className="hidden md:block" />
              <span className="text-dasadeep">Completely Secret.</span>
            </h1>
            <p className="text-gray-500 font-poppins text-sm md:text-base leading-relaxed max-w-lg mx-auto">
              Share confessions, constructive feedback, or random thoughts. We assign you a secret identity so you can post safely.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.2 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-gray-200/60 border border-white relative overflow-visible w-full max-w-2xl mb-24"
          >
            {/* Identity Badge */}
            {identity && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-auto md:right-10 bg-white px-5 py-2.5 rounded-full shadow-lg shadow-gray-200/60 border border-gray-100 flex items-center gap-3 z-20 group"
              >
                <img src={identity.avatar} alt="Secret Avatar" className="w-8 h-8 rounded-full bg-[#f9f7f4]" />
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-bold font-rethink text-gray-700 whitespace-nowrap">
                    Posting as: <span className="text-dasadeep">{identity.name}</span>
                  </span>
                  {identity.meaning && identity.meaning !== "Unspecified" && (
                    <span className="text-[10px] font-medium text-gray-400 font-poppins hidden md:block">
                      {identity.meaning}
                    </span>
                  )}
                </div>
                
                {/* Shuffle Button */}
                <button 
                  onClick={handleShuffle}
                  className="ml-2 p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-dasadeep transition-colors"
                  title="Shuffle Identity"
                  type="button"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Soft inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-dasadeep/30 to-transparent overflow-hidden rounded-t-[2.5rem]"></div>

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col h-full mt-4 md:mt-0">
              
              <div className="relative mb-6">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your anonymous message here..."
                  className="w-full min-h-[160px] max-h-[300px] bg-[#f9f7f4] border-0 focus:ring-2 focus:ring-dasadeep/50 rounded-3xl p-6 md:p-8 text-lg font-poppins text-gray-800 placeholder:text-gray-300 resize-y transition-all outline-none"
                  style={{ lineHeight: 1.6 }}
                />
                
                {/* Character Count */}
                <div className="absolute bottom-4 right-6 text-xs font-bold text-gray-400 font-rethink select-none">
                  {message.length} <span className="font-normal opacity-50">chars</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 font-rethink tracking-wider uppercase">
                  <Sparkles className="w-4 h-4 text-dasadeep" />
                  No Real Names
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !identity}
                  className="w-full sm:w-auto group relative flex items-center justify-center gap-3 py-4 px-8 rounded-full font-bold bg-zinc-900 text-white hover:bg-black transition-all duration-300 shadow-sm  disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                >
                  <span className="relative z-10 font-rethink tracking-wide">
                    {isSubmitting ? "Sending..." : "Send Secret"}
                  </span>
                  {!isSubmitting && (
                    <Send className="relative z-10 w-4 h-4 transition-transform duration-300 " />
                  )}
                  
                  <div className="absolute inset-0 bg-dasadeep translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                </button>
              </div>

            </form>
          </motion.div>

          {/* Wall of Secrets Header */}
          <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-200/60 gap-4">
            <h2 className="text-2xl md:text-3xl font-black font-rethink text-zinc-900">
              Wall of Secrets
            </h2>
            <div className="flex gap-3 items-center">
              {activeUsers.length > 0 && (
                <div className="bg-green-50 text-green-700 font-bold font-rethink text-xs px-4 py-2 rounded-full border border-green-200/50 flex items-center gap-2 ">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  {activeUsers.length} Online Now
                </div>
              )}
              <span className="bg-white text-dasadeep font-bold font-poppins text-sm px-4 py-2 rounded-full  border border-gray-100">
                {messages.length} Messages
              </span>
            </div>
          </div>

          

          {/* Messages Feed */}
          <div className="w-full max-w-7xl">

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-dasadeep/30 border-t-dasadeep rounded-full animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-poppins">No messages yet. Be the first to break the ice!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pt-4">
                <AnimatePresence>
                  {messages.map((msg) => {
                    const isMe = identity && msg.authorName === identity.name;
                    
                    return (
                      <motion.div
                        key={msg._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", bounce: 0.2 }}
                        className={`flex gap-3 md:gap-4 w-full ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0 mt-1">
                          <img 
                            src={msg.avatarUrl || `https://api.dicebear.com/9.x/adventurer/svg?seed=fallback&backgroundColor=f9f7f4`} 
                            alt="avatar" 
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white object-cover shadow-sm ring-2 ring-gray-100/50" 
                          />
                        </div>

                        {/* Message Content */}
                        <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                          
                          {/* Header (Name & Time) */}
                          <div className={`flex items-end gap-2 mb-1.5 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="font-bold font-rethink text-sm md:text-[15px] text-zinc-900 leading-none">
                              {msg.authorName || "Anonymous User"}
                            </span>
                            <span className="text-[10px] md:text-[11px] font-bold text-gray-400  tracking-wider font-rethink leading-none mb-[1px]">
                              {dayjs(msg.createdAt).fromNow()}
                            </span>
                          </div>

                          {/* Chat Bubble */}
                          <div className={`px-6 py-5  transition-shadow duration-300 ${
                            isMe 
                              ? 'bg-zinc-900 text-white rounded-3xl rounded-tr-sm hover:shadow-md' 
                              : 'bg-white text-zinc-800 rounded-3xl rounded-tl-sm border border-gray-100 hover:shadow-md'
                          }`}>
                            <p className={`font-poppins leading-[1.7] text-[15px] whitespace-pre-wrap ${isMe ? 'text-gray-100' : 'text-zinc-700'}`}>
                              {msg.message}
                            </p>
                          </div>
                          
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </main>
      
      <Toaster position="bottom-right" />
    </div>
  );
}
