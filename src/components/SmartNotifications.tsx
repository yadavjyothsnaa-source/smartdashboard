"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Alert {
  id: number;
  message: string;
  type: "critical" | "info" | "warning";
}

export default function SmartNotifications() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/notifications")
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setUnreadCount(data.length);
      })
      .catch(err => console.error("Failed to fetch notifications:", err));
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="relative p-2 bg-[#14532d]/20 text-[#166534] border border-[#14532d]/50 rounded-lg text-lg font-medium hover:bg-[#14532d]/40 transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-black">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 bg-black/40">
              <h3 className="text-white font-bold">Smart Alerts</h3>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-4 text-white/50 text-sm italic text-center">No new alerts.</div>
              ) : (
                alerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`p-4 border-b border-white/5 text-sm transition-colors ${
                      alert.type === 'critical' ? 'bg-red-500/10 text-red-200 border-l-4 border-l-red-500' : 'text-white/80 hover:bg-black/40'
                    }`}
                  >
                    {alert.message}
                  </div>
                ))
              )}
            </div>
            <div className="p-2 bg-black/60 text-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
