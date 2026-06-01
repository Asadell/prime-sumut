import { getSessionUser } from "@/actions/auth";
import { PropertyForm } from "@/components/agent/PropertyForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Tambah Properti - Prime Property",
};

export default async function CreatePropertyPage() {
  const user = await getSessionUser();
  if (!user) redirect("/agent/login");

  if (user.role !== "superadmin") {
    redirect("/agent/dashboard");
  }

  return (
    <PropertyForm role={user.role} />
  );
}
