"use client";

import Link from "next/link";
import { Building2, CheckCircle, XCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/database";

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);

export function OverviewStats({ properties }: { properties: Property[] }) {
  const total = properties.length;
  const inStock = properties.filter(p => p.status === "in_stock").length;
  const soldOut = properties.filter(p => p.status === "sold_out").length;
  const uniqueKawasan = new Set(properties.map(p => p.kawasan)).size;

  const recent = [...properties].sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()).slice(0, 5);
  
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
                     <td className="px-4 py-3 font-medium text-[#1A1A1A]">{p.nama_property}</td>
                     <td className="px-4 py-3 text-[#6B6B6B]">{p.kawasan}</td>
                     <td className="px-4 py-3 text-[#6B6B6B]">{p.tipe}</td>
                     <td className="px-4 py-3 text-[#1A1A1A]">{formatRupiah(p.price)}</td>
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
                <Link href="/agent/properties" className="text-[13px] text-[#C9A961] font-medium hover:underline">Lihat Semua →</Link>
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
