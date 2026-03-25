"use client";

import { useState, useTransition, useRef } from "react";
import { uploadCSV } from "@/lib/actions";
import type { UploadedData } from "@/lib/db";
import { motion } from "framer-motion";

// Helper specifically to standardize hydration across Server and Client
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = String(hours).padStart(2, '0');
  
  return `${day} ${month} ${year}, ${strHours}:${minutes} ${ampm}`;
};
export default function UploadClient({ uploads: initialUploads }: { uploads: UploadedData[] }) {
  const [uploads] = useState<UploadedData[]>(initialUploads);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadStatus("Uploading...");
    setIsUploading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      formData.append('role', 'analyst'); // Required by Flask
      
      const file = formData.get('csv') as File;
      if (!file || file.size === 0) {
        setUploadStatus("Error: No file selected.");
        setIsUploading(false);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus("Error: File exceeds 5MB limit.");
        setIsUploading(false);
        return;
      }

      const res = await fetch('http://127.0.0.1:5001/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadStatus(`Error: ${data.error || 'Upload failed'}`);
        setIsUploading(false);
      } else {
        setUploadStatus("✅ Training Model...");
        
        setTimeout(() => {
          setUploadStatus("✅ Generating Predictions...");
        }, 800);

        setTimeout(() => {
          setUploadStatus(`✅ Done! Accuracy: ${(data.accuracy * 100).toFixed(1)}% | Predict: ${data.prediction} | Top Factor: ${data.top_features[0]}`);
          // Wait a moment so user can read the success stats, then refresh history
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        }, 1600);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadStatus("Error: Network failure during upload.");
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-2xl flex flex-col gap-6"
      >
        <div>
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload CSV Data
          </h3>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors">
              <input 
                name="csv" 
                ref={fileRef} 
                type="file" 
                accept=".csv" 
                required 
                className="text-white/60 text-sm file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#14532d]/20 file:text-[#166534] hover:file:bg-[#14532d]/40 file:transition-colors file:cursor-pointer mx-auto block" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isUploading} 
              className="w-full sm:w-auto self-center px-8 py-3 bg-gradient-to-r from-[#14532d] to-[#166534] text-white rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(22,101,52,0.4)] transition-all disabled:opacity-50 mt-2"
            >
              {isUploading ? 'Processing Dataset...' : 'Upload & Run ML Engine'}
            </button>
            {uploadStatus && (
              <p className="text-sm font-medium text-center mt-2 text-[#166534]">{uploadStatus}</p>
            )}
          </form>
        </div>
      </motion.div>

      {uploads.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-2xl border border-white/10 bg-[#0a0a0c]/50 shadow-xl"
        >
          <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">Historical Uploads</h3>
          <div className="space-y-3">
            {uploads.map(u => (
              <div key={u.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                <span className="text-white/80 font-medium text-sm">{u.file_name}</span>
                <span className="text-white/30 text-xs">
                  {formatDate(u.upload_date)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
