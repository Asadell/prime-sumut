import { getSessionUser } from "@/actions/auth";
import { getAllAdmins } from "@/actions/admin-management";
import { AdminsTable } from "@/components/agent/AdminsTable";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Kelola Admin - Prime Property",
};

export default async function AdminsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/agent/login");

  if (user.role !== "superadmin") {
    redirect("/agent/dashboard");
  }

  const admins = await getAllAdmins();

  return (
    <AdminsTable role={user.role} admins={admins} />
  );
}
