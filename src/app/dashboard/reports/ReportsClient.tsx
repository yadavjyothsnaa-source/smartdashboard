"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80'];

export default function ReportsClient({ session }: { session: any }) {
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
      // Force element to be visible off-screen for accurate render
      element.style.display = "block";
      
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
      // Hide back the element
      element.style.display = "none";
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center pt-32 text-white/50">
        Gathering Report Data...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Document Control & Reports</h2>
          <p className="text-white/50 text-sm">Download aggregated insights and ML predictions</p>
        </div>
        <button 
          onClick={handleDownload}
          disabled={isGenerating}
          className="px-5 py-2.5 bg-gradient-to-r from-[#14532d] to-[#166534] disabled:opacity-50 text-white rounded-lg text-sm font-semibold hover:shadow-[0_0_15px_rgba(22,101,52,0.4)] transition-all flex items-center gap-2"
        >
          {isGenerating ? (
            <span className="animate-pulse">Generating PDF...</span>
          ) : (
            <>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Report
            </>
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-xl"
      >
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-4 bg-[#14532d]/20 border border-[#166534] rounded-lg">
             <h4 className="text-white/80 text-sm font-medium">Recent ML Models Trained</h4>
             <p className="text-2xl text-white font-bold mt-1">{predictions.length}</p>
           </div>
           <div className="p-4 bg-black/50 border border-white/10 rounded-lg">
             <h4 className="text-white/80 text-sm font-medium">Revenue Periods Analyzed</h4>
             <p className="text-2xl text-white font-bold mt-1">{salesData.length} Months</p>
           </div>
        </div>
        
        <p className="text-sm text-white/60 mb-8 border-l-2 border-[#166534] pl-3">
          Click the Download Report button to generate a white-labeled, printer-friendly PDF summarizing these metrics.
        </p>

        {/* RECENT PREDICTIONS PREVIEW */}
        <h3 className="text-lg text-white font-bold mb-4">Latest ML Predictions (From SQLite)</h3>
        <div className="space-y-3">
          {predictions.length === 0 ? (
             <p className="text-white/40 text-sm italic">No ML datasets uploaded yet.</p>
          ) : (
            predictions.map((p, idx) => (
              <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-white font-medium text-sm flex items-center gap-2">
                    📄 {p.file_name}
                  </p>
                  <p className="text-xs text-white/40 mt-1">{new Date(p.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#4ade80] font-bold text-sm">{p.result?.forecast_next_period || "N/A"}</p>
                  <p className="text-xs text-white/50">Accuracy: {p.result?.confidence || "N/A"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* OFF-SCREEN PRINTABLE PDF TEMPLATE */}
      {/* This renders pure white for standard office printing without using dark ink */}
      <div 
        id="pdf-report-document" 
        style={{ display: "none", width: "800px", padding: "40px", backgroundColor: "#ffffff", color: "#000000" }}
      >
        <div style={{ borderBottom: "2px solid #166534", paddingBottom: "20px", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#14532d", margin: 0 }}>Smart Business Dashboard</h1>
          <p style={{ fontSize: "14px", color: "#666666", marginTop: "5px" }}>Automated Analytics & Protocol Report</p>
          <p style={{ fontSize: "12px", color: "#999999", marginTop: "2px" }}>Generated: {new Date().toLocaleString()}</p>
        </div>

        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px", color: "#000" }}>1. Live Revenue Trend</h2>
        <div style={{ width: "100%", height: "250px", marginBottom: "40px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{fill: '#4b5563', fontSize: 12}} axisLine={{stroke: '#e5e7eb'}} tickLine={false} />
              <YAxis tick={{fill: '#4b5563', fontSize: 12}} axisLine={false} tickLine={false} />
              <RechartsTooltip />
              <Line type="monotone" dataKey="revenue" stroke="#166534" strokeWidth={3} dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px", color: "#000" }}>2. Category Distribution</h2>
        <div style={{ width: "100%", height: "250px", marginBottom: "40px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px", color: "#000" }}>3. Machine Learning Activity Log</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
              <th style={{ padding: "10px", color: "#374151" }}>Uploaded Dataset</th>
              <th style={{ padding: "10px", color: "#374151" }}>Trend</th>
              <th style={{ padding: "10px", color: "#374151" }}>Accuracy</th>
              <th style={{ padding: "10px", color: "#374151" }}>Predicted Outcome</th>
            </tr>
          </thead>
          <tbody>
            {predictions.slice(0, 10).map((p, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "10px", color: "#111827" }}>{p.file_name}</td>
                <td style={{ padding: "10px", color: "#111827", textTransform: "capitalize" }}>{p.result?.trend || "N/A"}</td>
                <td style={{ padding: "10px", color: "#166534", fontWeight: "bold" }}>{p.result?.confidence || "N/A"}</td>
                <td style={{ padding: "10px", color: "#111827" }}>{p.result?.forecast_next_period || "N/A"}</td>
              </tr>
            ))}
            {predictions.length === 0 && (
               <tr>
                 <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>No ML predictions computed yet.</td>
               </tr>
            )}
          </tbody>
        </table>
        
        <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #e5e7eb", textAlign: "center", fontSize: "10px", color: "#9ca3af" }}>
          Confidential Business Report - Authorized Viewing Only
        </div>
      </div>
    </div>
  );
}
