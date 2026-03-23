"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("analyst");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/dashboard?role=${role}`);
  };

  return (
    <div id="login" className="w-full max-w-md mx-auto bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative z-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Access System</h2>
        <p className="text-white/60 text-sm">Enter credentials to proceed to the Dashboard.</p>
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
          Sign In to Dashboard
        </button>
      </form>
    </div>
  );
}
