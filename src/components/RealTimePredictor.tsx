"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Cpu, TrendingUp, Sparkles, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function RealTimePredictor() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    Units_Sold: 100,
    Cost: 5000,
    Logistics_Cost: 500,
    Overhead_Cost: 200,
    Customer_Age: 30,
    Gender: 0,
    Season: 0,
    Festival: 0,
    Trend: 1
  });
  
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);
    
    try {
      const res = await fetch("http://127.0.0.1:5001/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server Error: ${res.status}`);
      }
      
      const data = await res.json();
      setPrediction(data.predicted_revenue);
    } catch (err: any) {
      setError(err.message || "Could not reach AI bridge.");
    } finally {
      setLoading(false);
    }
  };

  const titleFont = theme === 'chocolate' ? 'font-serif italic' : 'font-sans font-black uppercase tracking-tighter';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 rounded-[3rem] border border-[var(--border)] bg-[var(--card-bg)] shadow-sm relative overflow-hidden group transition-all hover:shadow-2xl"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className={`text-3xl ${titleFont} text-[var(--foreground)] flex items-center gap-3`}>
            Heuristic Oracle
          </h3>
          <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-[0.3em] mt-2">Instant Predictive Logic</p>
        </div>
        
        {prediction !== null && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-4 bg-[var(--accent)] text-white px-8 py-4 rounded-3xl shadow-lg"
          >
            <TrendingUp size={20} />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Predicted Yield</p>
              <p className="text-xl font-bold tracking-tight">₹{prediction.toLocaleString()}</p>
            </div>
          </motion.div>
        )}
      </div>
      
      <form onSubmit={handlePredict} className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Units Sold', name: 'Units_Sold', type: 'number', placeholder: '100' },
          { label: 'Base Cost', name: 'Cost', type: 'number', placeholder: '5000' },
          { label: 'Logistics', name: 'Logistics_Cost', type: 'number', placeholder: '500' },
          { label: 'Trend Level', name: 'Trend', type: 'select', placeholder: 'Med', options: [{v:0, l:'Low'}, {v:1, l:'Med'}, {v:2, l:'High'}] }
        ].map((field) => (
          <div key={field.name} className="space-y-4">
            <label className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] ml-1 block">
              {field.label} <span className="opacity-40 italic lowercase ml-2">(eg: {field.placeholder})</span>
            </label>
            {field.type === 'select' ? (
              <select 
                name={field.name} 
                value={(formData as any)[field.name]} 
                onChange={handleChange} 
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold text-sm outline-none focus:border-[var(--accent)] transition-all cursor-pointer appearance-none"
              >
                {field.options?.map(o => <option key={o.v} value={o.v} className="bg-[#1a3a1a] text-white py-2">{o.l}</option>)}
              </select>
            ) : (
              <input 
                type="number" 
                name={field.name} 
                value={(formData as any)[field.name]} 
                onChange={handleChange} 
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:opacity-40 font-bold text-sm outline-none focus:border-[var(--accent)] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
              />
            )}
          </div>
        ))}
        
        <div className="col-span-2 md:col-span-4 mt-8 flex items-center justify-between">
          <button 
            type="submit" 
            disabled={loading} 
            className="group px-12 py-4.5 bg-[var(--accent)] text-[#1a3a1a] rounded-[2rem] text-[11px] font-black tracking-[0.25em] transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-50 flex items-center gap-3 uppercase shadow-xl shadow-emerald-900/10"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#1a3a1a]/30 border-t-[#1a3a1a] rounded-full animate-spin" />
            ) : <Sparkles size={16} />}
            {loading ? 'Crunching...' : 'Generate Forecast'}
          </button>
          
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-6 py-3 rounded-2xl border border-red-500/20"
              >
                <Zap size={14} className="animate-pulse" />
                Datalink Failed: {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  );
}
