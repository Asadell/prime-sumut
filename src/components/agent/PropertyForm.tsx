"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { kawasanList, hadapList, siapLabel } from "@/data/properties";
import type { Property, PropertyType, PropertyStatus, PropertyReady } from "@/types/database";
import { createPropertyAction, updatePropertyAction } from "@/actions/properties";
import { Select } from "@/components/ui/Select";

const siapOptions = Object.entries(siapLabel).map(([k, v]) => ({ value: k, label: v }));
const kawasanOptions = kawasanList.map(k => ({ value: k, label: k }));

const formatRupiah = (angka: number) =>
   new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR',
      minimumFractionDigits: 0
   }).format(angka);

export function PropertyForm({ role, editProperty, showToast }: { role: string, editProperty?: Property | null, showToast?: (m: string, s?: string) => void }) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [form, setForm] = useState({
      nama: editProperty?.nama_property || "",
      group: editProperty?.group_name || "",
      lebar: editProperty?.lebar?.toString() || "",
      panjang: editProperty?.panjang?.toString() || "",
      tipe: editProperty?.tipe || "Ruko",
      tingkat: editProperty?.tingkat?.toString() || "",
      carport: editProperty?.carport || false,
      harga: editProperty?.price?.toString() || "",
      status: editProperty?.status || "in_stock",
      siap: editProperty?.siap || "siap_huni",
      kawasan: editProperty?.kawasan || "Krakatau",
      maps_link: editProperty?.maps_link || "",
      unit: editProperty?.unit || ""
   });
   const [hadap, setHadap] = useState<string[]>(editProperty?.hadap || []);

   // Sync form saat editProperty berubah
   useEffect(() => {
      if (editProperty) {
         setForm({
            nama: editProperty.nama_property,
            group: editProperty.group_name || "",
            lebar: editProperty.lebar.toString(),
            panjang: editProperty.panjang.toString(),
            tipe: editProperty.tipe,
            tingkat: editProperty.tingkat.toString(),
            carport: editProperty.carport,
            harga: editProperty.price.toString(),
            status: editProperty.status,
            siap: editProperty.siap,
            kawasan: editProperty.kawasan,
            maps_link: editProperty.maps_link || "",
            unit: editProperty.unit || "",
         });
         setHadap(editProperty.hadap);
      } else {
         setForm({ nama: "", group: "", lebar: "", panjang: "", tipe: "Ruko", tingkat: "", carport: false, harga: "", status: "in_stock", siap: "siap_huni", kawasan: "Krakatau", maps_link: "", unit: "" });
         setHadap([]);
      }
   }, [editProperty]);

   if (role !== "superadmin") {
      return (
         <div className="bg-[#FEF2F2] border border-[#B33A3A] rounded-lg p-12 text-center text-[#B33A3A] flex flex-col items-center justify-center min-h-[400px]">
            <Lock className="w-12 h-12 mb-4" />
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-2">Akses Ditolak</h2>
            <p className="text-[14px] text-[#6B6B6B]">Fitur ini hanya tersedia untuk Superadmin.</p>
         </div>
      );
   }

   const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.nama.trim() || !form.lebar || !form.panjang || hadap.length === 0 || !form.tingkat || !form.harga) {
         if (showToast) showToast("Form tidak lengkap", "Pastikan semua field wajib (*) terisi.");
         return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("nama_property", form.nama);
      formData.append("group_name", form.group);
      formData.append("lebar", form.lebar);
      formData.append("panjang", form.panjang);
      formData.append("hadap", hadap.join(","));
      formData.append("tipe", form.tipe);
      formData.append("tingkat", form.tingkat);
      formData.append("carport", form.carport ? "true" : "false");
      formData.append("harga", form.harga);
      formData.append("price", form.harga);
      formData.append("status", form.status);
      formData.append("siap", form.siap);
      formData.append("kawasan", form.kawasan);
      formData.append("maps_link", form.maps_link);
      formData.append("unit", form.unit);

      if (editProperty) {
         const res = await updatePropertyAction(editProperty.id, { error: null, success: false }, formData);
         setLoading(false);
         if (res.success) {
            router.push("/agent/properties");
            if (showToast) showToast("Properti berhasil diperbarui!", form.nama);
         } else {
            if (showToast) showToast("Gagal memperbarui", res.error || "");
         }
      } else {
         const res = await createPropertyAction({ error: null, success: false }, formData);
         setLoading(false);
         if (res.success) {
            router.push("/agent/properties");
            if (showToast) showToast("Properti berhasil ditambahkan!", form.nama);
         } else {
            if (showToast) showToast("Gagal menambahkan", res.error || "");
         }
      }
   };

   return (
      <div className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-8 max-w-4xl w-full">
         <h2 className="text-[20px] font-semibold text-[#1A1A1A] mb-1">{editProperty ? "Edit Properti" : "Tambah Properti Baru"}</h2>
         <p className="text-[13px] text-[#6B6B6B] mb-8">Isi semua field wajib (*) dengan benar.</p>

         <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Nama Properti *</label>
                  <input required minLength={3} maxLength={100} value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
               </div>
               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Group / Proyek</label>
                  <input value={form.group} onChange={e => setForm({ ...form, group: e.target.value })} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
               </div>

               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Lebar (m) *</label>
                  <input required type="number" step="0.5" min="0.1" value={form.lebar} onChange={e => setForm({ ...form, lebar: e.target.value })} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
               </div>
               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Panjang (m) *</label>
                  <input required type="number" step="0.5" min="0.1" value={form.panjang} onChange={e => setForm({ ...form, panjang: e.target.value })} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
               </div>

               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Hadap *</label>
                  <div className="flex gap-2">
                     {hadapList.map(h => (
                        <button key={h} type="button" onClick={() => { setHadap(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]) }} className={cn("px-3 py-2 border rounded text-[13px] transition-colors", hadap.includes(h) ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A]")}>{h}</button>
                     ))}
                  </div>
               </div>
               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Tipe *</label>
                  <div className="flex gap-2">
                     {["Ruko", "Villa"].map(t => (
                        <button key={t} type="button" onClick={() => setForm({ ...form, tipe: t as PropertyType })} className={cn("px-4 py-2 border rounded text-[13px] transition-colors", form.tipe === t ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A]")}>{t}</button>
                     ))}
                  </div>
               </div>

               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Tingkat *</label>
                  <input required type="number" step="0.5" min="1" max="10" value={form.tingkat} onChange={e => setForm({ ...form, tingkat: e.target.value })} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
               </div>
               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Carport</label>
                  <div className="flex gap-2">
                     {["Ya", "Tidak"].map(c => (
                        <button key={c} type="button" onClick={() => setForm({ ...form, carport: c === "Ya" })} className={cn("px-4 py-2 border rounded text-[13px] transition-colors", (form.carport && c === "Ya") || (!form.carport && c === "Tidak") ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A]")}>{c}</button>
                     ))}
                  </div>
               </div>

               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Harga (Rp) *</label>
                  <input required type="number" min="1" value={form.harga} onChange={e => setForm({ ...form, harga: e.target.value })} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
                  {form.harga && <div className="text-[11px] text-[#6B6B6B] mt-1">{formatRupiah(Number(form.harga))}</div>}
               </div>
               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Status *</label>
                  <div className="flex gap-2">
                     {[{ l: "Tersedia", v: "in_stock" }, { l: "Terjual", v: "sold_out" }].map(s => (
                        <button key={s.v} type="button" onClick={() => setForm({ ...form, status: s.v as PropertyStatus })} className={cn("px-4 py-2 border rounded text-[13px] transition-colors", form.status === s.v ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A]")}>{s.l}</button>
                     ))}
                  </div>
               </div>

               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Siap *</label>
                  <Select value={form.siap} onChange={val => setForm({ ...form, siap: val as PropertyReady })} options={siapOptions} />
               </div>
               <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Kawasan *</label>
                  <Select value={form.kawasan} onChange={val => setForm({ ...form, kawasan: val })} options={kawasanOptions} />
               </div>

               <div className="md:col-span-2">
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Link Google Maps</label>
                  <input type="url" placeholder="https://maps.google.com/?q=..." value={form.maps_link} onChange={e => setForm({ ...form, maps_link: e.target.value })} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
               </div>

               <div className="md:col-span-2">
                  <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Unit / Keterangan</label>
                  <input placeholder="Ready Siap Huni, Gate siap, dll" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
               </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-[#E0E0E0] mt-8">
               <button disabled={loading} type="button" onClick={() => router.push("/agent/properties")} className="border border-[#E0E0E0] text-[#6B6B6B] px-6 py-2.5 rounded-lg font-medium text-[15px] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors">Batal</button>
               <button disabled={loading} type="submit" className="bg-[#C9A961] text-[#1A1A1A] px-6 py-2.5 rounded-lg font-semibold text-[15px] flex items-center gap-2 hover:bg-[#b59857] transition-colors disabled:opacity-70">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null} {loading ? "Menyimpan..." : (editProperty ? "Simpan Perubahan" : "Simpan Properti")}
               </button>
            </div>
         </form>
      </div>
   );
}
