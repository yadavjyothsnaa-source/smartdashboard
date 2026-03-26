"use client";

import { motion } from "framer-motion";
import { Orbitron } from "next/font/google";

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
        
        {/* CSS 3D Cube Container */}
        <div className="relative w-10 h-10 ml-2" style={{ perspective: "1000px" }}>
          {/* Background glow to replace the drop-shadow */}
          <div className="absolute inset-0 bg-[#10b981] opacity-40 blur-xl rounded-full" />
          
          <motion.div 
            animate={{ 
              rotateX: [45, 405],
              rotateY: [45, 405],
              y: [0, -5, 0]
            }}
            transition={{ 
              rotateX: { duration: 4, ease: "linear", repeat: Infinity },
              rotateY: { duration: 6, ease: "linear", repeat: Infinity },
              y: { duration: 2, ease: "easeInOut", repeat: Infinity }
            }}
            whileHover={{ scale: 1.25, transition: { duration: 0.3 } }}
            className="relative w-full h-full origin-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* The 6 faces of the 3D Cube */}
            <div className="absolute inset-0 border-[1.5px] border-[#34d399] bg-[#10b981]/10 flex items-center justify-center backdrop-blur-sm" style={{ transform: "rotateY(0deg) translateZ(20px)" }} />
            <div className="absolute inset-0 border-[1.5px] border-[#047857] bg-[#10b981]/10 flex items-center justify-center backdrop-blur-sm" style={{ transform: "rotateY(180deg) translateZ(20px)" }} />
            <div className="absolute inset-0 border-[1.5px] border-[#10b981] bg-[#10b981]/10 flex items-center justify-center backdrop-blur-sm" style={{ transform: "rotateY(90deg) translateZ(20px)" }} />
            <div className="absolute inset-0 border-[1.5px] border-[#059669] bg-[#10b981]/10 flex items-center justify-center backdrop-blur-sm" style={{ transform: "rotateY(-90deg) translateZ(20px)" }} />
            <div className="absolute inset-0 border-[1.5px] border-[#34d399] bg-[#10b981]/10 flex items-center justify-center backdrop-blur-sm" style={{ transform: "rotateX(90deg) translateZ(20px)" }} />
            <div className="absolute inset-0 border-[1.5px] border-[#047857] bg-[#10b981]/10 flex items-center justify-center backdrop-blur-sm" style={{ transform: "rotateX(-90deg) translateZ(20px)" }} />
          </motion.div>
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





