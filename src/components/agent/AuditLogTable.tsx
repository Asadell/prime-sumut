"use client";

import { useState, useMemo } from "react";
import { Lock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditLogWithProfile } from "@/actions/audit";

export function AuditLogTable({ role, logs }: { role: string, logs: AuditLogWithProfile[] }) {
  const [filterAction, setFilterAction] = useState("Semua");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return logs.filter(l => {
      if (filterAction !== "Semua" && l.action !== filterAction) return false;
      if (q && !`${l.table_name} ${l.record_id} ${(l.profiles as any)?.full_name || ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [logs, filterAction, q]);

  if (role !== "superadmin") {
    return (
      <div className="bg-[#FEF2F2] border border-[#B33A3A] rounded-lg p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <Lock className="w-12 h-12 mb-4 text-[#B33A3A]" />
        <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-2">Akses Ditolak</h2>
        <p className="text-[14px] text-[#6B6B6B]">Fitur ini hanya tersedia untuk Superadmin.</p>
      </div>
    );
  }

  const actionBadge = (action: string) => {
    if (action === "INSERT") return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ECFDF5] text-[#16A34A]">INSERT</span>;
    if (action === "UPDATE") return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#EFF6FF] text-[#1D4ED8]">UPDATE</span>;
    if (action === "DELETE") return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEF2F2] text-[#B33A3A]">DELETE</span>;
    return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F5F5F5] text-[#6B6B6B]">{action}</span>;
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="bg-white border border-[#E0E0E0] rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari tabel, ID, atau nama admin..." className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none focus:border-[#C9A961]" />
        </div>
        <div className="flex gap-2">
          {["Semua", "INSERT", "UPDATE", "DELETE"].map(a => (
            <button key={a} onClick={() => setFilterAction(a)} className={cn("px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors", filterAction === a ? "bg-[#1A1A1A] text-white" : "bg-[#F5F5F5] text-[#6B6B6B] hover:bg-[#E0E0E0]")}>{a}</button>
          ))}
        </div>
        <div className="ml-auto text-[12px] text-[#999]">{filtered.length} entri</div>
      </div>

      <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
        <table className="w-full text-left" style={{ minWidth: "800px" }}>
          <thead className="bg-[#F5F5F5] text-[11px] font-semibold text-[#6B6B6B] uppercase border-b border-[#E0E0E0]">
            <tr>
              <th className="px-5 py-3 w-[140px]">Waktu</th>
              <th className="px-5 py-3 w-[90px]">Aksi</th>
              <th className="px-5 py-3 w-[110px]">Tabel</th>
              <th className="px-5 py-3">ID Record</th>
              <th className="px-5 py-3 w-[160px]">Oleh</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-[13px] text-[#999]">Belum ada riwayat perubahan.</td></tr>
            )}
            {filtered.map(log => (
              <tr key={log.id} className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] last:border-0">
                <td className="px-5 py-3 text-[12px] text-[#6B6B6B] whitespace-nowrap">
                  {new Date(log.changed_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-5 py-3">{actionBadge(log.action)}</td>
                <td className="px-5 py-3 text-[12px] font-mono text-[#1A1A1A]">{log.table_name}</td>
                <td className="px-5 py-3 text-[11px] font-mono text-[#999] truncate max-w-[200px]">{log.record_id}</td>
                <td className="px-5 py-3">
                  <div className="text-[12px] font-medium text-[#1A1A1A]">{(log.profiles as any)?.full_name || "-"}</div>
                  <div className="text-[11px] text-[#999]">{(log.profiles as any)?.email || ""}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
