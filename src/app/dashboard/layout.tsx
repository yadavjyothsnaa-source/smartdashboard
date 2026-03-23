import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/');

  const isAdmin = session.role === "admin";

  const navItems = [
    { name: isAdmin ? "Dashboard (Advanced)" : "Dashboard", path: "/dashboard" },
    ...(!isAdmin ? [{ name: "Upload Data", path: "/dashboard/upload" }] : []),
    { name: "Insights", path: "/dashboard/insights" },
    { name: "ML Predictions", path: "/dashboard/predictions" },
    { name: "Chat", path: "/dashboard/chat" },
    { name: "Notifications", path: "/dashboard/notifications" },
    { name: "Reports", path: "/dashboard/reports" },
  ];

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      <aside className="w-64 h-screen bg-[#0a0a0c] border-r border-white/5 flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-lg font-bold text-white tracking-tight leading-tight">Smart Business Analytics Dashboard</h2>
          <p className="text-xs text-[#00D6FF] mt-1 uppercase tracking-wider font-semibold">
            {isAdmin ? "Admin View" : "Analyst View"}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.path}
              className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
                idx === 0
                  ? "bg-[#0050FF]/20 text-[#00D6FF] border border-[#0050FF]/30 font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <form action={logoutAction} className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0050FF] to-[#00D6FF] flex items-center justify-center text-white font-bold text-sm">
              {session.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-white font-medium">{session.name}</p>
              <p className="text-xs text-white/40 capitalize">{session.role}</p>
            </div>
          </div>
          <button type="submit" className="w-full text-xs text-white/40 hover:text-white border border-white/10 rounded-lg py-2 transition-colors">
            Sign Out
          </button>
        </form>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
