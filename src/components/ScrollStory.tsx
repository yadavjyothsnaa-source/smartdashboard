"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ScrollStory() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="relative w-full z-10 flex flex-col items-center justify-center min-h-[400vh]">
      </div>
    );
  }

  return (
    <div className="relative w-full z-10 flex flex-col overflow-hidden">
      
      {/* HERO */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-4 snap-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center max-w-4xl text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl font-sans max-w-5xl mx-auto leading-tight">
            SMART BUSINESS ANALYTICS DASHBOARD
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-white/90 mb-2 drop-shadow-lg font-sans">
            Intelligent Data Analytics.
          </p>
          <p className="text-lg text-white/60 drop-shadow-md font-sans max-w-xl mx-auto">
            Role-based insights and ML predictions for modern data teams.
          </p>
        </motion.div>
      </section>

      {/* ROLES - LEFT */}
      <section className="h-screen w-full flex items-center justify-start px-12 md:px-24 snap-center">
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: false, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="max-w-xl bg-black/20 backdrop-blur-md p-10 rounded-3xl border border-white/10"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#166534] mb-6 drop-shadow-lg font-sans">
            Tailored for your role.
          </h2>
          <p className="text-lg text-white/80 mb-4 drop-shadow-md leading-relaxed font-sans">
            <strong className="text-white">Data Analysts</strong> handle raw data, ETL processes, and run ML model predictions with full access control.
          </p>
          <p className="text-lg text-white/80 drop-shadow-md leading-relaxed font-sans">
            <strong className="text-white">Admins</strong> focus purely on high-level decision making through a curated, smart view.
          </p>
        </motion.div>
      </section>

      {/* CHAT - RIGHT */}
      <section className="h-screen w-full flex items-center justify-end px-12 md:px-24 snap-center">
        <motion.div 
          initial={{ opacity: 0, x: 100 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: false, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-right bg-black/20 backdrop-blur-md p-10 rounded-3xl border border-white/10"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#166534] mb-6 drop-shadow-lg font-sans">
            Collaborate in real-time.
          </h2>
          <ul className="text-lg text-white/80 space-y-4 drop-shadow-md leading-relaxed list-none font-sans text-right">
            <li>Integrated messaging directly connects Analysts and Admins.</li>
            <li>Instantly ask questions like "Why did sales drop?"</li>
            <li>Automated system alerts for new uploads, anomaly detection, and ready predictions.</li>
          </ul>
        </motion.div>
      </section>

      {/* VISUALIZATION - LEFT */}
      <section className="h-screen w-full flex items-center justify-start px-12 md:px-24 snap-center">
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: false, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="max-w-xl bg-black/20 backdrop-blur-md p-10 rounded-3xl border border-white/10"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#166534] mb-6 drop-shadow-lg font-sans">
            Advanced Visualization.
          </h2>
          <p className="text-lg text-white/80 mb-4 drop-shadow-md leading-relaxed font-sans">
            From data-driven to insight-driven. Analysts view basic functional charts to validate inputs.
          </p>
          <p className="text-lg text-white/80 drop-shadow-md leading-relaxed font-sans">
            Admins unlock rich visual forecasts, KPI cards, and trend comparisons powered by AI.
          </p>
        </motion.div>
      </section>

    </div>
  );
}
