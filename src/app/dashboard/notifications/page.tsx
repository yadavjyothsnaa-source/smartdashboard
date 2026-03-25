import { getSession } from "@/lib/auth";
import { getNotifications } from "@/lib/actions";
import { redirect } from "next/navigation";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect('/');
  const notifications = await getNotifications();
  return <NotificationsClient notifications={notifications} />;
}
