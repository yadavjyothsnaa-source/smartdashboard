"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("analyst");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate DB login redirect to dashboard with role
    router.push(`/dashboard?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">SmartDashboard</h1>
          <p className="text-white/60 text-sm">Enter your credentials to access the system.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D6FF]/50 transition-colors"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D6FF]/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Simulated Role Selection for Demo */}
          <div className="pt-4 border-t border-white/5">
            <label className="block text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">Demo: Simulate Role</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={role === "analyst"} onChange={() => setRole("analyst")} className="accent-[#0050FF]" />
                <span className="text-sm text-white/80">Data Analyst</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={role === "admin"} onChange={() => setRole("admin")} className="accent-[#0050FF]" />
                <span className="text-sm text-white/80">Admin / Owner</span>
              </label>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(0,214,255,0.4)] transition-all duration-300"
          >
            Sign In to System
          </button>
        </form>
      </motion.div>
    </div>
  );
}
