"use client";

import { useState, useTransition, useRef } from "react";
import { motion } from "framer-motion";
import { sendMessage, uploadCSV, markNotificationRead } from "@/lib/actions";
import type { Message, Notification, MlPrediction, UploadedData } from "@/lib/db";

interface Props {
  session: { userId: number; role: string; name: string };
  initialMessages: Message[];
  initialNotifications: Notification[];
  initialPredictions: MlPrediction[];
  initialUploads: UploadedData[];
}

export default function DashboardClient({ session, initialMessages, initialNotifications, initialPredictions, initialUploads }: Props) {
  const isAdmin = session.role === "admin";
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [predictions, setPredictions] = useState<MlPrediction[]>(initialPredictions);
  const [uploads, setUploads] = useState<UploadedData[]>(initialUploads);
  const [chatInput, setChatInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const unreadCount = notifications.filter(n => n.status === "unread").length;

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const optimistic: Message = {
      id: Date.now(),
      sender_id: session.userId,
      receiver_id: 0,
      message: chatInput,
      timestamp: new Date().toISOString(),
      sender_name: session.name
    };
    setMessages(prev => [...prev, optimistic]);
    const msg = chatInput;
    setChatInput("");
    startTransition(async () => {
      await sendMessage(msg);
    });
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadStatus("Uploading...");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await uploadCSV(formData);
      if (result?.error) {
        setUploadStatus(`Error: ${result.error}`);
      } else {
        setUploadStatus(`✅ Upload complete! ML prediction running...`);
        setTimeout(() => setUploadStatus("📊 Prediction complete! Check Notifications."), 2000);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <header className="flex items-center justify-between bg-[#0a0a0c] p-6 rounded-2xl border border-white/5 shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome, {session.name}</h1>
          <p className="text-white/60 text-sm">
            {isAdmin ? "Admin focuses on decision-making, not data handling." : "Data Analyst handles data processing and system operations."}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {unreadCount > 0 && (
            <div className="px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-red-400 text-xs font-semibold">
              {unreadCount} new alert{unreadCount > 1 ? 's' : ''}
            </div>
          )}
          <button className="px-4 py-2 bg-[#0050FF]/20 text-[#00D6FF] border border-[#0050FF]/50 rounded-lg text-sm font-medium hover:bg-[#0050FF]/40 transition-colors">
            Download Report
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: isAdmin ? "Gross Revenue YTD" : "Data Rows Processed",
            value: isAdmin ? "$8.2M" : `${(uploads.length * 1200).toLocaleString()}`,
            trend: isAdmin ? "+12% this month" : `${uploads.length} data file(s) ingested`,
            alert: false
          },
          {
            title: "Active ML Models",
            value: predictions.length > 0 ? predictions.length : "—",
            trend: predictions.length > 0 ? "Latest: " + JSON.parse(predictions[0].result).trend : "No predictions yet",
            alert: false
          },
          {
            title: isAdmin ? "Business Anomaly Alerts" : "Unread Notifications",
            value: unreadCount,
            trend: unreadCount > 0 ? "Action required" : "All clear",
            alert: unreadCount > 0
          }
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl border flex flex-col justify-between h-32 shadow-xl ${kpi.alert ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-[#0a0a0c]'}`}
          >
            <h3 className="text-sm font-medium text-white/70">{kpi.title}</h3>
            <div className="text-3xl font-bold text-white mt-2">{kpi.value}</div>
            <div className={`text-xs font-semibold mt-auto ${kpi.alert ? 'text-red-400' : 'text-[#00D6FF]'}`}>{kpi.trend}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart / Upload Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-2xl flex flex-col gap-6"
        >
          {!isAdmin && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                Upload CSV Data
              </h3>
              <form onSubmit={handleUpload} className="flex flex-col gap-3">
                <input name="csv" ref={fileRef} type="file" accept=".csv" required className="text-white/60 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#0050FF]/20 file:text-[#00D6FF] hover:file:bg-[#0050FF]/40 file:transition-colors" />
                <button type="submit" disabled={isPending} className="w-fit px-5 py-2 bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white rounded-lg text-sm font-semibold hover:shadow-[0_0_15px_rgba(0,214,255,0.4)] transition-all disabled:opacity-50">
                  {isPending ? 'Processing...' : 'Upload & Run ML'}
                </button>
                {uploadStatus && <p className="text-sm text-[#00D6FF]">{uploadStatus}</p>}
              </form>
            </div>
          )}

          {/* ML Predictions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {isAdmin ? "Insight-Driven Forecast 🔮" : "Latest ML Predictions 📊"}
            </h3>
            {predictions.length === 0 ? (
              <div className="text-white/30 text-sm italic py-8 text-center border border-white/5 rounded-xl">
                No predictions yet. {!isAdmin && "Upload a CSV to trigger the ML model."}
              </div>
            ) : (
              <div className="space-y-3">
                {predictions.map((p) => {
                  const r = JSON.parse(p.result);
                  return (
                    <div key={p.id} className="p-4 rounded-xl border border-white/10 bg-black/30 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-white/40 block text-xs">Trend</span><span className="text-white font-bold capitalize">{r.trend}</span></div>
                      <div><span className="text-white/40 block text-xs">Confidence</span><span className="text-[#00D6FF] font-bold">{r.confidence}</span></div>
                      <div><span className="text-white/40 block text-xs">Anomalies</span><span className={r.anomalies_detected > 0 ? "text-red-400 font-bold" : "text-green-400 font-bold"}>{r.anomalies_detected}</span></div>
                      <div><span className="text-white/40 block text-xs">Forecast</span><span className="text-white font-bold">{r.forecast_next_period}</span></div>
                      <div className="col-span-2"><span className="text-white/40 block text-xs">Model</span><span className="text-white/70">{r.model_used}</span></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Uploads (analyst only) */}
          {!isAdmin && uploads.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Recent Uploads</h3>
              <div className="space-y-2">
                {uploads.slice(0, 3).map(u => (
                  <div key={u.id} className="flex items-center justify-between text-sm p-3 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-white/70">{u.file_name}</span>
                    <span className="text-white/30 text-xs">{new Date(u.upload_date).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Chat + Notifications */}
        <div className="flex flex-col gap-6">
          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0c] flex flex-col shadow-2xl h-80"
          >
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              System Chat
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
              {messages.length === 0 ? (
                <p className="text-white/30 text-xs italic text-center mt-4">No messages yet. Start the conversation!</p>
              ) : messages.map((m) => {
                const isMe = m.sender_id === session.userId;
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs text-[#00D6FF] mb-1">{m.sender_name || 'User'}</span>
                    <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] ${isMe ? 'bg-[#0050FF]/30 border border-[#0050FF]/40 text-white' : 'bg-black/40 border border-white/5 text-white/80'}`}>
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D6FF]/50"
              />
              <button onClick={handleSend} disabled={isPending} className="p-2 bg-[#0050FF] rounded-lg text-white hover:bg-[#00D6FF] transition-colors disabled:opacity-50">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              </button>
            </div>
          </motion.div>

          {/* Notifications Panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0c] flex flex-col shadow-2xl"
          >
            <h3 className="text-base font-semibold text-white mb-3">🔔 Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-white/30 text-xs italic">No notifications yet.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-2 rounded-lg text-xs border transition-all ${n.status === 'unread' ? 'border-[#00D6FF]/30 bg-[#00D6FF]/5 text-white/90' : 'border-white/5 text-white/40'}`}>
                    <p>{n.message}</p>
                    {n.status === 'unread' && (
                      <button
                        onClick={() => startTransition(async () => {
                          await markNotificationRead(n.id);
                          setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, status: 'read' } : x));
                        })}
                        className="text-[#00D6FF] hover:underline mt-1"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
