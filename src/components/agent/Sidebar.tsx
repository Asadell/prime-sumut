"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Building2, UserCog, History, LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";
import { logoutAction } from "@/actions/auth";

export function Sidebar({ user }: { user: Profile }) {
  const pathname = usePathname();
  const role = user.role;

  const navs = [
    { href: "/agent/dashboard", icon: LayoutDashboard, label: "Ringkasan" },
    { href: "/agent/properties", icon: Building2, label: "Daftar Properti" },
    ...(role === "superadmin" ? [{ href: "/agent/admins", icon: UserCog, label: "Kelola Admin" }] : []),
    ...(role === "superadmin" ? [{ href: "/agent/audit-logs", icon: History, label: "Audit Log" }] : []),
  ];

  return (
    <aside className="w-[240px] bg-[#1A1A1A] border-r border-[#2E2E2E] min-h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Logo area */}
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-square.png" alt="Prime" className="h-10 w-auto" />
        <div className="text-[10px] tracking-widest text-white/30 mt-1 uppercase">Agent Portal</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 space-y-1">
        {navs.map((n) => {
          // Check if active: exact match for dashboard, or starts with for others
          const isActive = n.href === "/agent/dashboard" 
            ? pathname === "/agent/dashboard"
            : pathname.startsWith(n.href);

          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] transition-colors",
                isActive
                  ? "bg-[#C9A961] text-[#1A1A1A] font-semibold"
                  : "text-white/70 hover:bg-[#2E2E2E] hover:text-white"
              )}
            >
              <n.icon className="w-[18px] h-[18px] shrink-0" />
              {n.label}
            </Link>
          );
        })}
      </nav>

      {/* User area */}
      <div className="px-4 pb-5 border-t border-white/[0.06] pt-4 space-y-1">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#C9A961] text-[#1A1A1A] font-bold flex items-center justify-center shrink-0">
            {user.full_name.substring(0, 2).toUpperCase()}
          </div>
          <div className="leading-tight overflow-hidden">
            <p className="text-[13px] font-semibold text-white truncate">{user.full_name}</p>
            <span className={cn(
              "text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block uppercase",
              role === "superadmin" ? "bg-[#C9A961] text-[#1A1A1A]" : "bg-[#2E2E2E] text-white"
            )}>
              {role}
            </span>
          </div>
        </div>
        <button 
          onClick={() => logoutAction()} 
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] text-white/70 hover:bg-[#2E2E2E] hover:text-white transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" /> Keluar
        </button>
      </div>
    </aside>
  );
}
