"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollStory() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });

  // Calculate Opacity and Transforms based on progress [0-1]
  // Hero (0 - 15%)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.05, 0.1, 0.15], [1, 1, 0, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  // Engineering (15 - 40%)
  const engOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.35, 0.45], [0, 1, 1, 0]);
  const engX = useTransform(scrollYProgress, [0.1, 0.2], [-50, 0]);

  // Noise Cancelling (40 - 65%)
  const ncOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.6, 0.7], [0, 1, 1, 0]);
  const ncX = useTransform(scrollYProgress, [0.35, 0.45], [50, 0]);

  // Sound & Upscaling (65 - 85%)
  const soundOpacity = useTransform(scrollYProgress, [0.6, 0.7, 0.8, 0.9], [0, 1, 1, 0]);
  const soundX = useTransform(scrollYProgress, [0.6, 0.7], [-50, 0]);

  // Reassembly & CTA (85 - 100%)
  const ctaOpacity = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.8, 0.9], [50, 0]);

  return (
    <div ref={container} className="relative w-full h-[500vh] -mt-[100vh]">
      <div className="sticky top-0 left-0 w-full h-screen pointer-events-none flex flex-col justify-center overflow-hidden">
        
        {/* HERO */}
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0 flex flex-col items-center justify-center pt-32 z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl font-sans">
            Sony WH‑1000XM6
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-white/90 mb-2 drop-shadow-lg font-sans">
            Silence, perfected.
          </p>
          <p className="text-lg text-white/60 drop-shadow-md font-sans">
            Flagship wireless noise cancelling, re‑engineered for a world that never stops.
          </p>
        </motion.div>

        {/* ENGINEERING */}
        <motion.div style={{ opacity: engOpacity, x: engX }} className="absolute inset-0 flex items-center justify-start px-12 md:px-24 z-10">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 mb-6 drop-shadow-lg font-sans">
              Precision-engineered for silence.
            </h2>
            <p className="text-lg text-white/60 mb-4 drop-shadow-md leading-relaxed font-sans">
              Custom drivers, sealed acoustic chambers, and optimized airflow deliver studio-grade clarity.
            </p>
            <p className="text-lg text-white/60 drop-shadow-md leading-relaxed font-sans">
              Every component is tuned for balance, power, and comfort—hour after hour.
            </p>
          </div>
        </motion.div>

        {/* NOISE CANCELLING */}
        <motion.div style={{ opacity: ncOpacity, x: ncX }} className="absolute inset-0 flex items-center justify-end px-12 md:px-24 z-10">
          <div className="max-w-md text-right">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 mb-6 drop-shadow-lg font-sans">
              Adaptive noise cancelling, redefined.
            </h2>
            <ul className="text-lg text-white/60 space-y-4 drop-shadow-md leading-relaxed list-none font-sans">
              <li>Multi-microphone array listens in every direction.</li>
              <li>Real-time noise analysis adjusts to your environment.</li>
              <li>Your music stays pure—planes, trains, and crowds fade away.</li>
            </ul>
          </div>
        </motion.div>

        {/* SOUND */}
        <motion.div style={{ opacity: soundOpacity, x: soundX }} className="absolute inset-0 flex items-center justify-start px-12 md:px-24 z-10">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 mb-6 drop-shadow-lg font-sans">
              Immersive, lifelike sound.
            </h2>
            <p className="text-lg text-white/60 mb-4 drop-shadow-md leading-relaxed font-sans">
              High-performance drivers unlock detail, depth, and texture in every track.
            </p>
            <p className="text-lg text-white/60 drop-shadow-md leading-relaxed font-sans">
              AI-enhanced upscaling restores clarity to compressed audio, so every note feels alive.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-auto">
          <div className="text-center bg-[#050505]/40 backdrop-blur-md p-12 rounded-3xl border border-white/5 mx-6 shadow-2xl">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl font-sans">
              Hear everything. Feel nothing else.
            </h2>
            <p className="text-xl text-white/70 mb-10 drop-shadow-lg font-sans">
              WH‑1000XM6. Designed for focus, crafted for comfort.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#0050FF] to-[#00D6FF] rounded-full hover:shadow-[0_0_20px_rgba(0,214,255,0.4)] transition-all duration-300 transform hover:scale-105 pointer-events-auto cursor-pointer font-sans">
                Experience WH‑1000XM6
              </button>
              <a href="#specs" className="text-lg font-medium text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-white pointer-events-auto font-sans">
                See full specs
              </a>
            </div>
            <p className="mt-8 text-sm text-white/40 max-w-sm mx-auto font-sans">
              Engineered for airports, offices, and everything in between.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
