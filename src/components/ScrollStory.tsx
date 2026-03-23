"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollStory() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });

  // Hero (0 - 20%)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.2], [1, 1, 0, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // Roles (20 - 45%) - LEFT
  const engOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.4, 0.45], [0, 1, 1, 0]);
  const engX = useTransform(scrollYProgress, [0.15, 0.25], [-50, 0]);

  // Chat (45 - 70%) - RIGHT
  const ncOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.7], [0, 1, 1, 0]);
  const ncX = useTransform(scrollYProgress, [0.4, 0.5], [50, 0]);

  // Visualization (70 - 95%) - LEFT
  const soundOpacity = useTransform(scrollYProgress, [0.65, 0.75, 0.9, 0.95], [0, 1, 1, 0]);
  const soundX = useTransform(scrollYProgress, [0.65, 0.75], [-50, 0]);

  return (
    <div ref={container} className="relative w-full h-[400vh] -mt-[100vh]">
      {isMounted && (
        <div className="sticky top-0 left-0 w-full h-screen pointer-events-none flex flex-col justify-center overflow-hidden z-10">
          
          {/* HERO */}
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0 flex flex-col items-center justify-center pt-32 z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl font-sans text-center px-4">
              SmartDashboard
            </h1>
            <p className="text-2xl md:text-3xl font-medium text-white/90 mb-2 drop-shadow-lg font-sans text-center px-4">
              Intelligent Data Analytics.
            </p>
            <p className="text-lg text-white/60 drop-shadow-md font-sans text-center px-4 max-w-xl">
              Role-based insights and ML predictions for modern data teams.
            </p>
          </motion.div>

          {/* ROLES */}
          <motion.div style={{ opacity: engOpacity, x: engX }} className="absolute inset-0 flex items-center justify-start px-12 md:px-24 z-10">
            <div className="max-w-md">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 mb-6 drop-shadow-lg font-sans">
                Tailored for your role.
              </h2>
              <p className="text-lg text-white/60 mb-4 drop-shadow-md leading-relaxed font-sans">
                <strong className="text-white">Data Analysts</strong> handle raw data, ETL processes, and run ML model predictions with full access control.
              </p>
              <p className="text-lg text-white/60 drop-shadow-md leading-relaxed font-sans">
                <strong className="text-white">Admins</strong> focus purely on high-level decision making through a curated, smart view.
              </p>
            </div>
          </motion.div>

          {/* CHAT AND NOTIFICATIONS */}
          <motion.div style={{ opacity: ncOpacity, x: ncX }} className="absolute inset-0 flex items-center justify-end px-12 md:px-24 z-10">
            <div className="max-w-md text-right">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 mb-6 drop-shadow-lg font-sans">
                Collaborate in real-time.
              </h2>
              <ul className="text-lg text-white/60 space-y-4 drop-shadow-md leading-relaxed list-none font-sans">
                <li>Integrated messaging directly connects Analysts and Admins.</li>
                <li>Instantly ask questions like "Why did sales drop?"</li>
                <li>Automated system alerts for new uploads, anomaly detection, and ready predictions.</li>
              </ul>
            </div>
          </motion.div>

          {/* VISUALIZATION */}
          <motion.div style={{ opacity: soundOpacity, x: soundX }} className="absolute inset-0 flex items-center justify-start px-12 md:px-24 z-10">
            <div className="max-w-md">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 mb-6 drop-shadow-lg font-sans">
                Advanced Visualization.
              </h2>
              <p className="text-lg text-white/60 mb-4 drop-shadow-md leading-relaxed font-sans">
                From data-driven to insight-driven. Analysts view basic functional charts to validate inputs.
              </p>
              <p className="text-lg text-white/60 drop-shadow-md leading-relaxed font-sans">
                Admins unlock rich visual forecasts, KPI cards, and trend comparisons powered by AI.
              </p>
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
}
