"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Shield } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import type { Profile } from "@/types/database";
import { cn } from "@/lib/utils";

export function Topbar({ user }: { user: Profile }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let title = "Dashboard";
  if (pathname.startsWith("/agent/properties/create")) title = "Tambah Properti";
  else if (pathname.includes("/edit")) title = "Edit Properti";
  else if (pathname.startsWith("/agent/properties")) title = "Daftar Properti";
  else if (pathname.startsWith("/agent/admins")) title = "Kelola Admin";
  else if (pathname.startsWith("/agent/audit-logs")) title = "Audit Log";

  return (
    <header className="h-[56px] bg-white border-b border-[#E0E0E0] px-8 flex items-center justify-between sticky top-0 z-30">
       <h1 className="text-[16px] font-semibold text-[#1A1A1A]">
         {title}
       </h1>
       <div className="flex items-center gap-5 relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="w-8 h-8 rounded-full bg-[#C9A961] text-[#1A1A1A] flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-90 select-none transition-opacity focus:outline-none"
          >
            {user.full_name.substring(0, 2).toUpperCase()}
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-[40px] w-64 bg-white border border-[#E0E0E0] rounded-xl shadow-lg py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-[#F0F0F0] bg-[#FAFAFA]">
                  <p className="text-[14px] font-semibold text-[#1A1A1A] truncate">{user.full_name}</p>
                  <p className="text-[11px] text-[#6B6B6B] truncate mt-0.5">{user.email || "-"}</p>
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded mt-2 inline-block uppercase",
                    user.role === "superadmin" ? "bg-[#FEF9EC] border border-[#C9A961] text-[#1A1A1A]" : "bg-[#F5F5F5] border border-[#E0E0E0] text-[#6B6B6B]"
                  )}>
                    {user.role}
                  </span>
                </div>

                <div className="p-1">
                  <button 
                    onClick={() => logoutAction()} 
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13px] text-[#B33A3A] hover:bg-[#FEF2F2] rounded-lg transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
       </div>
    </header>
  );
}
