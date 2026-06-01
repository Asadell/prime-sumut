"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  PlusCircle, Search, X, Check, Pencil, Trash2, MapPin, AlertTriangle, ExternalLink 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { kawasanList, hadapList, siapLabel } from "@/data/properties";
import type { Property } from "@/types/database";
import { deletePropertyAction } from "@/actions/properties";
import Link from "next/link";
import { Select } from "@/components/ui/Select";

const tipeOptions = [
  { value: "Semua", label: "Semua Tipe" },
  { value: "Ruko", label: "Ruko" },
  { value: "Villa", label: "Villa" }
];
const statusOptions = [
  { value: "Semua", label: "Semua Status" },
  { value: "Tersedia", label: "Tersedia" },
  { value: "Terjual", label: "Terjual" }
];
const kawasanOptions = [
  { value: "Semua", label: "Semua Kawasan" },
  ...kawasanList.map(k => ({ value: k, label: k }))
];
const hadapOptions = [
  { value: "Semua", label: "Semua Hadap" },
  ...hadapList.map(h => ({ value: h, label: h }))
];
const siapOptions = [
  { value: "Semua", label: "Semua Kesiapan" },
  ...Object.entries(siapLabel).map(([k, v]) => ({ value: k, label: v }))
];
const carportOptions = [
  { value: "Semua", label: "Carport" },
  { value: "Ada", label: "Ada" },
  { value: "Tidak Ada", label: "Tidak Ada" }
];
const sortOptions = [
  { value: "Terbaru", label: "Terbaru" },
  { value: "Harga ↑", label: "Harga ↑" },
  { value: "Harga ↓", label: "Harga ↓" },
  { value: "Nama A-Z", label: "Nama A-Z" }
];
const perPageOptions = [
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" }
];

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);

const formatTanggal = (str: string) =>
  new Date(str).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

