"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { X, MessageSquare } from "lucide-react";

interface PopupMessage {
  id: number;
  sender_role: string;
  message: string;
  timestamp: string;
}

export default function GlobalRealtimeListener({ role }: { role: string }) {
  const { theme } = useTheme();
  const [popups, setPopups] = useState<PopupMessage[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`http://127.0.0.1:5001/api/get-new-messages?role=${role}`)
        .then(res => res.json())
        .then((data: PopupMessage[]) => {
          if (data && data.length > 0) {
            setPopups(prev => [...prev, ...data]);
            
            data.forEach(msg => {
              setTimeout(() => {
                setPopups(current => current.filter(p => p.id !== msg.id));
              }, 8000); // 8 seconds for reader
            });
          }
        })
        .catch(err => console.error("Polling error", err));
    }, 20000);

    return () => clearInterval(interval);
  }, [role]);

  return (
    <div className="fixed top-24 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {popups.map(popup => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className="w-96 bg-[var(--card-bg)] border border-[var(--border)] shadow-2xl rounded-[2rem] p-6 pointer-events-auto flex flex-col gap-2 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <MessageSquare size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest block">
                    {popup.sender_role === 'admin' ? 'Admin' : 'Data Analyst'}
                  </span>
                  <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest">New Transmission</p>
                </div>
              </div>
              <button 
                onClick={() => setPopups(curr => curr.filter(p => p.id !== popup.id))}
                className="p-1 hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close notification"
              >
                <X size={14} className="text-[var(--muted)]" />
              </button>
            </div>
            
            <p className="text-sm text-[var(--foreground)] font-medium leading-relaxed mt-2 pl-1 line-clamp-3">
              "{popup.message}"
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
