"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Building2, PlusCircle, UserCog, LogOut, 
  Bell, CheckCircle, XCircle, MapPin, Search,
  Pencil, Trash2, X, Lock, Loader2, UserPlus, Key, UserX, AlertTriangle, ExternalLink, Check
} from "lucide-react";
import { properties as initialProperties, kawasanList, hadapList, siapLabel } from "@/data/properties";
import type { Property } from "@/data/properties";
import { admins as initialAdmins } from "@/data/admins";
import type { Admin } from "@/data/admins";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);

const formatTanggal = (str: string) =>
  new Date(str).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

export function DashboardClient() {
  const router = useRouter();
  const [role, setRole] = useState("superadmin");
  const [tab, setTab] = useState("overview"); 
  const [propertiesList, setPropertiesList] = useState<Property[]>(initialProperties as any);
  const [adminList, setAdminList] = useState<Admin[]>(initialAdmins);
  const [toast, setToast] = useState<{message: string, sub?: string} | null>(null);

  useEffect(() => {
    const r = localStorage.getItem("prime_role");
    if (!r) router.push("/agent/login");
    else setRole(r);
  }, [router]);

  const logout = () => { localStorage.removeItem("prime_role"); router.push("/agent/login"); };
  const switchRole = (r: string) => { localStorage.setItem("prime_role", r); setRole(r); };

  const showToast = (message: string, sub?: string) => {
    setToast({ message, sub });
    setTimeout(() => setToast(null), 3000);
  };

  const navs = [
    { id: "overview", icon: LayoutDashboard, label: "Ringkasan" },
    { id: "properti", icon: Building2, label: "Daftar Properti" },
    ...(role === "superadmin" ? [{ id: "tambah", icon: PlusCircle, label: "Tambah Properti" }] : []),
    ...(role === "superadmin" ? [{ id: "kelola_admin", icon: UserCog, label: "Kelola Admin" }] : []),
  ];

  return (
    <div className="min-h-screen flex bg-[#F5F5F5] font-sans text-[#1A1A1A]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#1A1A1A] border-r border-[#2E2E2E] min-h-screen flex flex-col fixed left-0 top-0 z-40">
        <div className="p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-square.png" alt="Prime" className="h-10 w-auto" />
          <div className="text-[10px] tracking-widest text-[#FFFFFF] opacity-30 mt-1 uppercase font-sans">Agent Portal</div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navs.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] transition-colors",
                tab === n.id ? "bg-[#C9A961] text-[#1A1A1A] font-semibold" : "text-white/70 hover:bg-[#2E2E2E] hover:text-white"
              )}
            >
              <n.icon className="w-[18px] h-[18px]" /> {n.label}
            </button>
          ))}
        </nav>

        <div className="px-4 pb-4">
          <div className="mb-6">
             <div className="text-[10px] text-white/20 uppercase tracking-widest mb-2 px-2">Mode Demo</div>
             <div className="flex gap-2">
                <button onClick={() => switchRole("admin")} className={cn("flex-1 text-[11px] py-1.5 rounded border transition-all", role === "admin" ? "border-white/70 text-white opacity-70" : "border-[#2E2E2E] text-white opacity-50")}>Admin</button>
                <button onClick={() => switchRole("superadmin")} className={cn("flex-1 text-[11px] py-1.5 rounded transition-all", role === "superadmin" ? "bg-[#C9A961] text-[#1A1A1A] font-semibold" : "border border-[#2E2E2E] text-white opacity-50")}>Superadmin</button>
             </div>
          </div>

          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#C9A961] text-[#1A1A1A] font-display font-bold flex items-center justify-center shrink-0">AF</div>
            <div className="leading-tight overflow-hidden">
              <p className="text-[13px] font-semibold text-white truncate">Ahmad Fauzi</p>
              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block uppercase", role === "superadmin" ? "bg-[#C9A961] text-[#1A1A1A]" : "bg-[#2E2E2E] text-white")}>
                {role}
              </span>
            </div>
          </div>
          
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] text-white/70 hover:bg-[#2E2E2E] hover:text-white transition-colors">
            <LogOut className="w-[18px] h-[18px]" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[240px] flex flex-col min-h-screen overflow-x-hidden">
        {/* Topbar */}
        <header className="h-[56px] bg-[#FFFFFF] border-b border-[#E0E0E0] px-8 flex items-center justify-between sticky top-0 z-30">
           <h1 className="text-[16px] font-semibold text-[#1A1A1A]">
             {navs.find(n => n.id === tab)?.label || "Dashboard"}
           </h1>
           <div className="flex items-center gap-5">
              <button className="text-[#6B6B6B] hover:text-[#1A1A1A]"><Bell className="w-5 h-5" /></button>
              <div className="w-8 h-8 rounded-full bg-[#C9A961] text-[#1A1A1A] flex items-center justify-center font-bold text-sm cursor-pointer">AF</div>
           </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex-1 w-full max-w-full">
          {tab === "overview" && <OverviewTab properties={propertiesList} />}
          {tab === "properti" && <PropertiesTab properties={propertiesList} role={role} setTab={setTab} />}
          {tab === "tambah" && <AddPropertyTab role={role} setTab={setTab} properties={propertiesList} setProperties={setPropertiesList} showToast={showToast} />}
          {tab === "kelola_admin" && <ManageAdminsTab role={role} admins={adminList} setAdmins={setAdminList} showToast={showToast} />}
        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-6 right-6 z-50 bg-[#FFFFFF] border-l-4 border-[#16A34A] shadow-lg rounded p-4 flex gap-3 max-w-sm">
            <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-[#1A1A1A]">{toast.message}</p>
              {toast.sub && <p className="text-[13px] text-[#6B6B6B] mt-0.5">{toast.sub}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// TAB: OVERVIEW
// ==========================================
function OverviewTab({ properties }: { properties: Property[] }) {
  const total = properties.length;
  const inStock = properties.filter(p => p.status === "in_stock").length;
  const soldOut = properties.filter(p => p.status === "sold_out").length;
  const uniqueKawasan = new Set(properties.map(p => p.kawasan)).size;

  const recent = [...properties].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()).slice(0, 5);
  
  const byKawasan = properties.reduce((acc, p) => {
    acc[p.kawasan] = (acc[p.kawasan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
       {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "Total Properti", v: total, i: Building2, c: "text-[#C9A961]" },
            { l: "Tersedia", v: inStock, i: CheckCircle, c: "text-[#16A34A]" },
            { l: "Terjual", v: soldOut, i: XCircle, c: "text-[#B33A3A]" },
            { l: "Kawasan Aktif", v: uniqueKawasan, i: MapPin, c: "text-[#C9A961]" }
          ].map(s => (
            <div key={s.l} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5">
               <div className="flex justify-between items-start mb-2">
                 <div className="text-[13px] text-[#6B6B6B]">{s.l}</div>
                 <s.i className={cn("w-5 h-5", s.c)} />
               </div>
               <div className="text-[28px] font-semibold text-[#1A1A1A]">{s.v}</div>
            </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg overflow-hidden flex flex-col">
             <div className="p-4 border-b border-[#E0E0E0]">
                <h3 className="text-[14px] font-semibold text-[#1A1A1A]">5 Properti Terbaru</h3>
             </div>
             <table className="w-full text-left">
               <thead className="bg-[#F5F5F5] text-[12px] font-semibold text-[#6B6B6B] uppercase">
                 <tr>
                   <th className="px-4 py-3">Nama</th>
                   <th className="px-4 py-3">Kawasan</th>
                   <th className="px-4 py-3">Tipe</th>
                   <th className="px-4 py-3">Harga</th>
                   <th className="px-4 py-3">Status</th>
                 </tr>
               </thead>
               <tbody className="text-[13px]">
                 {recent.map(p => (
                   <tr key={p.id} className="border-t border-[#E0E0E0] hover:bg-[#F5F5F5]">
                     <td className="px-4 py-3 font-medium text-[#1A1A1A]">{p.nama}</td>
                     <td className="px-4 py-3 text-[#6B6B6B]">{p.kawasan}</td>
                     <td className="px-4 py-3 text-[#6B6B6B]">{p.tipe}</td>
                     <td className="px-4 py-3 text-[#1A1A1A]">{formatRupiah(p.harga)}</td>
                     <td className="px-4 py-3">
                        <span className={cn("px-2 py-1 rounded text-[11px] font-medium", p.status === "in_stock" ? "bg-[#ECFDF5] text-[#16A34A]" : "bg-[#FEF2F2] text-[#B33A3A]")}>
                           {p.status === "in_stock" ? "Tersedia" : "Terjual"}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             <div className="p-3 bg-[#FAFAFA] border-t border-[#E0E0E0] text-center mt-auto">
                <button className="text-[13px] text-[#C9A961] font-medium hover:underline">Lihat Semua →</button>
             </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-6">
             <h3 className="text-[14px] font-semibold text-[#1A1A1A] mb-6">Sebaran Properti per Kawasan</h3>
             <div className="space-y-4">
                {Object.entries(byKawasan).sort((a,b)=>b[1]-a[1]).map(([k, v]) => (
                   <div key={k} className="flex items-center gap-3">
                      <div className="w-24 text-[13px] text-[#1A1A1A] truncate">{k}</div>
                      <div className="flex-1 h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                         <div className="h-full bg-[#C9A961] rounded-full" style={{ width: `${(v/total)*100}%` }}></div>
                      </div>
                      <div className="w-6 text-right text-[12px] text-[#6B6B6B]">{v}</div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
}

// ==========================================
// TAB: PROPERTIES
// ==========================================
function PropertiesTab({ properties, role, setTab }: { properties: Property[], role: string, setTab: (t: string) => void }) {
  const [q, setQ] = useState("");
  const [tipe, setTipe] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [kawasan, setKawasan] = useState("Semua");
  const [hargaMax, setHargaMax] = useState("");
  const [hadap, setHadap] = useState("Semua");
  const [siap, setSiap] = useState("Semua");
  const [carport, setCarport] = useState("Semua");
  const [sort, setSort] = useState("Terbaru");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);

  const filtered = useMemo(() => {
    let list = properties.filter((p) => {
      if (q && !`${p.nama} ${p.kawasan} ${p.group||""}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (tipe !== "Semua" && p.tipe !== tipe) return false;
      if (status === "Tersedia" && p.status !== "in_stock") return false;
      if (status === "Terjual" && p.status !== "sold_out") return false;
      if (kawasan !== "Semua" && p.kawasan !== kawasan) return false;
      if (hargaMax && p.harga > Number(hargaMax)) return false;
      if (hadap !== "Semua" && !p.hadap.includes(hadap)) return false;
      if (siap !== "Semua" && p.siap !== siap) return false;
      if (carport === "Ada" && !p.carport) return false;
      if (carport === "Tidak Ada" && p.carport) return false;
      return true;
    });

    if (sort === "Harga ↑") list = [...list].sort((a, b) => a.harga - b.harga);
    else if (sort === "Harga ↓") list = [...list].sort((a, b) => b.harga - a.harga);
    else if (sort === "Nama A-Z") list = [...list].sort((a, b) => a.nama.localeCompare(b.nama));
    else list = [...list].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    return list;
  }, [properties, q, tipe, status, kawasan, hargaMax, hadap, siap, carport, sort]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const reset = () => {
    setQ(""); setTipe("Semua"); setStatus("Semua"); setKawasan("Semua");
    setHargaMax(""); setHadap("Semua"); setSiap("Semua"); setCarport("Semua");
  };

  const activeChips = [
    tipe !== "Semua" && { k: "Tipe", v: tipe, clear: () => setTipe("Semua") },
    status !== "Semua" && { k: "Status", v: status, clear: () => setStatus("Semua") },
    kawasan !== "Semua" && { k: "Kawasan", v: kawasan, clear: () => setKawasan("Semua") },
    hargaMax && { k: "Max", v: formatRupiah(Number(hargaMax)), clear: () => setHargaMax("") },
    hadap !== "Semua" && { k: "Hadap", v: hadap, clear: () => setHadap("Semua") },
    siap !== "Semua" && { k: "Siap", v: (siapLabel as any)[siap]||siap, clear: () => setSiap("Semua") },
    carport !== "Semua" && { k: "Carport", v: carport, clear: () => setCarport("Semua") },
  ].filter(Boolean) as { k: string, v: string, clear: () => void }[];

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
            <button onClick={() => setTab("tambah")} className="flex items-center gap-2 bg-[#C9A961] text-[#1A1A1A] px-4 py-2 rounded-md font-semibold text-[13px]">
              <PlusCircle className="w-4 h-4" /> Tambah Properti
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-4 text-[13px]">
          <select value={tipe} onChange={(e) => setTipe(e.target.value)} className="bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3 py-1.5 outline-none focus:border-[#C9A961]">
             <option value="Semua">Semua Tipe</option><option value="Ruko">Ruko</option><option value="Villa">Villa</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3 py-1.5 outline-none focus:border-[#C9A961]">
             <option value="Semua">Semua Status</option><option value="Tersedia">Tersedia</option><option value="Terjual">Terjual</option>
          </select>
          <select value={kawasan} onChange={(e) => setKawasan(e.target.value)} className="bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3 py-1.5 outline-none focus:border-[#C9A961]">
             <option value="Semua">Semua Kawasan</option>
             {kawasanList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <input type="number" placeholder="Harga Max" value={hargaMax} onChange={(e) => setHargaMax(e.target.value)} className="bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3 py-1.5 outline-none focus:border-[#C9A961] w-32" />
          <select value={hadap} onChange={(e) => setHadap(e.target.value)} className="bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3 py-1.5 outline-none focus:border-[#C9A961]">
             <option value="Semua">Semua Hadap</option>
             {hadapList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <select value={siap} onChange={(e) => setSiap(e.target.value)} className="bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3 py-1.5 outline-none focus:border-[#C9A961]">
             <option value="Semua">Semua Kesiapan</option>
             {Object.entries(siapLabel).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={carport} onChange={(e) => setCarport(e.target.value)} className="bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3 py-1.5 outline-none focus:border-[#C9A961]">
             <option value="Semua">Carport</option><option value="Ada">Ada</option><option value="Tidak Ada">Tidak Ada</option>
          </select>
          <button onClick={reset} className="text-[#6B6B6B] underline text-[12px] ml-2">Reset</button>
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
             {activeChips.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[12px] bg-[#FEF9EC] border border-[#C9A961] text-[#1A1A1A] px-2 py-0.5 rounded">
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
         <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-[13px] bg-white border border-[#E0E0E0] rounded px-3 py-1.5 outline-none focus:border-[#C9A961]">
            <option>Terbaru</option><option>Harga ↑</option><option>Harga ↓</option><option>Nama A-Z</option>
         </select>
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
                        <div className="text-[14px] font-semibold text-[#1A1A1A] truncate">{p.nama}</div>
                        <div className="text-[12px] text-[#6B6B6B] truncate">{p.kawasan} {p.group ? `- ${p.group}` : ''}</div>
                     </td>
                     <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded text-[11px] font-medium", p.tipe === "Ruko" ? "bg-[#EFF6FF] text-[#1D4ED8]" : "bg-[#F5F3FF] text-[#7C3AED]")}>
                           {p.tipe}
                        </span>
                     </td>
                     <td className="px-4 py-3 text-[13px] text-[#1A1A1A]">{p.lebar} × {p.panjang} m</td>
                     <td className="px-4 py-3 text-[13px] text-[#6B6B6B] truncate">{p.hadap.join(", ")}</td>
                     <td className="px-4 py-3 text-[13px] font-semibold text-[#C9A961]">{formatRupiah(p.harga)}</td>
                     <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded text-[11px] font-medium block w-max", p.status === "in_stock" ? "bg-[#ECFDF5] text-[#16A34A]" : "bg-[#FEF2F2] text-[#B33A3A]")}>
                           {p.status === "in_stock" ? "Tersedia" : "Terjual"}
                        </span>
                     </td>
                     <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded text-[11px] font-medium block w-max", p.siap === "siap_huni" ? "bg-[#FEF9EC] text-[#B45309]" : p.siap === "siap_kosong" ? "bg-[#EFF6FF] text-[#1D4ED8]" : "bg-[#F5F3FF] text-[#7C3AED]")}>
                           {(siapLabel as any)[p.siap]}
                        </span>
                     </td>
                     <td className="px-4 py-3 text-center">
                        {p.carport ? <Check className="w-4 h-4 mx-auto text-[#16A34A]" /> : <X className="w-4 h-4 mx-auto text-[#B33A3A]" />}
                     </td>
                     {role === "superadmin" && (
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                           <div className="flex gap-3">
                              <button className="text-[#6B6B6B] hover:text-[#C9A961]"><Pencil className="w-[18px] h-[18px]" /></button>
                              <button className="text-[#6B6B6B] hover:text-[#B33A3A]"><Trash2 className="w-[18px] h-[18px]" /></button>
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
            <select value={perPage} onChange={(e)=>{setPerPage(Number(e.target.value)); setPage(1);}} className="text-[#6B6B6B] outline-none">
               <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
            </select>
            <div className="flex gap-1">
               <button onClick={()=>setPage(p=>Math.max(1, p-1))} disabled={page===1} className="px-2 py-1 rounded border border-[#E0E0E0] disabled:opacity-40">Prev</button>
               <div className="px-3 py-1 rounded bg-[#C9A961] text-[#1A1A1A] font-medium">{page}</div>
               <button onClick={()=>setPage(p=>Math.min(totalPages, p+1))} disabled={page===totalPages} className="px-2 py-1 rounded border border-[#E0E0E0] disabled:opacity-40">Next</button>
            </div>
         </div>
      </div>

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
                           {role === "superadmin" && <button className="text-[13px] font-semibold text-[#6B6B6B] hover:text-[#C9A961]">Edit</button>}
                           <button onClick={()=>setSelectedProp(null)} className="text-[#6B6B6B] hover:text-[#1A1A1A]"><X className="w-6 h-6" /></button>
                        </div>
                     </div>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={selectedProp.image} alt={selectedProp.nama} className="w-full h-[220px] object-cover rounded-lg mb-6" />
                     <h2 className="font-display text-[24px] text-[#1A1A1A] leading-tight mb-2">{selectedProp.nama}</h2>
                     <div className="flex items-center gap-1.5 text-[14px] text-[#6B6B6B] mb-6">
                        <MapPin className="w-4 h-4" /> {selectedProp.kawasan} {selectedProp.group && `— ${selectedProp.group}`}
                     </div>

                     <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                           ["Lebar", `${selectedProp.lebar} m`],
                           ["Panjang", `${selectedProp.panjang} m`],
                           ["Hadap", selectedProp.hadap.join(", ")],
                           ["Tingkat", `${selectedProp.tingkat} Lt`],
                           ["Carport", selectedProp.carport ? "Ada" : "Tidak"],
                           ["Siap", (siapLabel as any)[selectedProp.siap]],
                        ].map(([k,v]) => (
                           <div key={k} className="bg-[#F5F5F5] p-3 rounded">
                              <div className="text-[11px] text-[#6B6B6B] uppercase">{k}</div>
                              <div className="text-[13px] font-semibold text-[#1A1A1A] mt-1">{v}</div>
                           </div>
                        ))}
                     </div>
                     <div className="text-[14px] font-bold text-[#1A1A1A] mb-4">Luas Total: {(selectedProp.lebar * selectedProp.panjang).toFixed(1)} m²</div>
                     <div className="font-display text-[28px] font-bold text-[#C9A961] mb-6">{formatRupiah(selectedProp.harga)}</div>

                     {selectedProp.maps_link && (
                        <a href={selectedProp.maps_link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-2.5 border border-[#C9A961] text-[#C9A961] rounded-md font-semibold text-[13px] hover:bg-[#FEF9EC] transition-colors mb-6">
                           <ExternalLink className="w-4 h-4" /> Buka di Google Maps
                        </a>
                     )}
                     
                     <div className="space-y-1">
                        <div className="text-[12px] text-[#6B6B6B]">Unit / Keterangan: <strong className="text-[#1A1A1A] font-normal">{selectedProp.unit || "-"}</strong></div>
                        <div className="text-[12px] text-[#6B6B6B]">Ditambahkan: <strong className="text-[#1A1A1A] font-normal">{formatTanggal(selectedProp.createdAt!)} oleh {selectedProp.createdBy}</strong></div>
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

// ==========================================
// TAB: ADD PROPERTY (Superadmin Only)
// ==========================================
function AddPropertyTab({ role, setTab, properties, setProperties, showToast }: { role: string, setTab: (t: string) => void, properties: Property[], setProperties: (p: Property[]) => void, showToast: (m: string, s?: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
     nama: "", group: "", lebar: "", panjang: "", tipe: "Ruko", tingkat: "", carport: false, harga: "", status: "in_stock", siap: "siap_huni", kawasan: "Krakatau", maps_link: "", unit: ""
  });
  const [hadap, setHadap] = useState<string[]>([]);
  
  if (role !== "superadmin") {
     return (
        <div className="bg-[#FEF2F2] border border-[#B33A3A] rounded-lg p-12 text-center text-[#B33A3A] flex flex-col items-center justify-center min-h-[400px]">
           <Lock className="w-12 h-12 mb-4" />
           <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-2">Akses Ditolak</h2>
           <p className="text-[14px] text-[#6B6B6B]">Fitur ini hanya tersedia untuk Superadmin.</p>
        </div>
     );
  }

  const submit = (e: React.FormEvent) => {
     e.preventDefault();
     if (!form.nama.trim() || !form.lebar || !form.panjang || hadap.length===0 || !form.tingkat || !form.harga) {
        showToast("Form tidak lengkap", "Pastikan semua field wajib (*) terisi.");
        return;
     }
     setLoading(true);
     setTimeout(() => {
        const newProp = {
           id: Date.now(),
           ...form,
           nama: form.nama.trim(),
           group: form.group.trim(),
           unit: form.unit.trim(),
           maps_link: form.maps_link.trim(),
           lebar: Number(form.lebar), panjang: Number(form.panjang), tingkat: Number(form.tingkat), harga: Number(form.harga),
           hadap,
           createdAt: new Date().toISOString(), createdBy: "Ahmad Fauzi",
           image: form.tipe === "Ruko" ? "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800" : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
        } as Property;
        setProperties([newProp, ...properties]);
        setLoading(false);
        setTab("properti");
        showToast("Properti berhasil ditambahkan!", form.nama);
     }, 1200);
  };

  return (
     <div className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-8 max-w-4xl">
        <h2 className="text-[20px] font-semibold text-[#1A1A1A] mb-1">Tambah Properti Baru</h2>
        <p className="text-[13px] text-[#6B6B6B] mb-8">Isi semua field wajib (*) dengan benar.</p>

        <form onSubmit={submit} className="space-y-5">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Nama Properti *</label>
                 <input required minLength={3} maxLength={100} value={form.nama} onChange={e=>setForm({...form, nama:e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
              </div>
              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Group / Proyek</label>
                 <input value={form.group} onChange={e=>setForm({...form, group:e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
              </div>

              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Lebar (m) *</label>
                 <input required type="number" step="0.5" min="0.1" value={form.lebar} onChange={e=>setForm({...form, lebar:e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
              </div>
              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Panjang (m) *</label>
                 <input required type="number" step="0.5" min="0.1" value={form.panjang} onChange={e=>setForm({...form, panjang:e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
              </div>

              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Hadap *</label>
                 <div className="flex gap-2">
                    {hadapList.map(h => (
                       <button key={h} type="button" onClick={()=>{setHadap(prev => prev.includes(h) ? prev.filter(x=>x!==h) : [...prev, h])}} className={cn("px-3 py-2 border rounded text-[13px] transition-colors", hadap.includes(h) ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A]")}>{h}</button>
                    ))}
                 </div>
              </div>
              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Tipe *</label>
                 <div className="flex gap-2">
                    {["Ruko", "Villa"].map(t => (
                       <button key={t} type="button" onClick={()=>setForm({...form, tipe:t})} className={cn("px-4 py-2 border rounded text-[13px] transition-colors", form.tipe === t ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A]")}>{t}</button>
                    ))}
                 </div>
              </div>

              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Tingkat *</label>
                 <input required type="number" step="0.5" min="1" max="10" value={form.tingkat} onChange={e=>setForm({...form, tingkat:e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
              </div>
              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Carport</label>
                 <div className="flex gap-2">
                    {["Ya", "Tidak"].map(c => (
                       <button key={c} type="button" onClick={()=>setForm({...form, carport:c==="Ya"})} className={cn("px-4 py-2 border rounded text-[13px] transition-colors", (form.carport && c==="Ya") || (!form.carport && c==="Tidak") ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A]")}>{c}</button>
                    ))}
                 </div>
              </div>

              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Harga (Rp) *</label>
                 <input required type="number" min="1" value={form.harga} onChange={e=>setForm({...form, harga:e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
                 {form.harga && <div className="text-[11px] text-[#6B6B6B] mt-1">{formatRupiah(Number(form.harga))}</div>}
              </div>
              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Status *</label>
                 <div className="flex gap-2">
                    {[{l:"Tersedia",v:"in_stock"}, {l:"Terjual",v:"sold_out"}].map(s => (
                       <button key={s.v} type="button" onClick={()=>setForm({...form, status:s.v})} className={cn("px-4 py-2 border rounded text-[13px] transition-colors", form.status === s.v ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-[#F5F5F5] border-[#E0E0E0] text-[#1A1A1A]")}>{s.l}</button>
                    ))}
                 </div>
              </div>

              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Siap *</label>
                 <select required value={form.siap} onChange={e=>setForm({...form, siap:e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20">
                    {Object.entries(siapLabel).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                 </select>
              </div>
              <div>
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Kawasan *</label>
                 <select required value={form.kawasan} onChange={e=>setForm({...form, kawasan:e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20">
                    {kawasanList.map(k => <option key={k} value={k}>{k}</option>)}
                 </select>
              </div>

              <div className="md:col-span-2">
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Link Google Maps</label>
                 <input type="url" placeholder="https://maps.google.com/?q=..." value={form.maps_link} onChange={e=>setForm({...form, maps_link:e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
              </div>
              
              <div className="md:col-span-2">
                 <label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-2">Unit / Keterangan</label>
                 <input placeholder="Ready Siap Huni, Gate siap, dll" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-md px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20" />
              </div>
           </div>

           <div className="flex gap-4 pt-4 border-t border-[#E0E0E0] mt-8">
              <button disabled={loading} type="submit" className="bg-[#C9A961] text-[#1A1A1A] px-6 py-2.5 rounded-lg font-semibold text-[15px] flex items-center gap-2 hover:bg-[#b59857] transition-colors disabled:opacity-70">
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null} {loading ? "Menyimpan..." : "Simpan Properti"}
              </button>
              <button disabled={loading} type="button" onClick={()=>setTab("properti")} className="border border-[#E0E0E0] text-[#6B6B6B] px-6 py-2.5 rounded-lg font-medium text-[15px] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors">Batal</button>
           </div>
        </form>
     </div>
  );
}

// ==========================================
// TAB: MANAGE ADMINS (Superadmin Only)
// ==========================================
function ManageAdminsTab({ role, admins, setAdmins, showToast }: { role: string, admins: Admin[], setAdmins: (a: Admin[]) => void, showToast: (m: string, s?: string) => void }) {
  const [modal, setModal] = useState<{type: 'add'|'reset'|'disable'|'delete', id?: number} | null>(null);

  if (role !== "superadmin") {
     return (
        <div className="bg-[#FEF2F2] border border-[#B33A3A] rounded-lg p-12 text-center text-[#B33A3A] flex flex-col items-center justify-center min-h-[400px]">
           <Lock className="w-12 h-12 mb-4" />
           <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-2">Akses Ditolak</h2>
           <p className="text-[14px] text-[#6B6B6B]">Fitur ini hanya tersedia untuk Superadmin.</p>
        </div>
     );
  }

  const toggleStatus = (id: number) => {
     setAdmins(admins.map(a => a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a));
  };

  const handleAction = () => {
     if (modal?.type === 'delete') setAdmins(admins.filter(a => a.id !== modal.id));
     if (modal?.type === 'disable') setAdmins(admins.map(a => a.id === modal.id ? { ...a, status: "inactive" } : a));
     setModal(null);
     showToast("Berhasil", "Aksi pada admin telah dijalankan.");
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
                             <div className="w-8 h-8 rounded-full bg-[#E0E0E0] text-[#1A1A1A] font-bold text-[11px] flex items-center justify-center shrink-0">{a.nama.split(" ").map(n=>n[0]).join("").substring(0,2)}</div>
                             <div>
                                <div className="text-[14px] font-semibold text-[#1A1A1A]">{a.nama}</div>
                                <div className="text-[12px] text-[#6B6B6B]">{a.email}</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="bg-[#EFF6FF] text-[#1D4ED8] text-[11px] font-semibold px-2 py-1 rounded uppercase">{a.role}</span>
                       </td>
                       <td className="px-6 py-4">
                          <button onClick={()=>toggleStatus(a.id)} className="flex items-center gap-2 group outline-none">
                             <div className={cn("w-8 h-4 rounded-full relative transition-colors", a.status === "active" ? "bg-[#16A34A]" : "bg-[#E0E0E0]")}>
                                <div className={cn("w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all", a.status === "active" ? "left-4" : "left-1")}></div>
                             </div>
                             <span className={cn("text-[12px] font-medium", a.status === "active" ? "text-[#16A34A]" : "text-[#6B6B6B]")}>{a.status === "active" ? "Aktif" : "Nonaktif"}</span>
                          </button>
                       </td>
                       <td className="px-6 py-4 text-[13px] text-[#6B6B6B]">{formatTanggal(a.createdAt)}</td>
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
                       <form onSubmit={(e)=>{
                          e.preventDefault(); 
                          const form = e.target as any;
                          setAdmins([{id:Date.now(), nama:form.n.value.trim(), email:form.e.value.trim(), role:"admin", status:"active", createdAt:new Date().toISOString()}, ...admins]);
                          setModal(null); showToast("Admin Ditambahkan!", form.n.value.trim());
                       }} className="space-y-4">
                          <div><label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-1">Nama Lengkap *</label><input required name="n" className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961]" /></div>
                          <div><label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-1">Email *</label><input required type="email" name="e" className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961]" /></div>
                          <div><label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-1">Password *</label><input required type="password" minLength={8} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961]" /></div>
                          <div><label className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A] block mb-1">Konfirmasi Password *</label><input required type="password" minLength={8} className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-3.5 py-2.5 text-[14px] outline-none focus:border-[#C9A961]" /></div>
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
