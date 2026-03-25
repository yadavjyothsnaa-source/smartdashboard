"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Message, Notification, MlPrediction, UploadedData } from "@/lib/db";
import SmartNotifications from "@/components/SmartNotifications";
import Link from "next/link";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ComposedChart, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { Filter, MapPin, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  session: { userId: number; role: string; name: string };
  initialMessages: Message[];
  initialNotifications: Notification[];
  initialPredictions: MlPrediction[];
  initialUploads: UploadedData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardClient({ session, initialNotifications, initialPredictions, initialUploads }: Props) {
  const isAdmin = session.role === "admin";
  const unreadCount = initialNotifications.filter(n => n.status === "unread").length;
  
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  const [combinedData, setCombinedData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const [salesRes, catRes, regRes] = await Promise.all([
          fetch('http://127.0.0.1:5001/api/sales-trend'),
          fetch('http://127.0.0.1:5001/api/category-distribution'),
          fetch('http://127.0.0.1:5001/api/revenue-by-region')
        ]);
        
        if (salesRes.ok) setCombinedData(await salesRes.json());
        if (catRes.ok) setCategoryData(await catRes.json());
        if (regRes.ok) setRegionData(await regRes.json());
      } catch (error) {
        console.error("Failed to fetch live chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveData();
  }, []);

  const heatmapCells = regionData.flatMap(r => 
    r.subData.map((s: { name: string; rev: number }) => ({
      region: r.region,
      product: s.name,
      value: r.revenue > 0 ? Math.round((s.rev / r.revenue) * 100) : 0
    }))
  );

  const forecastData = combinedData.map(d => ({
    month: d.month,
    actual: d.revenue,
    forecast: d.revenue * 1.05 // Simplified forecast overlay
  }));

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center pt-32">
        <div className="animate-spin text-[#166534] w-12 h-12 border-4 border-current border-t-transparent rounded-full" />
        <span className="ml-4 text-white/60 font-medium">Aggregating Live Data...</span>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <header className="flex items-center justify-between bg-[#0a0a0c] p-6 rounded-2xl border border-white/5 shadow-2xl">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome, {session.name}</h1>
            <p className="text-white/60 text-sm">Administrator manages system, users, and business decisions.</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard/reports" className="px-4 py-2 bg-gradient-to-r from-[#14532d] to-[#166534] text-white rounded-lg text-sm font-semibold hover:shadow-[0_0_15px_rgba(22,101,52,0.4)] transition-all">
              Download Report
            </Link>
            <SmartNotifications />
          </div>
        </header>

        <h2 className="text-xl font-bold text-white mb-2 border-l-4 border-[#166534] pl-3">Admin Dashboard (Advanced)</h2>
        
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c] shadow-lg">
            <h3 className="text-sm font-medium text-white/50 mb-1">Total Users</h3>
            <div className="text-2xl font-bold text-white">2</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c] shadow-lg">
            <h3 className="text-sm font-medium text-white/50 mb-1">Total Data Uploaded</h3>
            <div className="text-2xl font-bold text-white">{initialUploads.length}</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c] shadow-lg">
            <h3 className="text-sm font-medium text-white/50 mb-1">System Activity</h3>
            <div className="text-2xl font-bold text-white">{initialPredictions.length + initialUploads.length}</div>
          </div>
          <div className={`p-4 rounded-xl border shadow-lg ${unreadCount > 0 ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-[#0a0a0c]'}`}>
            <h3 className="text-sm font-medium text-white/50 mb-1">Pending Actions</h3>
            <div className="text-2xl font-bold text-white">{unreadCount}</div>
          </div>
        </div>

        {/* Multi-Dimensional Dashboard Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 p-6 rounded-xl border border-white/10 bg-[#0a0a0c] shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Filter size={18} /> Multi-Dimensional Overview</h3>
              <div className="flex gap-2 text-xs">
                <select className="bg-black/50 border border-white/20 text-white rounded px-2 py-1"><option>All Regions</option><option>North</option></select>
                <select className="bg-black/50 border border-white/20 text-white rounded px-2 py-1"><option>All Products</option><option>T-Shirts</option></select>
                <select className="bg-black/50 border border-white/20 text-white rounded px-2 py-1"><option>Last 6 Months</option></select>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData} onClick={(data) => { if (data?.activeLabel) setSelectedRegion(String(data.activeLabel)); }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="region" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{backgroundColor: '#121214', border: '1px solid #ffffff20', borderRadius: '8px', color: 'white'}} cursor={{fill: '#ffffff05'}} />
                  <Bar dataKey="revenue" fill="#14532d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-white/40 text-center mt-2 italic">Click a bar above to drill-down into region-specific products.</p>
          </motion.div>

          {/* Drill-Down Panel */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-xl border border-white/10 bg-[#121214] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#166534]/10 rounded-full blur-3xl" />
            <h3 className="text-lg font-bold text-white mb-4">Drill-Down Matrix</h3>
            {selectedRegion ? (
              <AnimatePresence mode="wait">
                <motion.div key={selectedRegion} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="h-full flex flex-col">
                  <span className="text-sm text-[#166534] font-semibold mb-4 border-b border-white/10 pb-2">Analyzing: {selectedRegion} Region</span>
                  <div className="space-y-3">
                    {regionData.find(r => r.region === selectedRegion)?.subData.map((sub: {name: string, rev: number}) => (
                      <div key={sub.name} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-white/70">
                          <span>{sub.name}</span>
                          <span>₹{sub.rev.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#166534] h-full" style={{width: `${(sub.rev / 3000) * 100}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setSelectedRegion(null)} className="mt-auto text-xs text-white/40 hover:text-white pt-4">← Reset</button>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-white/30 text-sm border border-dashed border-white/10 bg-black/20 rounded-xl">
                <MapPin size={24} className="mb-2 opacity-50" />
                Select a Region to drill down
              </div>
            )}
          </motion.div>
        </div>

        {/* Heatmap & Forecast Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-xl border border-white/10 bg-[#0a0a0c] shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Profit Heatmap 🗺️</h3>
            <p className="text-xs text-white/50 mb-4">Identifies performance density across Region (Y) vs Product (X)</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {['North', 'South', 'East', 'West'].map(region => (
                <div key={region} className="flex items-center gap-2">
                  <span className="text-xs text-white/50 w-12">{region}</span>
                  <div className="flex-1 flex gap-1 h-8">
                    {heatmapCells.filter(c => c.region === region).map(cell => {
                      const hue = 200 + (cell.value * 0.4); // Blue scale
                      const opacity = cell.value / 100;
                      return (
                        <div 
                          key={cell.product} 
                          title={`${cell.product}: ${cell.value}%`}
                          className="flex-1 rounded" 
                          style={{ backgroundColor: `hsla(${hue}, 100%, 50%, ${opacity})` }} 
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-white/40 mt-2 pl-14 pr-2">
              <span>T-Shirts</span><span>Jeans</span>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-xl border border-white/10 bg-[#0a0a0c] shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#14532d]/20 rounded-full blur-3xl" />
            <h3 className="text-base font-bold text-white mb-2">Forecasting Graph (ML) 📈</h3>
            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                  <XAxis dataKey="month" stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{backgroundColor: '#121214', border: '1px solid #ffffff20', borderRadius: '8px', color: 'white'}} />
                  <Line type="monotone" dataKey="actual" stroke="#ffffff" strokeWidth={2} dot={{r: 4, fill: '#ffffff'}} name="Actual" />
                  <Line type="monotone" dataKey="forecast" stroke="#166534" strokeWidth={2} strokeDasharray="5 5" dot={{r: 4, fill: '#166534'}} name="Predicted" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Risk & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-xl border border-red-500/20 bg-[#120000] shadow-xl">
            <h3 className="text-base font-bold text-red-500 mb-4 flex items-center gap-2"><AlertTriangle size={18} /> Risk & Alerts</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white/90">Low Revenue in East Region</h4>
                  <p className="text-xs text-red-400 mt-1">Dropped by 14% compared to last quarter.</p>
                </div>
                <TrendingDown className="text-red-500" />
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white/90">High Churn: Accessories</h4>
                  <p className="text-xs text-yellow-400 mt-1">Customer retention severely lagging.</p>
                </div>
                <TrendingDown className="text-yellow-500" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-[#0a0a0c] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white mb-4">Quick Navigation</h3>
            <div className="flex gap-4 flex-wrap">
              <Link href="/dashboard/reports" className="px-5 py-3 rounded-xl border border-white/10 bg-black/40 text-white/90 text-sm font-medium hover:bg-[#14532d]/20 hover:text-[#166534] transition-all">
                📊 View Reports
              </Link>
              <Link href="/dashboard/notifications" className="px-5 py-3 rounded-xl border border-white/10 bg-black/40 text-white/90 text-sm font-medium hover:bg-[#14532d]/20 hover:text-[#166534] transition-all">
                🔔 Check Notifications
              </Link>
              <Link href="/dashboard/chat" className="px-5 py-3 rounded-xl border border-white/10 bg-black/40 text-white/90 text-sm font-medium hover:bg-[#14532d]/20 hover:text-[#166534] transition-all">
                💬 Open Chat
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    );
  }

  // Analyst View (Simple Story Teller)
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header className="flex items-center justify-between bg-[#0a0a0c] p-6 rounded-2xl border border-white/5 shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome, {session.name}</h1>
          <p className="text-white/60 text-sm">Data Analyst handles data processing and system operations.</p>
        </div>
        <div className="flex gap-3 items-center">
          <SmartNotifications />
        </div>
      </header>

      {/* Analyst Story Teller Insight Card */}
      <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="p-8 rounded-2xl border border-[#166534]/30 bg-gradient-to-br from-[#0a0a0c] to-[#001020] shadow-[0_0_30px_rgba(22,101,52,0.05)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#166534]" />
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="p-2 bg-[#166534]/20 text-[#166534] rounded-lg">💡</span> Executive Summary
        </h2>
        <blockquote className="border-l-2 border-white/20 pl-4 py-2 italic text-lg text-white/90 font-medium leading-relaxed">
          "Revenue is increasing, but profit is fluctuating. Top product is T-shirt. Main issue is low sales in some regions."
        </blockquote>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Simple Combined Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-xl border border-white/10 bg-[#0a0a0c] shadow-xl">
          <h3 className="text-base font-bold text-white mb-6">Combined Business Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#121214', border: '1px solid #ffffff20', borderRadius: '8px', color: 'white'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '11px', opacity: 0.7}} />
                <Bar dataKey="revenue" name="Revenue" barSize={20} fill="#14532d" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#166534" strokeWidth={3} dot={{r: 4, fill: '#0a0a0c', stroke: '#166534', strokeWidth: 2}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-xl border border-white/10 bg-[#0a0a0c] shadow-xl">
          <h3 className="text-base font-bold text-white mb-6">Category Distribution</h3>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#121214', border: '1px solid #ffffff20', borderRadius: '8px', color: 'white'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="p-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white/90">Loss Indicator</h3>
            <p className="text-white/70 text-sm mt-1">Top Loss Reason: <span className="text-yellow-400 font-bold">Low Sales (South Region)</span></p>
          </div>
        </div>
        <Link href="/dashboard/upload" className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 font-semibold rounded-lg text-sm transition-colors border border-yellow-500/30">
          Sync Database
        </Link>
      </motion.div>

    </div>
  );
}
