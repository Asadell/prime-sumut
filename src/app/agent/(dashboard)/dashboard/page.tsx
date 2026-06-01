import { getSessionUser } from "@/actions/auth";
import { getPublicProperties } from "@/actions/properties";
import { OverviewStats } from "@/components/agent/OverviewStats";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard - Prime Property",
};

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/agent/login");

  const properties = await getPublicProperties();

  return (
    <OverviewStats properties={properties} />
  );
}
