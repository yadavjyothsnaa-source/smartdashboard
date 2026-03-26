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
  const [alert, setAlert] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  const handleAlert = (message: string) => {
    setAlert({ message, show: true });
    setTimeout(() => setAlert({ message: '', show: false }), 4000);
  };

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

  const titleFont = "font-bold tracking-[0.15em]";

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center pt-32 gap-3 translate-y-[-10%]">
        <div className="w-8 h-8 border-3 border-black/5 border-t-[var(--accent)] rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-widest opacity-40">Synchronizing...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 md:px-0">
      
      {/* Refined Stylish Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${theme === 'forest' ? 'bg-green-500' : 'bg-[var(--accent)]'} animate-pulse`} />
            <p className="text-[9px] text-[var(--muted)] font-black uppercase tracking-[0.3em] opacity-50">{new Date().toLocaleDateString('en-GB')}</p>
          </div>
          <h1 className={`text-4xl md:text-5xl ${titleFont} text-[var(--foreground)] uppercase`}>
            {isAdmin ? "Smart Dashboard." : `Hi, ${session.name.split(' ')[0]}.`}
          </h1>
          <p className="text-sm md:text-base text-[var(--foreground)] font-bold opacity-50 max-w-lg leading-relaxed mt-2 text-balance">
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className={`text-xl ${titleFont} text-[var(--foreground)]`}>Market Pulse</h3>
              <p className="text-[8px] text-[var(--muted)] font-black uppercase tracking-widest mt-1 opacity-50">Monthly Dynamics</p>
            </div>
          </div>
          
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedData}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme === 'forest' ? '#10b981' : (theme === 'matcha' ? '#f1ffe2' : '#b8860b')} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" stroke={chartStroke} vertical={false} opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--foreground)" fontSize={9} tickLine={false} axisLine={false} tick={{fill: 'var(--foreground)', fontWeight: 800, opacity: 0.5}} dy={10} />
                <YAxis stroke="var(--foreground)" fontSize={9} tickLine={false} axisLine={false} tick={{fill: 'var(--foreground)', fontWeight: 800, opacity: 0.5}} dx={-10} />
                <Tooltip 
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: theme === 'forest' ? '#064e40' : (theme === 'matcha' ? '#1a3a1a' : '#2a1a12'), 
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
                <Area type="monotone" dataKey="revenue" stroke={theme === 'forest' ? '#34d399' : "var(--accent)"} strokeWidth={4} fillOpacity={1} fill="url(#colorAcc)" />
                <Line type="monotone" dataKey="profit" stroke={theme === 'forest' ? '#ffffff' : "var(--foreground)"} strokeWidth={2} dot={false} strokeDasharray="8 8" />
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
          
          <div className="h-[320px] flex justify-center w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData
                    .sort((a, b) => b.value - a.value)
                    .reduce((acc: any[], curr: any, idx: number) => {
                      if (idx < 5) {
                        acc.push(curr);
                      } else if (idx === 5) {
                        acc.push({ name: 'Others', value: curr.value });
                      } else {
                        acc[5].value += curr.value;
                      }
                      return acc;
                    }, [])
                  } 
                  cx="50%" 
                  cy="45%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                >
                  {categoryData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: theme === 'forest' ? '#064e40' : (theme === 'matcha' ? '#1a3a1a' : '#2a1a12'), 
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
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="circle"
                  formatter={(value) => <span style={{ color: '#ffffff', marginLeft: '5px' }}>{value}</span>}
                  wrapperStyle={{ 
                    fontSize: '10px', 
                    fontWeight: 700, 
                    paddingTop: '30px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>



      <AnimatePresence>
        {alert.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 right-12 z-[9999] px-8 py-4 bg-[#8BE788] text-[#1a3a1a] rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 border-4 border-white/20"
          >
            <ShieldCheck size={18} />
            {alert.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

