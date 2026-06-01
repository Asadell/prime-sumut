import { DashboardClient } from "./DashboardClient";
import { getSessionUser } from "@/actions/auth";
import { getPublicProperties } from "@/actions/properties";
import { getAllAdmins } from "@/actions/admin-management";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard — Prime Property Agent",
};

export default async function Dashboard() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/agent/login");
  }

  const properties = await getPublicProperties();
  const admins = await getAllAdmins();

  return <DashboardClient user={user} initialProperties={properties} initialAdmins={admins} />;
}
