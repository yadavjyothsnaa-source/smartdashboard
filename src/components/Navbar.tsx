"use client";

import { motion } from "framer-motion";
import { Orbitron } from "next/font/google";
import { ShieldCheck } from "lucide-react";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "900"] });

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 bg-black/60 backdrop-blur-2xl border-b border-[#10b981]/20 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.15)]"
    >
      <div className="flex items-center gap-5 cursor-pointer group">
        
        <div className="relative w-10 h-10 flex items-center justify-center bg-[#10b981]/10 rounded-xl border border-[#10b981]/30 group-hover:bg-[#10b981]/20 transition-all duration-300">
           <ShieldCheck className="text-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" size={24} strokeWidth={2.5} />
        </div>
        
        <div className={`text-lg sm:text-2xl font-black tracking-wider uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] ${orbitron.className}`}>

          <span className="text-white">SMART</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#059669]">DASHBOARD</span>
        </div>
      </div>
      
      <button 
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="px-5 py-2.5 sm:px-6 sm:py-3 text-[10px] sm:text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-[#10b981]/20 to-transparent border border-[#10b981]/50 rounded-full hover:bg-[#10b981] hover:text-[#050505] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
      >
        Login / Sign up
      </button>
    </motion.nav>
  );
}





