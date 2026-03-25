"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Insight {
  title: string;
  text: string;
  icon: string;
  type: "positive" | "negative" | "info";
}

export default function SmartInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">💡</span> Smart Business Insights
      </h3>
      
      {loading ? (
        <div className="text-white/50 animate-pulse text-sm">Analyzing data securely...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-xl border flex flex-col justify-between shadow-lg ${
                insight.type === "positive" ? "border-green-500/30 bg-green-500/10" :
                insight.type === "negative" ? "border-red-500/30 bg-red-500/10" :
                "border-[#166534]/30 bg-[#166534]/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{insight.icon}</span>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{insight.title}</h4>
              </div>
              <p className="text-sm text-white/80 leading-relaxed font-medium">
                {insight.text}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
