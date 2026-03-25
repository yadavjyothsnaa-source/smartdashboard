"use client";

import { useState, useTransition } from "react";
import type { Notification } from "@/lib/db";
import { markNotificationRead } from "@/lib/actions";
import { motion } from "framer-motion";

export default function NotificationsClient({ notifications: initialNotifications }: { notifications: Notification[] }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-2xl min-h-[50vh]"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
          <span className="text-2xl">🔔</span> Action Center & Notifications
        </h3>
        {notifications.length === 0 ? (
          <p className="text-white/30 text-sm italic py-10 text-center">No notifications yet. You're all caught up!</p>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center ${n.status === 'unread' ? 'border-[#166534]/30 bg-[#14532d]/20 text-white shadow-[0_0_15px_rgba(22,101,52,0.1)]' : 'border-white/5 bg-black/40 text-white/50'}`}>
                <div>
                  <p className="text-sm font-medium">{n.message}</p>
                  <span className="text-xs opacity-50 block mt-1">{new Date(n.created_at).toLocaleString()}</span>
                </div>
                {n.status === 'unread' && (
                  <button
                    onClick={() => startTransition(async () => {
                      await markNotificationRead(n.id);
                      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, status: 'read' } : x));
                    })}
                    disabled={isPending}
                    className="px-4 py-2 bg-[#166534]/20 text-[#166534] border border-[#166534]/30 rounded-lg text-xs font-semibold hover:bg-[#166534]/40 transition-colors whitespace-nowrap self-end sm:self-center"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
