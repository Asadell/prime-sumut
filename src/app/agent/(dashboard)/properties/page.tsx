import { getSessionUser } from "@/actions/auth";
import { getPublicProperties } from "@/actions/properties";
import { PropertiesTable } from "@/components/agent/PropertiesTable";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Daftar Properti - Prime Property",
};

export default async function PropertiesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/agent/login");

  const properties = await getPublicProperties();

  return (
    <PropertiesTable properties={properties} role={user.role} />
  );
}
