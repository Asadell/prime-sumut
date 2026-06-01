import { PropertiClient } from "./PropertiClient";
import { getPublicProperties } from "@/actions/properties";

export const metadata = {
  title: "Daftar Properti - Prime Property",
  description: "Lebih dari 500 listing Ruko & Villa di seluruh kawasan strategis Sumatera Utara.",
};

export default async function PropertiPage() {
  const properties = await getPublicProperties();
  return <PropertiClient initialProperties={properties} />;
}
