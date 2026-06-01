"use client";

import { useState, useTransition } from "react";
import { Lock, UserPlus, Key, UserX, Trash2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";
import { createAdminAction, toggleAdminStatusAction, deleteAdminAction, resetAdminPasswordAction } from "@/actions/admin-management";

const formatTanggal = (str: string) =>
  new Date(str).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

export function AdminsTable({ role, admins, showToast }: { role: string, admins: Profile[], showToast?: (m: string, s?: string) => void }) {
  const [modal, setModal] = useState<{type: 'add'|'reset'|'disable'|'delete', id?: string} | null>(null);
  const [isPending, startTransition] = useTransition();

  if (role !== "superadmin") {
     return (
        <div className="bg-[#FEF2F2] border border-[#B33A3A] rounded-lg p-12 text-center text-[#B33A3A] flex flex-col items-center justify-center min-h-[400px]">
           <Lock className="w-12 h-12 mb-4" />
           <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-2">Akses Ditolak</h2>
           <p className="text-[14px] text-[#6B6B6B]">Fitur ini hanya tersedia untuk Superadmin.</p>
        </div>
     );
  }

  const toggleStatus = (id: string, currentStatus: boolean) => {
     startTransition(async () => {
       await toggleAdminStatusAction(id, !currentStatus);
       if (showToast) showToast("Status Diperbarui", "Status admin berhasil diubah.");
     });
  };

  const handleAction = () => {
     if (modal?.type === 'disable' && modal.id) {
       startTransition(async () => {
         await toggleAdminStatusAction(modal.id!, false);
         setModal(null);
         if (showToast) showToast("Berhasil", "Akun admin dinonaktifkan.");
       });
     } else if (modal?.type === 'delete' && modal.id) {
       startTransition(async () => {
         const res = await deleteAdminAction(modal.id!);
         setModal(null);
         if (res?.error) { if (showToast) showToast("Error", res.error); }
         else if (showToast) showToast("Berhasil", "Akun admin berhasil dihapus.");
       });
     } else if (modal?.type === 'reset' && modal.id) {
       startTransition(async () => {
         const newPassword = prompt("Masukkan password baru (min 8 karakter):");
         if (!newPassword || newPassword.length < 8) {
           if (showToast) showToast("Gagal", "Password minimal 8 karakter.");
           setModal(null);
           return;
         }
         const res = await resetAdminPasswordAction(modal.id!, newPassword);
         setModal(null);
         if (res?.error) { if (showToast) showToast("Error", res.error); }
         else if (showToast) showToast("Berhasil", "Password admin berhasil direset.");
       });
     } else {
       setModal(null);
     }
  };

  return (
     <div className="space-y-6 max-w-5xl">
        <div className="flex justify-between items-center bg-[#FFFFFF] p-6 rounded-lg border border-[#E0E0E0]">
           <h2 className="text-[20px] font-semibold text-[#1A1A1A]">Kelola Akun Admin</h2>
           <button onClick={() => setModal({type: 'add'})} className="bg-[#C9A961] text-[#1A1A1A] px-4 py-2 rounded-md font-semibold text-[13px] flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Tambah Admin
           </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-[#F5F5F5] text-[12px] font-semibold text-[#6B6B6B] uppercase border-b border-[#E0E0E0]">
                 <tr>
                    <th className="px-6 py-4">Nama & Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Bergabung</th>
                    <th className="px-6 py-4">Aksi</th>
                 </tr>
              </thead>
              <tbody>
                 {admins.map(a => (
                    <tr key={a.id} className="border-b border-[#E0E0E0] last:border-0 hover:bg-[#FAFAFA]">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-[#E0E0E0] text-[#1A1A1A] font-bold text-[11px] flex items-center justify-center shrink-0">{a.full_name.split(" ").map(n=>n[0]).join("").substring(0,2)}</div>
                             <div>
                                <div className="text-[14px] font-semibold text-[#1A1A1A]">{a.full_name}</div>
                                <div className="text-[12px] text-[#6B6B6B]">{a.email}</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="bg-[#EFF6FF] text-[#1D4ED8] text-[11px] font-semibold px-2 py-1 rounded uppercase">{a.role}</span>
                       </td>
                       <td className="px-6 py-4">
                          <button onClick={()=>toggleStatus(a.id, a.is_active)} className="flex items-center gap-2 group outline-none">
                             <div className={cn("w-8 h-4 rounded-full relative transition-colors", a.is_active ? "bg-[#16A34A]" : "bg-[#E0E0E0]")}>
                                <div className={cn("w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all", a.is_active ? "left-4" : "left-1")}></div>
                             </div>
                             <span className={cn("text-[12px] font-medium", a.is_active ? "text-[#16A34A]" : "text-[#6B6B6B]")}>{a.is_active ? "Aktif" : "Nonaktif"}</span>
                          </button>
                       </td>
                       <td className="px-6 py-4 text-[13px] text-[#6B6B6B]">{formatTanggal(a.created_at)}</td>
                       <td className="px-6 py-4">
                          <div className="flex gap-4">
                             <button onClick={()=>setModal({type:'reset', id:a.id})} className="text-[#6B6B6B] hover:text-[#C9A961]" title="Reset Password"><Key className="w-[18px] h-[18px]" /></button>
                             <button onClick={()=>setModal({type:'disable', id:a.id})} className="text-[#6B6B6B] hover:text-[#B33A3A]" title="Disable"><UserX className="w-[18px] h-[18px]" /></button>
                             <button onClick={()=>setModal({type:'delete', id:a.id})} className="text-[#6B6B6B] hover:text-[#B33A3A]" title="Hapus"><Trash2 className="w-[18px] h-[18px]" /></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Modals */}
        <AnimatePresence>
           {modal?.type === 'add' && (
              <>
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm flex justify-center items-center p-4">
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl max-w-[480px] w-full p-8 shadow-2xl">
                       <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-6">Tambah Akun Admin Baru</h3>
                       <form action={async (formData) => {
                          const fullName = formData.get("full_name") as string;
                          const res = await createAdminAction({ error: null, success: false }, formData);
                          if (res.success) {
                             setModal(null);
                             if (showToast) showToast("Admin Ditambahkan!", fullName);
                          } else {
                             if (showToast) showToast("Gagal Menambahkan Admin", res.error || "");
                          }
                       }} className="space-y-4">
                          <div><label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-1">Nama Lengkap *</label><input required name="full_name" className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961]" /></div>
                          <div><label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-1">Email *</label><input required type="email" name="email" className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961]" /></div>
                          <div><label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-1">Password *</label><input required name="password" type="password" minLength={8} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961]" /></div>
                          <p className="text-[12px] text-[#6B6B6B] italic pt-2">Akun baru akan langsung aktif dan bisa login ke portal.</p>
                          <div className="flex gap-3 pt-4 border-t border-[#E0E0E0] mt-6">
                             <button type="submit" className="bg-[#C9A961] text-[#1A1A1A] font-semibold px-6 py-2.5 rounded text-[14px]">Buat Akun</button>
                             <button type="button" onClick={()=>setModal(null)} className="text-[#6B6B6B] px-4 font-medium text-[14px]">Batal</button>
                          </div>
                       </form>
                    </motion.div>
                 </motion.div>
              </>
           )}

           {modal && modal.type !== 'add' && (
              <>
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm flex justify-center items-center p-4">
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl max-w-[400px] w-full p-8 shadow-2xl text-center">
                       <AlertTriangle className={cn("w-10 h-10 mx-auto mb-4", modal.type === 'delete' ? 'text-[#B33A3A]' : modal.type === 'reset' ? 'text-[#C9A961]' : 'text-[#6B6B6B]')} />
                       <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-2">Konfirmasi Aksi</h3>
                       <p className="text-[14px] text-[#6B6B6B] mb-8">Apakah Anda yakin ingin melakukan {modal.type === 'delete' ? 'penghapusan' : modal.type === 'reset' ? 'reset password' : 'penonaktifan'} pada akun ini?</p>
                       <div className="flex justify-center gap-3">
                          <button onClick={handleAction} className={cn("font-semibold px-6 py-2.5 rounded text-[14px] text-white", modal.type === 'delete' ? 'bg-[#B33A3A]' : modal.type === 'reset' ? 'bg-[#C9A961] text-[#1A1A1A]' : 'bg-[#1A1A1A]')}>Konfirmasi</button>
                          <button onClick={()=>setModal(null)} className="text-[#6B6B6B] px-4 font-medium text-[14px]">Batal</button>
                       </div>
                    </motion.div>
                 </motion.div>
              </>
           )}
        </AnimatePresence>
     </div>
  );
}
