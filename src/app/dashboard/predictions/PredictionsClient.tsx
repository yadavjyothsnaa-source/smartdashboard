"use client";

import RealTimePredictor from "@/components/RealTimePredictor";
import type { MlPrediction } from "@/lib/db";
import { motion } from "framer-motion";
import { Brain, Database, ShieldCheck, Activity, BarChart3, Clock, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function PredictionsClient({ session, predictions }: { session: any, predictions: MlPrediction[] }) {
  const isAdmin = session.role === "admin";
  const { theme } = useTheme();

  const safeParse = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse prediction result:", jsonStr);
      return null;
    }
  };

  const titleFont = "font-black tracking-tight";

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 md:px-0 mt-8">
      
      {/* Refined Stylish Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${theme === 'forest' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-[var(--accent)]'} animate-pulse`} />
            <p className="text-[9px] text-[var(--muted)] font-black uppercase tracking-[0.3em] opacity-40">{new Date().toLocaleDateString('en-GB')}</p>
          </div>
          <h1 className={`text-4xl md:text-5xl ${titleFont} text-[var(--foreground)]`}>
            {isAdmin ? "Oracle Core." : "Forecasts."}
          </h1>
          <p className="text-sm md:text-base text-[var(--foreground)] font-bold opacity-50 max-w-lg leading-relaxed">
            Neural oscillations mapped via RandomForest protocols. Strategic insights prioritized.
          </p>
        </div>
        
        <div className={`flex items-center gap-4 bg-[var(--card-bg)] border border-white/10 p-5 px-8 rounded-[2.5rem] shadow-sm group ${theme === 'forest' ? 'hover:bg-green-950/20' : 'hover:bg-[#f1ffe2]/20'} transition-all duration-500`}>
          <Activity size={20} className="text-[var(--accent)] group-hover:scale-110 transition-transform" />
          <div>
            <p className="text-[8px] font-black text-[var(--muted)] uppercase tracking-widest opacity-50">Model Engine</p>
            <p className="text-xs font-black text-[var(--foreground)] tracking-tight whitespace-nowrap">v4 RandomForest Active</p>
          </div>
        </div>
      </div>

      <RealTimePredictor />
      
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h3 className={`text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.3em] opacity-40`}>Intelligence Archives</h3>
          <div className="h-[1px] flex-1 ml-6 bg-black/5" />
        </div>
        
        {predictions.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center bg-[var(--card-bg)] border border-white/5 rounded-[4rem] opacity-40">
            <BarChart3 size={40} className="text-[var(--accent)] mb-6" />
            <p className="text-lg font-black text-[var(--foreground)] tracking-tight">Archives Empty</p>
            <p className="text-xs text-[var(--muted)] mt-2 font-black uppercase tracking-widest opacity-60">Inject signal to trigger log</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictions.map((p, i) => {
              const r = safeParse(p.result);
              if (!r) return null;
              const isUp = r.trend.toLowerCase() === 'upward';
              
              return (
                <motion.div 
                   key={p.id} 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className={`p-10 rounded-[3rem] bg-[var(--card-bg)] border border-white/5 hover:shadow-2xl ${theme === 'forest' ? 'hover:bg-green-950/40' : 'hover:bg-[#f1ffe2]/40'} transition-all duration-700 relative group overflow-hidden`}
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-[var(--muted)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all shadow-sm">
                        <Clock size={16} />
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-[var(--muted)] uppercase tracking-[0.2em] block mb-1 opacity-50">Transmission ID</span>
                        <span className="text-sm font-black text-[var(--foreground)] tracking-tight italic">SYNC-{p.id.toString().slice(-6)}</span>
                      </div>
                    </div>
                    <div className={`px-5 py-2.5 rounded-2xl text-[8px] font-black uppercase tracking-widest ${isUp ? 'bg-[var(--accent)] text-white shadow-xl' : 'bg-red-600 text-white shadow-xl'}`}>
                      {r.trend}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-10 mb-10">
                    <div>
                      <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest block mb-1 opacity-50">Confidence</span>
                      <div className={`text-2xl font-black text-[var(--foreground)] tracking-tighter`}>{r.confidence}</div>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest block mb-1 opacity-50">Anomalies</span>
                      <div className={`text-2xl font-black tracking-tighter ${r.anomalies_detected > 0 ? 'text-red-500' : 'text-[var(--accent)]'}`}>
                        {r.anomalies_detected || '0'}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-[#f1ffe2]/30 rounded-[2rem] border border-white/10 flex items-center justify-between group-hover:bg-[#f1ffe2]/50 transition-all shadow-inner">
                    <div>
                      <span className="text-[8px] font-black text-[var(--muted)] uppercase tracking-[0.2em] block mb-1 opacity-50">Magnitude Pulse</span>
                      <div className={`text-xl font-black tracking-tight text-[var(--foreground)] italic`}>₹{r.forecast_next_period.toLocaleString()}</div>
                    </div>
                    <ArrowUpRight size={20} className={`opacity-20 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${isUp ? 'text-[var(--accent)]' : 'text-red-600'}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
