"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ChatClient({ session }: { session: any }) {
  const isAdmin = session.role === "admin";
  const counterpartRole = isAdmin ? "analyst" : "admin";
  const [chatMessages, setChatMessages] = useState<{id: number, text: string, isUser: boolean, senderName: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5001/api/get-messages");
        const data = await res.json();
        console.log("API RESPONSE:", data);

        if (Array.isArray(data)) {
          const msgs = data.map((msg: any) => ({
            id: msg.id,
            text: msg.message,
            isUser: msg.sender_role.toLowerCase() === session.role.toLowerCase(),
            senderName: msg.sender_role.toLowerCase() === 'admin' ? 'Admin' : 'Data Analyst'
          }));
          setChatMessages(msgs);
        } else {
          console.error("API did not return an array:", data);
          setChatMessages([]); // fallback
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setChatMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [session.role]);

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    
    // Optimistic UI update
    const optimisticMsg = { id: Date.now(), text: msg, isUser: true, senderName: session.name };
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
      // the real-time polling will not fetch our own messages, so optimistic is fine.
    } catch (err) {
      setChatMessages(prev => [...prev, { id: Date.now(), text: "System error: unable to send message.", isUser: false, senderName: "System" }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0c] flex flex-col shadow-2xl h-[70vh]"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
          <span className="text-2xl">💬</span> Internal Messaging
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {isLoading ? (
            <p className="text-white/30 text-sm text-center mt-10">Loading history...</p>
          ) : chatMessages.length === 0 ? (
            <p className="text-white/30 text-sm italic text-center mt-10">Start communication with {isAdmin ? 'the Data Analyst' : 'Admin'}</p>
          ) : chatMessages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.isUser ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-[#166534] mb-1">{m.senderName}</span>
              <div className={`px-4 py-3 rounded-xl text-sm max-w-[75%] ${m.isUser ? 'bg-[#14532d]/30 border border-[#14532d]/40 text-white' : 'bg-black/60 border border-white/10 text-white/90 shadow-inner'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message securely..."
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#166534]/50 transition-colors shadow-inner"
          />
          <button onClick={handleSend} className="px-6 py-3 bg-gradient-to-r from-[#14532d] to-[#166534] rounded-xl text-white font-semibold hover:shadow-[0_0_15px_rgba(22,101,52,0.4)] transition-all">
            Send Message
          </button>
        </div>
      </motion.div>
    </div>
  );
}
