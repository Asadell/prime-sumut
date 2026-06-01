import { getSessionUser } from "@/actions/auth";
import { getAuditLogs } from "@/actions/audit";
import { AuditLogTable } from "@/components/agent/AuditLogTable";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Audit Log - Prime Property",
};

export default async function AuditLogsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/agent/login");

  if (user.role !== "superadmin") {
    redirect("/agent/dashboard");
  }

  const auditLogs = await getAuditLogs(200);

  return (
    <AuditLogTable role={user.role} logs={auditLogs} />
  );
}
