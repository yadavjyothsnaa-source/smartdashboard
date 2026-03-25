"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function RealTimePredictor() {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-2xl flex flex-col gap-4"
    >
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Real-Time Revenue Predictor
      </h3>
      <p className="text-xs text-white/50">Enter parameters to get an instant ML revenue prediction.</p>
      
      <form onSubmit={handlePredict} className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <label className="block text-white/70 mb-1 text-xs">Units Sold</label>
          <input type="number" name="Units_Sold" value={formData.Units_Sold} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-white/70 mb-1 text-xs">Base Cost</label>
          <input type="number" name="Cost" value={formData.Cost} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-white/70 mb-1 text-xs">Logistics</label>
          <input type="number" name="Logistics_Cost" value={formData.Logistics_Cost} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-white/70 mb-1 text-xs">Trend Level</label>
          <select name="Trend" value={formData.Trend} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white appearance-none">
            <option value={0}>Low</option>
            <option value={1}>Medium</option>
            <option value={2}>High</option>
          </select>
        </div>
        
        <div className="col-span-2 md:col-span-4 mt-2 flex items-center justify-between">
          <button type="submit" disabled={loading} className="px-5 py-2 bg-gradient-to-r from-[#166534] to-[#14532d] text-white rounded-lg text-sm font-semibold hover:shadow-[0_0_15px_rgba(22,101,52,0.4)] transition-all disabled:opacity-50">
            {loading ? 'Predicting...' : 'Generate Prediction'}
          </button>
          
          {prediction !== null && (
            <div className="text-right">
              <span className="text-xs text-white/50 block">Predicted Revenue</span>
              <span className="text-xl font-bold text-[#166534]">₹{prediction.toLocaleString()}</span>
            </div>
          )}
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      </form>
    </motion.div>
  );
}