export function PropertiesTable({ properties, role, showToast }: { properties: Property[], role: string, showToast?: (m: string, s?: string) => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [q, setQ] = useState("");
  const [tipe, setTipe] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [kawasan, setKawasan] = useState("Semua");
  const [hargaMax, setHargaMax] = useState("");
  const [lebarMin, setLebarMin] = useState("");
  const [hadap, setHadap] = useState("Semua");
  const [siap, setSiap] = useState("Semua");
  const [carport, setCarport] = useState("Semua");
  const [sort, setSort] = useState("Terbaru");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);

  const filtered = useMemo(() => {
    let list = properties.filter((p) => {
      if (q && !`${p.nama_property} ${p.kawasan} ${p.group_name||""}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (tipe !== "Semua" && p.tipe !== tipe) return false;
      if (status === "Tersedia" && p.status !== "in_stock") return false;
      if (status === "Terjual" && p.status !== "sold_out") return false;
      if (kawasan !== "Semua" && p.kawasan !== kawasan) return false;
      if (hargaMax && p.price > Number(hargaMax)) return false;
      if (lebarMin && p.lebar < Number(lebarMin)) return false;
      if (hadap !== "Semua" && !p.hadap.includes(hadap)) return false;
      if (siap !== "Semua" && p.siap !== siap) return false;
      if (carport === "Ada" && !p.carport) return false;
      if (carport === "Tidak Ada" && p.carport) return false;
      return true;
    });

    if (sort === "Harga ↑") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "Harga ↓") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "Nama A-Z") list = [...list].sort((a, b) => a.nama_property.localeCompare(b.nama_property));
    else list = [...list].sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
    return list;
  }, [properties, q, tipe, status, kawasan, hargaMax, lebarMin, hadap, siap, carport, sort]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const reset = () => {
    setQ(""); setTipe("Semua"); setStatus("Semua"); setKawasan("Semua");
    setHargaMax(""); setLebarMin(""); setHadap("Semua"); setSiap("Semua"); setCarport("Semua");
  };

  const activeChips = [
    tipe !== "Semua" && { k: "Tipe", v: tipe, clear: () => setTipe("Semua") },
    status !== "Semua" && { k: "Status", v: status, clear: () => setStatus("Semua") },
    kawasan !== "Semua" && { k: "Kawasan", v: kawasan, clear: () => setKawasan("Semua") },
    hargaMax && { k: "Max Harga", v: formatRupiah(Number(hargaMax)), clear: () => setHargaMax("") },
    lebarMin && { k: "Lebar Min", v: `${lebarMin} m`, clear: () => setLebarMin("") },
    hadap !== "Semua" && { k: "Hadap", v: hadap, clear: () => setHadap("Semua") },
    siap !== "Semua" && { k: "Siap", v: Object.entries(siapLabel).find(([k])=>k===siap)?.[1]||siap, clear: () => setSiap("Semua") },
    carport !== "Semua" && { k: "Carport", v: carport, clear: () => setCarport("Semua") },
  ].filter(Boolean) as { k: string, v: string, clear: () => void }[];

  const doDelete = async () => {
    if (!deleteId) return;
    const res = await deletePropertyAction(deleteId);
    setDeleteId(null);
    if (res?.error) {
      if (showToast) showToast("Gagal Menghapus", res.error);
    } else {
      if (showToast) showToast("Berhasil", "Properti dipindahkan ke trash.");
      router.refresh(); // Refresh page data
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Cari nama, kawasan, group..." className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md pl-9 pr-3 py-2 text-[13px] outline-none focus:border-[#C9A961]" />
          </div>
          <div className="flex-1"></div>
          {role === "superadmin" && (
            <Link href="/agent/properties/create" className="flex items-center gap-2 bg-[#C9A961] text-[#1A1A1A] px-4 py-2 rounded-md font-semibold text-[13px]">
              <PlusCircle className="w-4 h-4" /> Tambah Properti
            </Link>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-4 text-[13px]">
          <Select value={tipe} onChange={setTipe} options={tipeOptions} className="w-[140px]" />
          <Select value={status} onChange={setStatus} options={statusOptions} className="w-[145px]" />
          <Select value={kawasan} onChange={setKawasan} options={kawasanOptions} className="w-[175px]" />
          <input type="number" placeholder="Harga Max" value={hargaMax} onChange={(e) => setHargaMax(e.target.value)} className="bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-2.5 text-[13px] outline-none focus:border-[#C9A961] focus:ring-1 focus:ring-[#C9A961] w-32 transition-all hover:border-[#C9A961]" />
          <input type="number" placeholder="Lebar Min (m)" step="0.5" value={lebarMin} onChange={(e) => setLebarMin(e.target.value)} className="bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-3.5 py-2.5 text-[13px] outline-none focus:border-[#C9A961] focus:ring-1 focus:ring-[#C9A961] w-32 transition-all hover:border-[#C9A961]" />
          <Select value={hadap} onChange={setHadap} options={hadapOptions} className="w-[140px]" />
          <Select value={siap} onChange={setSiap} options={siapOptions} className="w-[175px]" />
          <Select value={carport} onChange={setCarport} options={carportOptions} className="w-[125px]" />
          <button onClick={reset} className="text-[#6B6B6B] hover:text-[#1A1A1A] underline text-[12px] ml-2">Reset</button>
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
             {activeChips.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[12px] bg-[#FEF9EC] border border-[#C9A961] text-[#1A1A1A] px-2 py-0.5 rounded-lg">
                   {c.k}: {c.v}
                   <button onClick={c.clear}><X className="w-3 h-3 text-[#6B6B6B] hover:text-[#B33A3A]" /></button>
                </div>
             ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
         <div className="text-[12px] text-[#6B6B6B]">
            Menampilkan {filtered.length} properti
         </div>
         <Select value={sort} onChange={setSort} options={sortOptions} className="w-[140px]" />
      </div>

      {/* Table */}
      <div className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg overflow-x-auto relative">
         <table className="w-full text-left" style={{ tableLayout: "fixed", minWidth: "900px" }}>
            <thead className="bg-[#F5F5F5] text-[12px] font-semibold text-[#6B6B6B] uppercase border-b border-[#E0E0E0]">
               <tr>
                  <th className="px-4 py-3 w-[280px]">Nama Properti</th>
                  <th className="px-4 py-3 w-[80px]">Tipe</th>
                  <th className="px-4 py-3 w-[100px]">Ukuran</th>
                  <th className="px-4 py-3 w-[80px]">Hadap</th>
                  <th className="px-4 py-3 w-[140px]">Harga</th>
                  <th className="px-4 py-3 w-[90px]">Status</th>
                  <th className="px-4 py-3 w-[120px]">Siap</th>
                  <th className="px-4 py-3 w-[80px] text-center">Carport</th>
                  {role === "superadmin" && <th className="px-4 py-3 w-[80px]">Aksi</th>}
               </tr>
            </thead>
            <tbody>
               {paginated.map(p => (
                  <tr key={p.id} onClick={()=>setSelectedProp(p)} className="border-b border-[#E0E0E0] hover:bg-[#FAFAFA] cursor-pointer group">
                     <td className="px-4 py-3">
                        <div className="text-[14px] font-semibold text-[#1A1A1A] truncate">{p.nama_property}</div>
                        <div className="text-[12px] text-[#6B6B6B] truncate">{p.kawasan} {p.group_name ? `- ${p.group_name}` : ''}</div>
                     </td>
                     <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded text-[11px] font-medium", p.tipe === "Ruko" ? "bg-[#EFF6FF] text-[#1D4ED8]" : "bg-[#F5F3FF] text-[#7C3AED]")}>
                           {p.tipe}
                        </span>
                     </td>
                     <td className="px-4 py-3 text-[13px] text-[#1A1A1A]">{p.lebar} × {p.panjang} m</td>
                     <td className="px-4 py-3 text-[13px] text-[#6B6B6B] truncate">{p.hadap.join(", ")}</td>
                     <td className="px-4 py-3 text-[13px] font-semibold text-[#C9A961]">{formatRupiah(p.price)}</td>
                     <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded text-[11px] font-medium block w-max", p.status === "in_stock" ? "bg-[#ECFDF5] text-[#16A34A]" : "bg-[#FEF2F2] text-[#B33A3A]")}>
                           {p.status === "in_stock" ? "Tersedia" : "Terjual"}
                        </span>
                     </td>
                     <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded text-[11px] font-medium block w-max", p.siap === "siap_huni" ? "bg-[#FEF9EC] text-[#B45309]" : p.siap === "siap_kosong" ? "bg-[#EFF6FF] text-[#1D4ED8]" : "bg-[#F5F3FF] text-[#7C3AED]")}>
                           {Object.entries(siapLabel).find(([k])=>k===p.siap)?.[1]||p.siap}
                        </span>
                     </td>
                     <td className="px-4 py-3 text-center">
                        {p.carport ? <Check className="w-4 h-4 mx-auto text-[#16A34A]" /> : <X className="w-4 h-4 mx-auto text-[#B33A3A]" />}
                     </td>
                     {role === "superadmin" && (
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                           <div className="flex gap-3">
                              <Link href={`/agent/properties/${p.id}/edit`} onClick={e => e.stopPropagation()} className="text-[#6B6B6B] hover:text-[#C9A961]"><Pencil className="w-[18px] h-[18px]" /></Link>
                              <button onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); setDeleteName(p.nama_property); }} className="text-[#6B6B6B] hover:text-[#B33A3A]"><Trash2 className="w-[18px] h-[18px]" /></button>
                           </div>
                        </td>
                     )}
                  </tr>
               ))}
            </tbody>
         </table>
         {paginated.length === 0 && <div className="p-8 text-center text-[#6B6B6B] text-[13px]">Tidak ada data.</div>}
      </div>

      {/* Pagination */}
      <div className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-3 px-4 flex justify-between items-center text-[13px]">
         <div className="text-[#6B6B6B]">Menampilkan {(page-1)*perPage + 1}-{Math.min(page*perPage, filtered.length)} dari {filtered.length} properti</div>
         <div className="flex items-center gap-4">
            <Select value={perPage.toString()} onChange={(v) => {setPerPage(Number(v)); setPage(1);}} options={perPageOptions} className="w-[75px]" />
            <div className="flex gap-1">
               <button onClick={()=>setPage(p=>Math.max(1, p-1))} disabled={page===1} className="px-2 py-1 rounded border border-[#E0E0E0] disabled:opacity-40">Prev</button>
               <div className="px-3 py-1 rounded bg-[#C9A961] text-[#1A1A1A] font-medium">{page}</div>
               <button onClick={()=>setPage(p=>Math.min(totalPages, p+1))} disabled={page===totalPages} className="px-2 py-1 rounded border border-[#E0E0E0] disabled:opacity-40">Next</button>
            </div>
         </div>
      </div>


      <AnimatePresence>
         {deleteId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm flex justify-center items-center p-4">
               <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl max-w-[400px] w-full p-8 shadow-2xl text-center">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-[#B33A3A]" />
                  <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-2">Hapus Properti</h3>
                  <p className="text-[14px] text-[#6B6B6B] mb-2">Apakah Anda yakin ingin menghapus properti ini?</p>
                  <p className="text-[14px] font-semibold text-[#1A1A1A] mb-8">&ldquo;{deleteName}&rdquo;</p>
                  <div className="flex justify-center gap-3">
                     <button disabled={isPending} onClick={() => startTransition(doDelete)} className="font-semibold px-6 py-2.5 rounded text-[14px] text-white bg-[#B33A3A] disabled:opacity-70">{isPending ? "Menghapus..." : "Hapus"}</button>
                     <button disabled={isPending} onClick={() => setDeleteId(null)} className="text-[#6B6B6B] px-4 font-medium text-[14px]">Batal</button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
         {selectedProp && (
            <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProp(null)} className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm"></motion.div>
               <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3 }} className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[480px] bg-[#FFFFFF] shadow-2xl flex flex-col">
                  <div className="p-8 overflow-y-auto flex-1">
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-2">
                           <span className={cn("px-2.5 py-1 rounded text-[11px] font-bold uppercase", selectedProp.status === "in_stock" ? "bg-[#ECFDF5] text-[#16A34A]" : "bg-[#FEF2F2] text-[#B33A3A]")}>{selectedProp.status === "in_stock" ? "Tersedia" : "Terjual"}</span>
                           <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase bg-[#1A1A1A] text-white">{selectedProp.tipe}</span>
                        </div>
                        <div className="flex gap-4 items-center">
                           {role === "superadmin" && <Link href={`/agent/properties/${selectedProp.id}/edit`} className="text-[13px] font-semibold text-[#6B6B6B] hover:text-[#C9A961]">Edit</Link>}
                           <button onClick={()=>setSelectedProp(null)} className="text-[#6B6B6B] hover:text-[#1A1A1A]"><X className="w-6 h-6" /></button>
                        </div>
                     </div>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={(selectedProp.tipe === "Ruko" ? "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800" : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800")} alt={selectedProp.nama_property} className="w-full h-[220px] object-cover rounded-lg mb-6" />
                     <h2 className="font-display text-[24px] text-[#1A1A1A] leading-tight mb-2">{selectedProp.nama_property}</h2>
                     <div className="flex items-center gap-1.5 text-[14px] text-[#6B6B6B] mb-6">
                        <MapPin className="w-4 h-4" /> {selectedProp.kawasan} {selectedProp.group_name && `- ${selectedProp.group_name}`}
                     </div>

                     <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                           ["Lebar", `${selectedProp.lebar} m`],
                           ["Panjang", `${selectedProp.panjang} m`],
                           ["Hadap", selectedProp.hadap.join(", ")],
                           ["Tingkat", `${selectedProp.tingkat} Lt`],
                           ["Carport", selectedProp.carport ? "Ada" : "Tidak"],
                           ["Siap", Object.entries(siapLabel).find(([k])=>k===selectedProp.siap)?.[1]||selectedProp.siap],
                        ].map(([k,v]) => (
                           <div key={k} className="bg-[#F5F5F5] p-3 rounded">
                              <div className="text-[11px] text-[#6B6B6B] uppercase">{k}</div>
                              <div className="text-[13px] font-semibold text-[#1A1A1A] mt-1">{v}</div>
                           </div>
                        ))}
                     </div>
                     <div className="text-[14px] font-bold text-[#1A1A1A] mb-4">Luas Total: {(selectedProp.lebar * selectedProp.panjang).toFixed(1)} m²</div>
                     <div className="font-display text-[28px] font-bold text-[#C9A961] mb-6">{formatRupiah(selectedProp.price)}</div>

                     {selectedProp.maps_link && (
                        <a href={selectedProp.maps_link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-2.5 border border-[#C9A961] text-[#C9A961] rounded-md font-semibold text-[13px] hover:bg-[#FEF9EC] transition-colors mb-6">
                           <ExternalLink className="w-4 h-4" /> Buka di Google Maps
                        </a>
                     )}
                     
                     <div className="space-y-1">
                        <div className="text-[12px] text-[#6B6B6B]">Unit / Keterangan: <strong className="text-[#1A1A1A] font-normal">{selectedProp.unit || "-"}</strong></div>
                        <div className="text-[12px] text-[#6B6B6B]">Ditambahkan: <strong className="text-[#1A1A1A] font-normal">{formatTanggal(selectedProp.created_at!)} oleh {selectedProp.created_by}</strong></div>
                     </div>
                  </div>
                  {role === "admin" && (
                     <div className="p-8 border-t border-[#E0E0E0] bg-[#FAFAFA]">
                        <button className="w-full bg-[#25D366] text-white py-3 rounded-lg font-semibold text-[14px] hover:bg-[#1DA851] transition-colors">Hubungi via WhatsApp</button>
                     </div>
                  )}
               </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
}
