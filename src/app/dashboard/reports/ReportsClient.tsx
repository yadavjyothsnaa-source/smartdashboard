"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FileDown, Activity, Database, CheckCircle, BarChart3, Clock, Layout, Cpu } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const COLORS = ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80'];

export default function ReportsClient({ session }: { session: any }) {
  const { theme } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [salesRes, catRes, predRes] = await Promise.all([
          fetch('http://127.0.0.1:5001/api/sales-trend'),
          fetch('http://127.0.0.1:5001/api/category-distribution'),
          fetch('http://127.0.0.1:5001/api/predictions')
        ]);
        
        if (salesRes.ok) setSalesData(await salesRes.json());
        if (catRes.ok) setCategoryData(await catRes.json());
        if (predRes.ok) setPredictions(await predRes.json());
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const handleDownload = async () => {
    const element = document.getElementById("pdf-report-document");
    if (!element) return;
    
    setIsGenerating(true);
    try {
      element.style.display = "block";
      element.style.position = "fixed";
      element.style.left = "-9999px";
      
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Smart_Analytics_Report.pdf");
      
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      element.style.display = "none";
      setIsGenerating(false);
    }
  };

  const titleFont = "font-black tracking-tight";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center pt-32 gap-3">
        <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.3em] opacity-40">Compiling Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 pb-20 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="px-2 py-0.5 bg-[var(--accent)] text-white text-[8px] font-black uppercase tracking-widest rounded-md shadow-sm italic">Base.Protocol</div>
             <p className="text-[9px] text-[var(--muted)] font-black uppercase tracking-[0.3em] opacity-40">Document Control</p>
          </div>
          <h1 className={`text-4xl md:text-5xl ${titleFont} text-[var(--foreground)]`}>Archives Core.</h1>
          <p className="text-sm md:text-base text-[var(--foreground)] font-bold opacity-50 max-w-lg leading-relaxed italic">
            Download aggregated signal history and RandomForest projections as secured documents.
          </p>
        </div>
        <button 
          onClick={handleDownload}
          disabled={isGenerating}
          className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] disabled:opacity-50 rounded-2xl text-[9px] font-black tracking-widest hover:scale-[0.98] active:scale-95 transition-all flex items-center gap-3 shadow-2xl uppercase"
        >
          {isGenerating ? (
            <div className="w-3 h-3 border-2 border-[var(--background)]/30 border-t-[var(--background)] rounded-full animate-spin" />
          ) : <FileDown size={12} strokeWidth={3} />}
          {isGenerating ? 'Compiling PDF...' : 'Export Intel Report'}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-10 rounded-[3rem] bg-[var(--card-bg)] border border-white/10 shadow-sm relative overflow-hidden group backdrop-blur-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-10 bg-[var(--accent)] text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group/card hover:scale-[1.01] transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
              <div className="flex items-center gap-4 mb-8 opacity-100 relative z-10 text-white">
                <Cpu size={18} strokeWidth={3} className="text-white brightness-125" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em]">Active Predictions</h4>
              </div>
              <p className="text-5xl font-bold tracking-normal relative z-10 italic text-white drop-shadow-sm">{predictions.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-4 opacity-70 relative z-10 italic text-white">Secure Signal Logs</p>
            </div>
            <div className={`p-10 ${theme === 'matcha' ? 'bg-black/40' : 'bg-black/20'} rounded-[2.5rem] border border-white/10 group transition-all duration-500 hover:scale-[1.01]`}>
              <div className="flex items-center gap-4 mb-8 text-white">
                <Clock size={18} strokeWidth={3} className="text-white brightness-125" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em]">History Span</h4>
              </div>
              <p className="text-5xl font-bold text-white tracking-normal italic drop-shadow-sm">{salesData.length} M</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-4 text-white opacity-70 italic">Aggregated Cycles</p>
            </div>
         </div>
         
         <div className="space-y-8">
           <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-[0.4em] flex items-center gap-4 opacity-60">
               <Database size={14} />
               Intel Activity Log
             </h3>
             <div className="h-[1px] flex-1 ml-10 bg-[var(--border)] opacity-20" />
           </div>

          <div className="space-y-3">
            {predictions.length === 0 ? (
               <div className="py-12 text-center opacity-40">
                 <p className="text-xs font-black text-[var(--foreground)] tracking-tight uppercase tracking-widest">Zero signals detected.</p>
               </div>
            ) : (
              predictions.slice(0, 5).map((p, idx) => (
                <div key={idx} className="p-6 bg-black/5 hover:bg-[#f1ffe2]/30 transition-all duration-500 rounded-3xl border border-white/5 flex justify-between items-center group/item hover:translate-x-1">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-[var(--muted)] group-hover/item:bg-[var(--accent)] group-hover/item:text-white transition-all shadow-sm">
                      <Layout size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[var(--foreground)] tracking-tight italic">{p.file_name}</p>
                      <p className="text-[8px] text-[var(--muted)] font-black uppercase tracking-widest mt-1 opacity-40">{new Date(p.created_at).toLocaleDateString('en-GB')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--accent)] font-bold text-sm tracking-normal italic">
                      {p.result?.forecast_next_period || "0"}
                    </p>
                    <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-[0.2em] opacity-60 italic">
                      Acc Index: {p.result?.confidence || "0%"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* OFF-SCREEN PRINTABLE PDF TEMPLATE */}
      <div 
        id="pdf-report-document" 
        style={{ display: "none", width: "800px", padding: "60px", backgroundColor: "#ffffff", color: "#000000", fontFamily: "sans-serif" }}
      >
        <div style={{ borderBottom: "4px solid #000", paddingBottom: "30px", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "900", letterSpacing: "-1px", margin: 0 }}>Smart Dash.</h1>
          <p style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", color: "#666", marginTop: "10px" }}>Operational Intelligence Report</p>
          <p style={{ fontSize: "10px", color: "#999", marginTop: "5px" }}>Generated: {new Date().toLocaleString()}</p>
        </div>

        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "25px", borderLeft: "4px solid #166534", paddingLeft: "15px" }}>01 Live Revenue Dynamics</h2>
          <div style={{ width: "100%", height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="month" tick={{fill: '#000', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#000', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <Line type="monotone" dataKey="revenue" stroke="#166534" strokeWidth={4} dot={{r: 6, fill: "#166534"}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "25px", borderLeft: "4px solid #166534", paddingLeft: "15px" }}>02 RandomForest Intelligence Log</h2>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px", fontSize: "11px" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={{ padding: "15px", color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>Identifier</th>
                <th style={{ padding: "15px", color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>Dynamics</th>
                <th style={{ padding: "15px", color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>Accuracy Index</th>
                <th style={{ padding: "15px", color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>Pulse Projection</th>
              </tr>
            </thead>
            <tbody>
              {predictions.slice(0, 10).map((p, i) => (
                <tr key={i} style={{ backgroundColor: "#f9f9f9" }}>
                  <td style={{ padding: "15px", fontWeight: "bold" }}>{p.file_name}</td>
                  <td style={{ padding: "15px", textTransform: "uppercase" }}>{p.result?.trend || "N/A"}</td>
                  <td style={{ padding: "15px", color: "#166534", fontWeight: "900" }}>{p.result?.confidence || "N/A"}</td>
                  <td style={{ padding: "15px", fontWeight: "bold" }}>₹{p.result?.forecast_next_period?.toLocaleString() || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: "60px", paddingTop: "30px", borderTop: "1px solid #eee", textAlign: "center", fontSize: "9px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", color: "#ccc" }}>
          Confidential System Output / Authorized Use Only
        </div>
      </div>
    </div>
  );
}
