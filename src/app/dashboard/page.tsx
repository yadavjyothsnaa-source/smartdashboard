import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMessages, getNotifications, getMlPredictions, getUploads } from "@/lib/actions";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const [messages, notifications, predictions, uploads] = await Promise.all([
    getMessages(),
    getNotifications(),
    getMlPredictions(),
    getUploads()
  ]);

  return (
    <DashboardClient
      session={session}
      initialMessages={messages}
      initialNotifications={notifications}
      initialPredictions={predictions}
      initialUploads={uploads}
    />
  );
}
