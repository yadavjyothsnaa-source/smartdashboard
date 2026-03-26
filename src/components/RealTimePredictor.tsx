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
      
      if (!res.ok) throw new Error("Failed to fetch prediction");
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setPrediction(data.predicted_revenue);
    } catch (err: any) {
      setError(err.message || "An error occurred");
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
          { label: 'Units Sold', name: 'Units_Sold', type: 'number' },
          { label: 'Base Cost', name: 'Cost', type: 'number' },
          { label: 'Logistics', name: 'Logistics_Cost', type: 'number' },
          { label: 'Trend Level', name: 'Trend', type: 'select', options: [{v:0, l:'Low'}, {v:1, l:'Med'}, {v:2, l:'High'}] }
        ].map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">{field.label}</label>
            {field.type === 'select' ? (
              <select 
                name={field.name} 
                value={(formData as any)[field.name]} 
                onChange={handleChange} 
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl px-5 py-3 text-[var(--foreground)] font-bold text-sm outline-none focus:border-[var(--accent)] transition-all"
              >
                {field.options?.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            ) : (
              <input 
                type="number" 
                name={field.name} 
                value={(formData as any)[field.name]} 
                onChange={handleChange} 
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl px-5 py-3 text-[var(--foreground)] font-bold text-sm outline-none focus:border-[var(--accent)] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
              />
            )}
          </div>
        ))}
        
        <div className="col-span-2 md:col-span-4 mt-6 flex items-center justify-between">
          <button 
            type="submit" 
            disabled={loading} 
            className="group px-10 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-3xl text-[10px] font-black tracking-[0.2em] transition-all hover:scale-[0.98] disabled:opacity-50 flex items-center gap-3 uppercase"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[var(--background)]/30 border-t-[var(--background)] rounded-full animate-spin" />
            ) : <Sparkles size={14} />}
            {loading ? 'Processing...' : 'Generate Forecast'}
          </button>
          
          <AnimatePresence>
            {error && (
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-100"
              >
                Signal Failure: {error}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  );
}
