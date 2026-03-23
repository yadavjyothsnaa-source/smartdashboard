"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Sidebar() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "analyst";
  const isAdmin = role === "admin";

  const navItems = [
    { name: isAdmin ? "Dashboard (Advanced)" : "Dashboard", path: "#" },
    ...(!isAdmin ? [{ name: "Upload Data", path: "#" }] : []),
    { name: "Insights", path: "#" },
    { name: "ML Predictions", path: "#" },
    { name: "Chat", path: "#" },
    { name: "Notifications", path: "#" },
    { name: "Reports", path: "#" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0a0a0c] border-r border-white/5 flex-col hidden md:flex">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">SmartDashboard</h2>
        <p className="text-xs text-[#00D6FF] mt-1 uppercase tracking-wider font-semibold">
          {isAdmin ? "Admin View" : "Analyst View"}
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item, idx) => (
          <a 
            key={idx} 
            href={item.path}
            className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
              idx === 0 
                ? "bg-[#0050FF]/20 text-[#00D6FF] border border-[#0050FF]/30 font-medium" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.name}
          </a>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0050FF] to-[#00D6FF] flex items-center justify-center text-white font-bold">
            {isAdmin ? "AD" : "DA"}
          </div>
          <div>
            <p className="text-sm text-white font-medium">{isAdmin ? "Admin User" : "Data Analyst"}</p>
            <p className="text-xs text-white/40">online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      <Suspense fallback={<div className="w-64 bg-[#0a0a0c]" />}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
