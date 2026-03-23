"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/lib/auth";

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
    <div id="login" className="w-full max-w-md mx-auto bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative z-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Access System</h2>
        <p className="text-white/60 text-sm">Sign in using your User ID and password.</p>
        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10 text-xs text-white/50 text-left space-y-1">
          <p><strong className="text-[#00D6FF]">Analyst:</strong> Jyothsna_DA_D1</p>
          <p><strong className="text-[#00D6FF]">Admin:</strong> Rang_Ad_A1</p>
          <p className="text-white/30 mt-1">Both use the same password.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">User ID</label>
          <input
            name="user_id"
            type="text"
            required
            autoComplete="username"
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D6FF]/50 transition-colors placeholder-white/20"
            placeholder="e.g. Jyothsna_DA_D1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D6FF]/50 transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-gradient-to-r from-[#0050FF] to-[#00D6FF] text-white rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(0,214,255,0.4)] transition-all duration-300 disabled:opacity-50"
        >
          {isPending ? 'Signing in...' : 'Sign In to Dashboard'}
        </button>
      </form>
    </div>
  );
}
