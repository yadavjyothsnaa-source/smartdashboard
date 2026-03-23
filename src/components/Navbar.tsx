"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const { scrollY } = useScroll();
  
  // Fade in navbar background and text slightly after a small scroll
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.75]);
  const backdropBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);

  return (
    <motion.nav
      style={{
        backgroundColor: useTransform(bgOpacity, (op) => `rgba(5, 5, 5, ${op})`),
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur,
      }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-colors duration-300"
    >
      <div className="text-white/90 font-medium tracking-tight text-lg">
        SMART BUSINESS ANALYTICS DASHBOARD
      </div>
      
      <div className="hidden md:flex items-center space-x-8 text-sm text-white/60">
        <a href="#roles" className="hover:text-white transition-colors">Roles</a>
        <a href="#visualizations" className="hover:text-white transition-colors">Visualizations</a>
        <a href="#chat" className="hover:text-white transition-colors">Chat & Alerts</a>
        <a href="#ml" className="hover:text-white transition-colors">ML Predictions</a>
      </div>

      <button 
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="px-5 py-2 text-sm font-semibold text-white bg-transparent border border-[#00D6FF]/30 rounded-full hover:border-[#00D6FF] hover:shadow-[0_0_15px_rgba(0,214,255,0.3)] transition-all duration-300"
      >
        Login / System
      </button>
    </motion.nav>
  );
}
