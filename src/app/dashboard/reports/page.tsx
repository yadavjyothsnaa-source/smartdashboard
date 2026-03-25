import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const session = await getSession();
  if (!session) redirect('/');
  return <ReportsClient session={session} />;
}
