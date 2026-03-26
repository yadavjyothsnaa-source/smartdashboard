"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Message, Notification, MlPrediction, UploadedData } from "@/lib/db";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ComposedChart, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Filter, MapPin, TrendingDown, TrendingUp, AlertCircle, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useTheme } from "@/context/ThemeContext";

interface Props {
  session: { userId: number; role: string; name: string };
  initialMessages: Message[];
  initialNotifications: Notification[];
  initialPredictions: MlPrediction[];
  initialUploads: UploadedData[];
}

export default function DashboardClient({ session, initialNotifications, initialPredictions, initialUploads }: Props) {
  const { theme } = useTheme();
  const isAdmin = session.role === "admin";
  
  const [combinedData, setCombinedData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const themeColors = theme === 'matcha' 
    ? ['#1a3a1a', '#2d4533', '#4a7c59', '#7dc97a', '#0a1a0a']
    : (theme === 'forest' 
        ? ['#064e3b', '#065f46', '#047857', '#059669', '#10b981']
        : ['#b8860b', '#8b6d5c', '#d0a384', '#603b2c', '#c19a6b']);

  const chartStroke = theme === 'matcha' ? 'rgba(10, 26, 10, 0.1)' : 'rgba(255, 255, 255, 0.05)';

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const [salesRes, catRes, regRes, insightRes] = await Promise.all([
          fetch('http://127.0.0.1:5001/api/sales-trend'),
          fetch('http://127.0.0.1:5001/api/category-distribution'),
          fetch('http://127.0.0.1:5001/api/revenue-by-region'),
          fetch('http://127.0.0.1:5001/api/insights')
        ]);

        if (salesRes.ok) setCombinedData(await salesRes.json());
        if (catRes.ok) setCategoryData(await catRes.json());
        if (regRes.ok) setRegionData(await regRes.json());
        if (insightRes.ok) setInsights(await insightRes.json());
      } catch (error) {
        console.error("Failed to fetch live chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveData();
  }, []);

  const titleFont = "font-black tracking-tight";

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center pt-32 gap-3 translate-y-[-10%]">
        <div className="w-8 h-8 border-3 border-black/5 border-t-[var(--accent)] rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest opacity-40">Synchronizing...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 px-4 md:px-0">
      
      {/* Refined Stylish Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${theme === 'forest' ? 'bg-green-500' : 'bg-[var(--accent)]'} animate-pulse`} />
            <p className="text-[9px] text-[var(--muted)] font-black uppercase tracking-[0.3em] opacity-50">{new Date().toLocaleDateString('en-GB')}</p>
          </div>
          <h1 className={`text-4xl md:text-5xl ${titleFont} text-[var(--foreground)] uppercase`}>
            {isAdmin ? "Smart Dashboard." : `Hi, ${session.name.split(' ')[0]}.`}
          </h1>
          <p className="text-sm md:text-base text-[var(--foreground)] font-bold opacity-50 max-w-lg leading-relaxed">
            Market analytics are stable. Your unified workspace is synchronized.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.slice(0, 3).map((insight, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 ${theme === 'matcha' ? 'bg-[var(--card-bg)] hover:bg-[#f1ffe2]/60' : 'bg-[var(--card-bg)]'} border border-white/5 rounded-[2.5rem] transition-all duration-500 overflow-hidden relative shadow-sm hover:shadow-xl group`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 bg-[var(--accent)] text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {idx === 0 ? <Zap size={16} /> : idx === 1 ? <ShieldCheck size={16} /> : <Sparkles size={16} />}
            </div>
            <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)] mb-2 opacity-50">{insight.title}</h3>
            <p className="text-[var(--foreground)] text-sm font-bold leading-tight">
              {insight.text}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simplified Stylish Charts */}
        <div className={`p-8 bg-[var(--card-bg)] border border-white/5 rounded-[3rem] shadow-sm relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-[var(--foreground)]">
            <TrendingUp size={120} />
          </div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className={`text-xl ${titleFont} text-[var(--foreground)]`}>Market Pulse</h3>
              <p className="text-[8px] text-[var(--muted)] font-black uppercase tracking-widest mt-1 opacity-50">Monthly Dynamics</p>
            </div>
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[var(--foreground)] transition-all">
              <Filter size={16} />
            </button>
          </div>
          
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedData}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme === 'forest' ? '#065f46' : (theme === 'matcha' ? '#f1ffe2' : '#b8860b')} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" stroke={chartStroke} vertical={false} opacity={0.2} />
                <XAxis dataKey="month" stroke="var(--foreground)" fontSize={9} tickLine={false} axisLine={false} tick={{fill: 'var(--foreground)', fontWeight: 800, opacity: 0.3}} dy={10} />
                <YAxis stroke="var(--foreground)" fontSize={9} tickLine={false} axisLine={false} tick={{fill: 'var(--foreground)', fontWeight: 800, opacity: 0.3}} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'forest' ? '#064e3b' : (theme === 'matcha' ? '#1a3a1a' : '#2a1a12'), 
                    border: 'none', 
                    borderRadius: '16px', 
                    fontSize: '10px',
                    fontWeight: 800,
                    color: 'white',
                    padding: '10px 16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }} 
                  itemStyle={{ color: 'white' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={4} fillOpacity={1} fill="url(#colorAcc)" />
                <Line type="monotone" dataKey="profit" stroke="var(--foreground)" strokeWidth={2} dot={false} strokeDasharray="8 8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-8 ${theme === 'matcha' ? 'bg-[var(--card-bg)]' : 'bg-[var(--card-bg)]'} border border-white/5 rounded-[3rem] shadow-sm relative overflow-hidden group`}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className={`text-xl ${titleFont} text-[var(--foreground)]`}>Intelligence Split</h3>
              <p className="text-[8px] text-[var(--muted)] font-black uppercase tracking-widest mt-1 opacity-50">Concentration Vector</p>
            </div>
          </div>
          
          <div className="h-[280px] flex justify-center w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={80} 
                  outerRadius={110} 
                  paddingAngle={10} 
                  dataKey="value" 
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="circle" 
                  wrapperStyle={{ 
                    fontSize: '10px', 
                    fontWeight: 800, 
                    opacity: theme === 'forest' ? 1 : 0.6,
                    color: theme === 'forest' ?'#ffffff' : 'var(--foreground)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modern Stylish CTA */}
      <div className={`p-12 ${theme === 'matcha' ? 'bg-[#1a3a1a]' : 'bg-[var(--accent)]'} rounded-[3.5rem] text-white relative overflow-hidden flex flex-col items-center text-center shadow-2xl group`}>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#f1ffe2] rounded-full blur-[80px] opacity-20 transition-opacity group-hover:opacity-40" />
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight tracking-tight uppercase">
            Intelligence optimized.<br/>Live protocols active.
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3.5 bg-[#8BE788] text-[#1a3a1a] font-black uppercase tracking-widest rounded-2xl text-[10px] transition-all hover:bg-[#f1ffe2] hover:scale-[1.05] active:scale-95">
              Generate Report
            </button>
            <button className="px-8 py-3.5 bg-white/10 text-white border border-white/20 font-black uppercase tracking-widest rounded-2xl text-[10px] transition-all hover:bg-white/20 active:scale-95">
              Secure Terminal
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

