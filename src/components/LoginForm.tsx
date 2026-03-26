"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/lib/auth";
import { User, Lock, Shield } from "lucide-react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "900"] });

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div id="login" className="w-full max-w-md mx-auto relative z-20 group perspective-1000 mt-12 mb-20 md:mb-0">
      {/* Background ambient glow matching the form */}
      <div className="absolute inset-0 bg-[#10b981] opacity-20 blur-[60px] rounded-full mix-blend-screen pointer-events-none group-hover:opacity-40 transition-opacity duration-700" />
      
      <div className="relative bg-black/40 backdrop-blur-2xl border border-[#10b981]/20 rounded-3xl p-8 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden transition-transform duration-500 hover:border-[#10b981]/50">
        
        {/* Subtle decorative top border */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent opacity-50" />

        <div className="text-center mb-10">
          <h2 className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#10b981] mb-2 tracking-[0.1em] drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] ${orbitron.className}`}>
            SYSTEM LOGIN
          </h2>
          <p className="text-[#10b981]/60 text-xs sm:text-sm font-mono tracking-widest uppercase">Secure Authentication Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group/input relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#10b981]/40 group-focus-within/input:text-[#10b981] transition-colors duration-300" />
            </div>
            <input
              name="user_id"
              type="text"
              required
              autoComplete="username"
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#10b981]/50 focus:bg-black/80 focus:ring-1 focus:ring-[#10b981]/50 transition-all duration-300 font-mono text-sm shadow-inner"
              placeholder="ENTER AUTHORIZED ID"
            />
            {/* Animated bottom line on focus */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500 ease-out" />
          </div>

          <div className="group/input relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#10b981]/40 group-focus-within/input:text-[#10b981] transition-colors duration-300" />
            </div>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#10b981]/50 focus:bg-black/80 focus:ring-1 focus:ring-[#10b981]/50 transition-all duration-300 font-mono text-xl tracking-[0.2em] shadow-inner"
              placeholder="••••••••"
            />
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500 ease-out" />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl py-3 animate-pulse">
              <span className="font-mono">ERR: {error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="relative w-full py-4 mt-4 bg-gradient-to-r from-[#10b981]/10 to-[#047857]/10 border border-[#10b981]/40 text-[#10b981] rounded-xl font-black tracking-[0.2em] text-sm uppercase hover:bg-[#10b981] hover:text-black hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-offset-2 focus:ring-offset-black transition-all duration-500 disabled:opacity-50 overflow-hidden group/btn"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-700 ease-out" />
            <span className="relative z-10 drop-shadow-md">{isPending ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}</span>
          </button>
        </form>

        {/* Terminal Info Box */}
        <div className="mt-8 p-5 bg-[#050505]/80 rounded-xl border border-[#10b981]/20 text-xs font-mono text-[#10b981]/70 text-left space-y-3 relative overflow-hidden group/term">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#10b981]/0 via-[#10b981] to-[#10b981]/0 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent opacity-0 group-hover/term:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-center gap-2 text-[#10b981] mb-2 pb-2 border-b border-[#10b981]/20">
            <Shield className="w-4 h-4" />
            <span className="font-bold tracking-widest text-shadow-sm">AUTHORIZED PERSONNEL ONLY</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[#10b981]/50 uppercase text-[10px]">Analyst Access:</span> 
            <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] font-bold">Jyothsna_DA_D1</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[#10b981]/50 uppercase text-[10px]">Admin Access:</span> 
            <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] font-bold">Rang_Ad_A1</span>
          </div>
          <p className="text-[#10b981]/40 pt-2 flex items-center gap-2 border-t border-[#10b981]/10 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse" /> 
            Credentials synchronization active.
          </p>
        </div>

      </div>
    </div>
  );
}
