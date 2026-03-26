"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/auth";
import { 
  Home, UploadCloud, Lightbulb, Cpu, MessageSquare, 
  Settings, FileText, LogOut, Palette, ChevronRight 
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmartNotifications from "@/components/SmartNotifications";
import { useTheme } from "@/context/ThemeContext";

export default function Sidebar({ role, name }: { role: string; name: string }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isAdmin = role === "admin";
  
  const [width, setWidth] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const [showThemeExtras, setShowThemeExtras] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      if (e.clientX > 180 && e.clientX < 450) {
        setWidth(e.clientX);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const navItems = [
    { name: isAdmin ? "Central Base" : "Overview", path: "/dashboard", icon: <Home size={16} /> },
    ...(!isAdmin ? [{ name: "Uplink", path: "/dashboard/upload", icon: <UploadCloud size={16} /> }] : []),
    { name: "Intelligence", path: "/dashboard/insights", icon: <Lightbulb size={16} /> },
    { name: "Predictions", path: "/dashboard/predictions", icon: <Cpu size={16} /> },
    { name: "Messages", path: "/dashboard/chat", icon: <MessageSquare size={16} /> },
    { name: "Archives", path: "/dashboard/reports", icon: <FileText size={16} /> },
  ];

  const sidebarClass = theme === 'matcha' ? 'bg-[#7dc97a]/40' : (theme === 'forest' ? 'bg-[#000000]' : 'bg-[var(--sidebar-bg)] border-r border-white/5');
  const handleColor = theme === 'matcha' ? 'bg-[#f1ffe2]/60' : (theme === 'forest' ? 'bg-[#166534]/40' : 'bg-[#b8860b]/30');

  return (
    <aside 
      style={{ width: `${width}px` }}
      className={`h-screen ${sidebarClass} flex flex-col hidden md:flex relative z-[100] ${isResizing ? '' : 'transition-all duration-300'} overflow-visible backdrop-blur-xl`}
    >
      <div className="flex flex-col h-full w-full">
        <div className="p-6 pb-2">
          <h2 className="text-xl font-black tracking-tighter text-[var(--foreground)] uppercase">
            Smart <span className="opacity-40 italic">Dashboard.</span>
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-[8px] uppercase tracking-[0.4em] font-black text-[var(--muted)] opacity-50">
              {isAdmin ? "Superuser" : "Analyst"}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto relative z-10 custom-scrollbar">
          <div className="mb-4">
            <SmartNotifications />
          </div>
          
          <div className="space-y-1">
            {navItems.map((item, idx) => {
              const isActive = item.path === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={idx}
                  href={item.path}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black transition-all duration-300 uppercase tracking-widest group relative overflow-hidden ${
                    isActive
                      ? "bg-[var(--accent)] text-white shadow-xl translate-x-1"
                      : "text-[var(--foreground)] opacity-100 hover:bg-black/10 hover:translate-x-1"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeGlow"
                      className="absolute inset-0 bg-gradient-to-r from-[#f1ffe2]/20 to-transparent pointer-events-none" 
                    />
                  )}
                  <div className={isActive ? 'text-white relative z-10' : 'group-hover:text-[var(--foreground)] relative z-10'}>
                    {item.icon}
                  </div>
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-black/5 space-y-1">
            <button 
              onClick={() => setShowThemeExtras(!showThemeExtras)}
              className="w-full flex items-center justify-between px-5 py-3 rounded-xl text-[9px] font-black text-[var(--foreground)] opacity-80 hover:opacity-100 transition-all uppercase tracking-[0.2em]"
            >
              <div className="flex items-center gap-3">
                <Palette size={14} /> Themes
              </div>
              <ChevronRight size={12} className={`transition-transform duration-300 ${showThemeExtras ? 'rotate-90' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showThemeExtras && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="px-2 space-y-1"
                >
                  <button 
                    onClick={() => setTheme('matcha')}
                    className={`w-full text-left px-10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${theme === 'matcha' ? 'bg-[#f1ffe2]/40 text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                  >
                    Matcha
                  </button>
                  <button 
                    onClick={() => setTheme('chocolate')}
                    className={`w-full text-left px-10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${theme === 'chocolate' ? 'bg-black/10 text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                  >
                    Chocolate
                  </button>
                  <button 
                    onClick={() => setTheme('forest')}
                    className={`w-full text-left px-10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${theme === 'forest' ? 'bg-green-950/40 text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                  >
                    Green Forest
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="p-6 border-t border-black/5 mt-auto bg-black/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-black text-[10px] shadow-lg">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-[11px] text-[var(--foreground)] font-black tracking-tight leading-none">{name}</p>
              <p className="text-[8px] text-[var(--muted)] font-black uppercase tracking-widest mt-1 opacity-50">{role}</p>
            </div>
          </div>
          
          <form action={logoutAction}>
            <button type="submit" className="flex items-center justify-center gap-2 w-full text-[9px] text-red-600/60 hover:text-red-600 font-black tracking-[0.2em] uppercase border-none py-4 rounded-xl transition-all hover:bg-red-500/5">
              <LogOut size={12} /> Disconnect
            </button>
          </form>
        </div>
      </div>

      {/* Resize Handle (Visible Line) */}
      <div 
        onMouseDown={startResizing}
        className={`absolute right-0 top-0 w-1 flex items-center justify-center cursor-col-resize group z-[110] h-full ${handleColor} hover:opacity-100 transition-opacity`}
      >
         <div className="w-[1.5px] h-32 bg-white/20 rounded-full group-hover:scale-y-110 transition-transform" />
      </div>
    </aside>
  );
}

