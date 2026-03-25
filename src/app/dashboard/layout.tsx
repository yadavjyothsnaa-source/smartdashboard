import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import GlobalRealtimeListener from "@/components/GlobalRealtimeListener";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/');

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      <Sidebar role={session.role} name={session.name} />

      <GlobalRealtimeListener role={session.role} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
