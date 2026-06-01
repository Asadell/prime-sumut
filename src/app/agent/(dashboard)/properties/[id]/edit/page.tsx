import { getSessionUser } from "@/actions/auth";
import { getPropertyById } from "@/actions/properties";
import { PropertyForm } from "@/components/agent/PropertyForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit Properti - Prime Property",
};

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/agent/login");

  if (user.role !== "superadmin") {
    redirect("/agent/dashboard");
  }

  const { id } = await params;
  
  let property = null;
  try {
    property = await getPropertyById(id);
  } catch (error) {
    redirect("/agent/properties");
  }

  return (
    <PropertyForm role={user.role} editProperty={property} />
  );
}
