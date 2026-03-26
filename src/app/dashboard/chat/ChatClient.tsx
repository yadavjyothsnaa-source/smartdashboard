"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Shield, Zap, User, Cpu } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ChatClient({ session }: { session: any }) {
  const isAdmin = session.role === "admin";
  const { theme } = useTheme();
  const counterpartRole = isAdmin ? "analyst" : "admin";
  const [chatMessages, setChatMessages] = useState<{id: number, text: string, isUser: boolean, senderName: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5001/api/get-messages");
        const data = await res.json();

        if (Array.isArray(data)) {
          const msgs = data.map((msg: any) => ({
            id: msg.id,
            text: msg.message,
            isUser: msg.sender_role.toLowerCase() === session.role.toLowerCase(),
            senderName: msg.sender_role.toLowerCase() === 'admin' ? 'Admin' : 'Data Analyst'
          }));
          setChatMessages(msgs);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [session.role]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    
    const optimisticMsg = { id: Date.now(), text: msg, isUser: true, senderName: isAdmin ? 'Admin' : 'Data Analyst' };
    setChatMessages(prev => [...prev, optimisticMsg]);

    try {
      await fetch("http://127.0.0.1:5001/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: msg, 
          sender_role: session.role,
          receiver_role: counterpartRole
        })
      });
    } catch (err) {
      setChatMessages(prev => [...prev, { id: Date.now(), text: "Connection disrupted. Message queued.", isUser: false, senderName: "System" }]);
    }
  };

  const titleFont = theme === 'chocolate' ? 'font-serif italic' : 'font-sans font-black uppercase tracking-tighter';

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 mt-8">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h1 className={`text-4xl ${titleFont} text-[var(--foreground)]`}>Intelligence Comms.</h1>
          <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-[0.3em] mt-2">End-to-End Secure Channel</p>
        </div>
        <div className="flex items-center gap-3 bg-[var(--card-bg)] border border-[var(--border)] px-5 py-2.5 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">Signal Locked</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--card-bg)] rounded-[3.5rem] border border-[var(--border)] flex flex-col shadow-2xl h-[70vh] relative overflow-hidden"
      >
        {/* Messages Space */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-6 h-6 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
              <span className="text-[10px] text-[var(--muted)] font-black uppercase tracking-[0.2em]">Synchronizing Logs</span>
            </div>
          ) : chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
              <MessageSquare size={48} className="text-[var(--accent)] mb-6" />
              <p className="text-lg font-bold text-[var(--foreground)] tracking-tight">Archives Idle</p>
              <p className="text-sm text-[var(--muted)] mt-1 font-medium">Initialize communication for the session.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {chatMessages.map((m, i) => (
                <motion.div 
                  key={m.id} 
                  initial={{ opacity: 0, x: m.isUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex flex-col ${m.isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-3 mb-2 px-2">
                    {!m.isUser && <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-[var(--muted)]"><User size={12}/></div>}
                    <span className={`text-[9px] font-black uppercase tracking-widest ${m.isUser ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>
                      {m.senderName}
                    </span>
                    {m.isUser && <div className="w-6 h-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]"><User size={12}/></div>}
                  </div>
                  <div className={`px-8 py-4 rounded-[2.5rem] text-sm max-w-[80%] leading-relaxed tracking-tight font-medium ${
                    m.isUser 
                      ? 'bg-[var(--accent)] text-white shadow-lg' 
                      : 'bg-black/5 text-[var(--foreground)] border border-[var(--border)]'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Input Dock */}
        <div className="p-8 border-t border-[var(--border)] bg-black/5">
          <div className="flex gap-4 p-2 bg-[var(--background)] rounded-[2.5rem] border border-[var(--border)] shadow-inner overflow-hidden focus-within:border-[var(--accent)] transition-all">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Inject secure transmission message..."
              className="flex-1 bg-transparent px-8 py-5 text-sm text-[var(--foreground)] font-bold placeholder:font-medium focus:outline-none placeholder:text-[var(--muted)]"
            />
            <button 
              onClick={handleSend} 
              className="px-10 py-5 bg-[var(--foreground)] text-[var(--background)] rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[0.98] flex items-center gap-3 shadow-lg"
            >
              <Send size={14} />
              Send
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
