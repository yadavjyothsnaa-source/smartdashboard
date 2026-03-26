"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Shield, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Portal from "./Portal";

interface Alert {
  id: number;
  message: string;
  type: "critical" | "info" | "warning";
}

export default function SmartNotifications() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/notifications")
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setUnreadCount(data.length);
      })
      .catch(err => console.error("Failed to fetch notifications:", err));
  }, []);

  const openDialog = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  return (
    <div className="w-full">
      <button 
        onClick={openDialog}
        className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl tracking-widest transition-all duration-300 uppercase group ${
          isOpen
            ? "bg-[var(--accent)] text-white shadow-xl"
            : "text-[var(--foreground)] opacity-50 hover:opacity-100 hover:bg-black/5"
        }`}
      >
        <div className="flex items-center gap-3">
          <Bell size={14} className={unreadCount > 0 ? "animate-bounce" : ""} />
          <span className="text-[10px] font-black">Alerts</span>
        </div>
        
        {unreadCount > 0 && (
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <Portal>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9999]"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[10000] p-4 pointer-events-none"
            >
              <div className="bg-[var(--card-bg)] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl pointer-events-auto">
                <div className="p-8 pb-4 flex justify-between items-center bg-black/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--accent)] text-white rounded-2xl">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[var(--foreground)] tracking-tight">System Alerts.</h3>
                      <p className="text-[9px] text-[var(--muted)] font-black uppercase tracking-widest mt-0.5 opacity-50">Real-time Node Status</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-3 hover:bg-black/5 rounded-full text-[var(--muted)] hover:text-[var(--foreground)] transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-8 pt-6 max-h-[50vh] overflow-y-auto custom-scrollbar space-y-3">
                  {alerts.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                      <Sparkles size={32} className="text-[var(--accent)] mb-4" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)]">Zero detected issues</p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <motion.div 
                        key={alert.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-6 rounded-[2rem] bg-[#f1ffe2]/10 border border-white/5 relative group transition-all hover:bg-[#f1ffe2]/20`}
                      >
                        <div className={`absolute left-0 top-0 w-1 h-full bg-[var(--accent)] ${alert.type === 'critical' ? 'bg-red-600' : ''}`} />
                        <p className="text-sm text-[var(--foreground)] leading-snug font-bold">
                          {alert.message}
                        </p>
                        <span className="text-[8px] font-black text-[var(--muted)] uppercase tracking-widest mt-3 block opacity-40">
                          Priority: {alert.type}
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>
                
                <div className="p-8 border-t border-black/5 flex justify-center">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="px-10 py-4 bg-[var(--accent)] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl active:scale-95"
                  >
                    Close Communications
                  </button>
                </div>
              </div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
}


