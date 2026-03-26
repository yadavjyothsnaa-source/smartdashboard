import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import GlobalRealtimeListener from "@/components/GlobalRealtimeListener";
import { ThemeProvider } from "@/context/ThemeContext";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/');

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden relative font-sans">
        <Sidebar role={session.role} name={session.name} />

        <GlobalRealtimeListener role={session.role} />
        
        <main className="flex-1 overflow-y-auto p-10 relative z-10 custom-scrollbar">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
