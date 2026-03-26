"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Sparkles, TrendingUp, TrendingDown, Target } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface Insight {
  title: string;
  text: string;
  icon: string;
  type: "positive" | "negative" | "info";
}

export default function SmartInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/insights")
      .then(res => res.json())
      .then(data => {
        setInsights(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load insights:", err);
        setLoading(false);
      });
  }, []);

  const titleFont = theme === 'chocolate' ? 'font-serif italic' : 'font-sans font-black uppercase tracking-tighter';

  return (
    <div className="mt-12 space-y-10">
      <div className="flex items-center justify-between mb-12 border-b border-[var(--border)] pb-6 relative overflow-hidden">
        <div>
          <h3 className={`text-4xl ${titleFont} text-[var(--foreground)] flex items-center gap-4`}>
            Intelligence Hub
          </h3>
          <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-[0.3em] mt-2 ml-1">Live Sector Analysis</p>
        </div>
        
        {loading && (
          <div className="flex items-center gap-3 font-bold text-[10px] text-[var(--accent)] animate-pulse uppercase tracking-[0.3em]">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)]" /> Syncing Signals...
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-[3rem] bg-[var(--card-bg)] border border-[var(--border)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 rounded-[3.5rem] bg-[var(--card-bg)] border border-[var(--border)] shadow-sm hover:shadow-2xl transition-all duration-700 relative group overflow-hidden`}
            >
              <div className={`absolute top-0 right-10 w-16 h-10 bg-[var(--accent)] rounded-b-3xl flex items-center justify-center text-white ${
                insight.type === "positive" ? "bg-[var(--accent)]" :
                insight.type === "negative" ? "bg-red-500" :
                "bg-[var(--foreground)] opacity-10"
              }`}>
                <Target size={18} />
              </div>
              
              <div className="flex flex-col h-full justify-between gap-8 pt-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center text-3xl">
                      {insight.icon}
                    </div>
                  </div>
                  <h4 className={`text-xl font-bold text-[var(--foreground)] tracking-tight leading-snug`}>
                    {insight.title}
                  </h4>
                </div>
                <p className="text-sm text-[var(--muted)] font-medium leading-relaxed">
                  {insight.text}
                </p>
                <div className="pt-4 flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${insight.type === 'positive' ? 'bg-[var(--accent)]' : 'bg-red-400'}`} />
                   <span className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)]">Status Validated</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

