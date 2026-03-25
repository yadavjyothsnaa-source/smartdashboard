"use client";

import RealTimePredictor from "@/components/RealTimePredictor";
import type { MlPrediction } from "@/lib/db";
import { motion } from "framer-motion";

export default function PredictionsClient({ session, predictions }: { session: any, predictions: MlPrediction[] }) {
  const isAdmin = session.role === "admin";

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-4">
      <RealTimePredictor />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-8 rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-6">
          {isAdmin ? "Insight-Driven Forecast Database 🔮" : "Latest ML Predictions 📊"}
        </h3>
        
        {predictions.length === 0 ? (
          <div className="text-white/30 text-sm italic py-12 text-center border border-dashed border-white/10 rounded-xl bg-black/40">
            No predictions generated yet. {!isAdmin && "Upload a CSV to trigger the ML Engine."}
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.map((p) => {
              const r = JSON.parse(p.result);
              return (
                <div key={p.id} className="p-6 rounded-xl border border-white/5 bg-black/40 hover:bg-black/60 transition-colors grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm shadow-inner group">
                  <div>
                    <span className="text-white/40 block text-xs uppercase tracking-wider mb-1">Trend</span>
                    <span className="text-white font-bold capitalize text-base group-hover:text-[#166534] transition-colors">{r.trend}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs uppercase tracking-wider mb-1">Confidence</span>
                    <span className="text-[#166534] font-bold text-base">{r.confidence}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs uppercase tracking-wider mb-1">Anomalies</span>
                    <span className={`font-bold text-base ${r.anomalies_detected > 0 ? "text-red-400" : "text-green-400"}`}>
                      {r.anomalies_detected}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-xs uppercase tracking-wider mb-1">Forecast</span>
                    <span className="text-white font-bold text-base">{r.forecast_next_period}</span>
                  </div>
                  <div className="col-span-2 lg:col-span-4 mt-2 pt-4 border-t border-white/5">
                    <span className="text-white/30 block text-xs uppercase tracking-wider mb-1">Model Engine</span>
                    <span className="text-white/60 font-mono text-xs bg-white/5 px-2 py-1 rounded inline-block">{r.model_used}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
