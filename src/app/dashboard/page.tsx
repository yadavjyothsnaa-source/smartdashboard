"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";

function DashboardContent() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("role") === "admin";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex items-center justify-between bg-[#0a0a0c] p-6 rounded-2xl border border-white/5 shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome back, {isAdmin ? "Admin" : "Analyst"}
          </h1>
          <p className="text-white/60 text-sm">
            {isAdmin 
              ? "Admin focuses on decision-making, not data handling."
              : "Data Analyst handles data processing and system operations."}
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-[#0050FF]/20 text-[#00D6FF] border border-[#0050FF]/50 rounded-lg text-sm font-medium hover:bg-[#0050FF]/40 transition-colors">
            Download Report
          </button>
          {!isAdmin && (
            <button className="px-4 py-2 bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-[#00D6FF]/20 transition-all flex items-center gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              Upload CSV Data
            </button>
          )}
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: isAdmin ? "Gross Revenue YTD" : "Data Rows Processed", value: isAdmin ? "$8.2M" : "1.2M", trend: "+12% this month", alert: false },
          { title: "Active ML Models", value: "4", trend: "Nominal status", alert: false },
          { title: isAdmin ? "Profit Anomaly Alert" : "Missing Values Detected", value: "3", trend: "-2 since yesterday", alert: true }
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl border flex flex-col justify-between h-32 shadow-xl ${kpi.alert ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-[#0a0a0c]'}`}
          >
            <h3 className="text-sm font-medium text-white/70">{kpi.title}</h3>
            <div className="text-3xl font-bold text-white mt-2">{kpi.value}</div>
            <div className={`text-xs font-semibold mt-auto ${kpi.alert ? 'text-red-400' : 'text-[#00D6FF]'}`}>
              {kpi.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts & Chat Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-[#0a0a0c] h-96 flex flex-col shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {isAdmin ? "Forecast Graphs & Trends 🔮" : "Basic ETL Validate Chart 📊"}
            </h3>
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/50 border border-white/10">
              {isAdmin ? "Advanced Visualization" : "Basic Visualization"}
            </span>
          </div>
          <div className="flex-1 border border-white/5 rounded-lg flex items-center justify-center bg-gradient-to-b from-black/0 to-black/40">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                <svg fill="currentColor" viewBox="0 0 24 24" className="text-[#00D6FF]"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14zm-4-4h-2v-4h2v4zm-4 0H9V9h2v6zm-4 0H5v-2h2v2z"/></svg>
              </div>
              <span className="text-white/40 italic block">
                [ Chart Component Placeholder ]
              </span>
            </div>
          </div>
        </motion.div>

        {/* Real-time Chat Panel */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0c] h-96 flex flex-col shadow-2xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            System Chat
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 mb-4 scrollbar-hide">
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 max-w-[85%]">
              <span className="text-xs text-[#00D6FF] font-semibold block mb-1">Data Analyst</span>
              <p className="text-sm text-white/80">Sales dropped in March.</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0050FF]/20 border border-[#0050FF]/30 max-w-[85%] ml-auto">
              <span className="text-xs text-[#00D6FF] font-semibold block mb-1 text-right">Admin</span>
              <p className="text-sm text-white/80 text-right">Why?</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 max-w-[85%]">
              <span className="text-xs text-[#00D6FF] font-semibold block mb-1">Data Analyst</span>
              <p className="text-sm text-white/80">Seasonal trend detected by ML model.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Type a message..." className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D6FF]/50" />
            <button className="p-2 bg-[#0050FF] rounded-lg text-white hover:bg-[#00D6FF] transition-colors">
               <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading dashboard shell...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
