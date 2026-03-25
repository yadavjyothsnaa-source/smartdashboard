import { getSession } from "@/lib/auth";
import { getMlPredictions } from "@/lib/actions";
import { redirect } from "next/navigation";
import PredictionsClient from "./PredictionsClient";

export default async function PredictionsPage() {
  const session = await getSession();
  if (!session) redirect('/');
  const predictions = await getMlPredictions();
  return <PredictionsClient session={session} predictions={predictions} />;
}
