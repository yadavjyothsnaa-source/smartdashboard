"use client";

import { useState, useRef } from "react";
import type { UploadedData } from "@/lib/db";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, FileText, Zap, Target, TrendingUp, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${monthNames[date.getMonth()]} ${date.getFullYear()}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export default function UploadClient({ uploads: initialUploads }: { uploads: UploadedData[] }) {
  const [uploads, setUploads] = useState<UploadedData[]>(initialUploads);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  
  const fileRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const handleAlert = (message: string) => {
    setAlert({ message, show: true });
    setTimeout(() => setAlert({ message: '', show: false }), 4000);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadStatus("Processing Intelligence...");
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      formData.append('role', 'analyst');
      
      const file = formData.get('csv') as File;
      if (!file || file.size === 0) {
        setUploadStatus("Error: No signal payload.");
        setIsUploading(false);
        return;
      }

      const res = await fetch('http://127.0.0.1:5001/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadStatus(`Failure: ${data.error || 'Unknown error'}`);
        setIsUploading(false);
      } else {
        setUploadStatus("Constructing Intelligence...");
        
        setTimeout(() => setUploadStatus("Extracting data points..."), 1200);

        setTimeout(() => {
          setUploadStatus(null);
          setIsUploading(false);
          setUploadResult(data);
          const newUpload: UploadedData = {
            id: Date.now(),
            user_id: 1,
            file_name: file.name,
            file_path: "",
            upload_date: new Date().toISOString()
          };
          setUploads(prev => [newUpload, ...prev]);
          setSelectedFile(null); // Reset
          if (fileRef.current) fileRef.current.value = '';
        }, 2200);
      }
    } catch (error) {
      setUploadStatus("Connection lost. Retrying later.");
      setIsUploading(false);
    }
  };

  const titleFont = theme === 'chocolate' ? 'font-serif italic' : 'font-sans font-bold uppercase tracking-[0.15em]';

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 md:px-0 mt-8">
      
      {/* Sleek Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[var(--accent)] text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full">Secure Link</span>
            <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-[0.3em]">{new Date().toLocaleDateString()}</p>
          </div>
          <h1 className={`text-6xl md:text-8xl ${titleFont} text-[var(--foreground)]`}>
            Uplink.
          </h1>
          <p className="text-lg text-[var(--muted)] font-medium max-w-xl leading-relaxed mt-2 text-balance">
            Initialize the data stream for neural processing. Our ecosystem validates your signal in real-time.
          </p>
        </div>
      </div>

      {/* Internal Alert System */}
      <AnimatePresence>
        {alert.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 right-12 z-[9999] px-8 py-4 bg-[#8BE788] text-[#1a3a1a] rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 border-4 border-white/20 hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setAlert({ message: '', show: false })}
          >
            <ShieldCheck size={18} />
            {alert.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 p-10 rounded-[3.5rem] bg-[var(--card-bg)] border border-[var(--border)] shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] opacity-[0.03] blur-[60px]" />
          
          <form onSubmit={handleUpload} className="space-y-12">
            <label className="group relative border-2 border-dashed border-[var(--border)] rounded-[3rem] p-16 text-center flex flex-col items-center justify-center hover:border-[var(--accent)] hover:bg-[var(--accent)]/[0.02] transition-all cursor-pointer">
              <input 
                name="csv" 
                ref={fileRef} 
                type="file" 
                accept=".csv" 
                required 
                onChange={(e) => setSelectedFile(e.target.files?.[0]?.name || null)}
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <div className="w-20 h-20 bg-[var(--background)] rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <Cloud size={28} className="text-[var(--accent)]" />
              </div>
              <span className={`text-2xl font-bold text-[var(--foreground)] tracking-tight`}>
                {selectedFile ? selectedFile : 'Drop your signal here'}
              </span>
              <span className="text-[var(--muted)] text-[10px] font-bold mt-3 uppercase tracking-widest">
                {selectedFile ? 'Payload Ready' : 'MAXIMUM FILE SIZE: 50MB // CSV FORMATS ONLY'}
              </span>
            </label>
            
            <div className="flex flex-col items-center gap-8">
              <button 
                type="submit" 
                disabled={isUploading} 
                className="group relative px-10 py-4 bg-[var(--accent)] text-white font-black rounded-3xl tracking-[0.2em] transition-all hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] disabled:opacity-50 uppercase text-[10px] hover:scale-[1.05] active:scale-95 shadow-lg"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isUploading ? (
                    <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {uploadStatus}</>
                  ) : 'Initialize Sync'}
                </span>
              </button>

              <AnimatePresence>
                {uploadResult && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Signal Quality', val: `${(uploadResult.accuracy * 100).toFixed(1)}%`, icon: <Zap size={14} />, color: 'var(--accent)' },
                      { label: 'Growth Vector', val: uploadResult.trend || uploadResult.prediction, icon: <TrendingUp size={14} />, color: 'var(--foreground)' },
                      { label: 'Dominant Node', val: uploadResult.top_features?.[0]?.split('_')[0] || 'Core', icon: <Target size={14} />, color: 'var(--muted)' }
                    ].map((item, i) => (
                      <div key={i} className="p-8 rounded-[2.5rem] bg-black/5 border border-[var(--border)] flex flex-col gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--background)] flex items-center justify-center text-[var(--accent)] shadow-sm">
                          {item.icon}
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[var(--muted)] mb-1 block">{item.label}</span>
                          <span className={`text-lg font-bold text-[var(--foreground)] tracking-tight`}>{item.val}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>

        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className={`text-xs font-black text-[var(--muted)] uppercase tracking-[0.3em]`}>Intelligence History</h3>
            <div className="h-[1px] flex-1 ml-6 bg-[var(--border)]" />
          </div>
          
          <div className="space-y-4">
            {uploads.slice(0, 8).map((u, i) => (
              <motion.div 
                key={u.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleAlert(`Linking to ${u.file_name} neural path...`)}
                className="group p-6 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-between hover:border-[var(--accent)] hover:shadow-xl transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--background)] flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--accent)] transition-all">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)] transition-colors truncate max-w-[120px]">{u.file_name}</h4>
                    <p className="text-[9px] font-bold text-[var(--muted)] mt-1 uppercase tracking-widest">{formatDate(u.upload_date)}</p>
                  </div>
                </div>
                <ArrowUpRight size={18} className="text-[var(--muted)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
