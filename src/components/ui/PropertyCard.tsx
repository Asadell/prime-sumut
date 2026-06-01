"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { siapLabel } from "@/data/properties";
import type { Property } from "@/data/properties";
import Image from "next/image";

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);

export function PropertyCard({ property, onClick }: { property: Property; onClick?: () => void }) {
  const sold = property.status === "sold_out";
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="group bg-white border border-[#E0E0E0] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gold"
    >
      <div className="relative overflow-hidden h-[200px] rounded-t-lg">
        <Image
          src={property.image}
          alt={`Foto ${property.nama} di kawasan ${property.kawasan}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 z-10" />
        <span
          className={cn(
            "absolute top-3 left-3 z-20 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded",
            sold ? "bg-red-accent text-white" : "bg-gold text-text-primary",
          )}
        >
          {sold ? "Terjual" : "Tersedia"}
        </span>
        <span className="absolute top-3 right-3 z-20 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-text-primary/80 text-white">
          {property.tipe}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold text-text-primary font-sans">{property.nama}</h3>
        <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
          <MapPin className="w-3.5 h-3.5" />
          <span>{property.kawasan}</span>
        </div>
        <p className="text-[13px] text-text-muted">
          L: {property.lebar}m × P: {property.panjang}m · Hadap: {property.hadap.join(", ")} · {property.tingkat} Lantai
        </p>
        <div className="pt-1">
          <p className="text-xl font-bold text-gold">{formatRupiah(property.harga)}</p>
          <p className="text-xs text-text-muted">
            {property.carport ? "Carport tersedia" : siapLabel[property.siap]}
          </p>
        </div>
        <button className="mt-2 w-full text-sm font-semibold border border-gold text-gold hover:bg-gold hover:text-text-primary transition-colors py-2.5 rounded">
          Lihat Detail →
        </button>
      </div>
    </motion.article>
  );
}
