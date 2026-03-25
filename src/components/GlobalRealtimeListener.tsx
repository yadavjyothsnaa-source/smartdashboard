"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupMessage {
  id: number;
  sender_role: string;
  message: string;
  timestamp: string;
}

export default function GlobalRealtimeListener({ role }: { role: string }) {
  const [popups, setPopups] = useState<PopupMessage[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`http://127.0.0.1:5001/api/get-new-messages?role=${role}`)
        .then(res => res.json())
        .then((data: PopupMessage[]) => {
          if (data && data.length > 0) {
            setPopups(prev => [...prev, ...data]);
            
            // Auto dismiss after 5 seconds
            data.forEach(msg => {
              setTimeout(() => {
                setPopups(current => current.filter(p => p.id !== msg.id));
              }, 5000);
            });
          }
        })
        .catch(err => console.error("Polling error", err));
    }, 3000);

    return () => clearInterval(interval);
  }, [role]);

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {popups.map(popup => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="w-80 bg-[#121214] border border-[#166534]/30 shadow-2xl rounded-xl p-4 pointer-events-auto flex flex-col gap-1 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-[#166534]" />
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#166534] uppercase tracking-wider">
                {popup.sender_role === 'admin' ? 'Admin' : 'Data Analyst'}
              </span>
            </div>
            <p className="text-sm text-white/90 leading-snug mt-1 line-clamp-2">
              {popup.message}
            </p>
            <button 
              onClick={() => setPopups(curr => curr.filter(p => p.id !== popup.id))}
              className="absolute top-2 right-2 text-white/30 hover:text-white"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
