import { getSession } from "@/lib/auth";
import { getUploads } from "@/lib/actions";
import { redirect } from "next/navigation";
import UploadClient from "./UploadClient";

export default async function UploadPage() {
  const session = await getSession();
  if (!session) redirect('/');
  if (session.role === 'admin') redirect('/dashboard');
  const uploads = await getUploads();
  return <UploadClient uploads={uploads} />;
}
