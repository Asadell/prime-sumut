"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, MapPin, Phone, MessageCircle, ExternalLink } from "lucide-react";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { SectionLabel } from "@/components/ui/SectionHeading";
import { FadeUp, StaggerGroup } from "@/components/ui/FadeUp";
import { properties, kawasanList, hadapList, siapLabel } from "@/data/properties";
import type { Property } from "@/data/properties";
import { cn } from "@/lib/utils";
import Image from "next/image";

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);

export function PropertiClient() {
  const [q, setQ] = useState("");
  const [tipe, setTipe] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [kawasan, setKawasan] = useState("Semua");
  const [hadap, setHadap] = useState("Semua");
  const [siap, setSiap] = useState("Semua");
  const [hargaMax, setHargaMax] = useState("");
  const [carport, setCarport] = useState("Semua");
  const [sort, setSort] = useState("Terbaru");
  const [selected, setSelected] = useState<Property | null>(null);

  const filtered = useMemo(() => {
    let list = properties.filter((p) => {
      if (q && !`${p.nama} ${p.kawasan}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (tipe !== "Semua" && p.tipe !== tipe) return false;
      if (status === "Tersedia" && p.status !== "in_stock") return false;
      if (status === "Terjual" && p.status !== "sold_out") return false;
      if (kawasan !== "Semua" && p.kawasan !== kawasan) return false;
      if (hadap !== "Semua" && !p.hadap.includes(hadap)) return false;
      if (siap !== "Semua" && p.siap !== siap) return false;
      if (hargaMax && p.harga > Number(hargaMax)) return false;
      if (carport === "Ya" && !p.carport) return false;
      if (carport === "Tidak" && p.carport) return false;
      return true;
    });
    if (sort === "Harga Terendah") list = [...list].sort((a, b) => a.harga - b.harga);
    if (sort === "Harga Tertinggi") list = [...list].sort((a, b) => b.harga - a.harga);
    return list;
  }, [q, tipe, status, kawasan, hadap, siap, hargaMax, carport, sort]);

  const reset = () => {
    setQ(""); setTipe("Semua"); setStatus("Semua"); setKawasan("Semua");
    setHadap("Semua"); setSiap("Semua"); setHargaMax(""); setCarport("Semua");
  };

  const activeChips = [
    tipe !== "Semua" && { k: "Tipe", v: tipe, clear: () => setTipe("Semua") },
    status !== "Semua" && { k: "Status", v: status, clear: () => setStatus("Semua") },
    kawasan !== "Semua" && { k: "Kawasan", v: kawasan, clear: () => setKawasan("Semua") },
    hadap !== "Semua" && { k: "Hadap", v: hadap, clear: () => setHadap("Semua") },
    siap !== "Semua" && { k: "Siap", v: siapLabel[siap] || siap, clear: () => setSiap("Semua") },
    hargaMax && { k: "Max", v: formatRupiah(Number(hargaMax)), clear: () => setHargaMax("") },
    carport !== "Semua" && { k: "Carport", v: carport, clear: () => setCarport("Semua") },
  ].filter(Boolean) as { k: string; v: string; clear: () => void }[];

  return (
    <>
      {/* Hero */}
      <section className="bg-bg-soft pt-32 pb-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <SectionLabel>Daftar Properti</SectionLabel>
            <h1 className="font-display text-5xl md:text-6xl text-text-primary mt-4 leading-[1.05]">
              Temukan Properti<br />yang Tepat untuk Anda.
            </h1>
            <p className="mt-6 text-base text-text-muted max-w-2xl">
              Lebih dari 500 listing Ruko &amp; Villa tersedia di seluruh kawasan strategis Sumatera Utara.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-white border-y border-[#E0E0E0] py-4 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nama, kawasan..."
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-bg-soft border border-[#E0E0E0] rounded-md focus:border-gold outline-none"
              />
            </div>

            <PillToggle value={tipe} setValue={setTipe} options={["Semua", "Ruko", "Villa"]} activeClass="bg-text-primary text-white" />
            <PillToggle value={status} setValue={setStatus} options={["Semua", "Tersedia", "Terjual"]} activeClass="bg-gold text-text-primary" />

            <select value={kawasan} onChange={(e) => setKawasan(e.target.value)} className="text-sm bg-bg-soft border border-[#E0E0E0] rounded-md px-3 py-2.5 focus:border-gold outline-none">
              <option>Semua</option>
              {kawasanList.map((k) => <option key={k}>{k}</option>)}
            </select>
            <select value={hadap} onChange={(e) => setHadap(e.target.value)} className="text-sm bg-bg-soft border border-[#E0E0E0] rounded-md px-3 py-2.5 focus:border-gold outline-none">
              <option value="Semua">Hadap: Semua</option>
              {hadapList.map((h) => <option key={h} value={h}>Hadap: {h}</option>)}
            </select>
            <select value={siap} onChange={(e) => setSiap(e.target.value)} className="text-sm bg-bg-soft border border-[#E0E0E0] rounded-md px-3 py-2.5 focus:border-gold outline-none">
              <option value="Semua">Siap: Semua</option>
              <option value="siap_huni">Siap Huni</option>
              <option value="siap_kosong">Siap Kosong</option>
              <option value="siap_huni_renovasi">Siap Renovasi</option>
            </select>
            <input
              type="number"
              value={hargaMax}
              onChange={(e) => setHargaMax(e.target.value)}
              placeholder="Harga max (Rp)"
              className="text-sm bg-bg-soft border border-[#E0E0E0] rounded-md px-3 py-2.5 w-44 focus:border-gold outline-none"
            />
            <PillToggle value={carport} setValue={setCarport} options={["Semua", "Ya", "Tidak"]} activeClass="bg-text-primary text-white" label="Carport:" />

            <button onClick={reset} className="text-[13px] underline text-text-muted hover:text-text-primary ml-auto">
              Reset Filter
            </button>
          </div>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activeChips.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-bg-soft border border-gold text-text-primary px-2.5 py-1 rounded">
                  {c.k}: {c.v}
                  <button onClick={c.clear} aria-label="Hapus filter"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="bg-bg-soft py-12 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[13px] text-text-muted">
              Menampilkan {filtered.length} dari {properties.length} properti
            </p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm bg-white border border-[#E0E0E0] rounded-md px-3 py-2 focus:border-gold outline-none">
              <option>Terbaru</option>
              <option>Harga Terendah</option>
              <option>Harga Tertinggi</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-12 text-center">
              <p className="text-text-muted">Tidak ada properti yang cocok dengan filter Anda.</p>
            </div>
          ) : (
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} onClick={() => setSelected(p)} />
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected && <PropertyModal property={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}

function PillToggle({ value, setValue, options, activeClass, label }: { value: string, setValue: (v: string) => void, options: string[], activeClass: string, label?: string }) {
  return (
    <div className="flex gap-1 items-center">
      {label && <span className="text-xs text-text-muted mr-1">{label}</span>}
      {options.map((o) => (
        <button
          key={o}
          onClick={() => setValue(o)}
          className={cn(
            "text-[13px] px-3 py-2 rounded-md border transition-colors",
            value === o
              ? cn("border-transparent", activeClass)
              : "border-[#E0E0E0] text-text-primary hover:border-text-primary bg-white",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function PropertyModal({ property: p, onClose }: { property: Property, onClose: () => void }) {
  const sold = p.status === "sold_out";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 md:p-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-2">
              <span className={cn("text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded", sold ? "bg-red-accent text-white" : "bg-gold text-text-primary")}>
                {sold ? "Terjual" : "Tersedia"}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-text-primary text-white">
                {p.tipe}
              </span>
            </div>
            <button onClick={onClose} aria-label="Tutup" className="text-text-muted hover:text-text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative h-[280px] rounded-lg overflow-hidden mb-6">
            <Image
              src={p.image}
              alt={`Foto ${p.nama} di kawasan ${p.kawasan}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-display text-[28px] text-text-primary leading-tight">{p.nama}</h2>
              <div className="flex items-center gap-1.5 text-sm text-text-muted mt-2">
                <MapPin className="w-4 h-4" /> {p.kawasan}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-5">
                {[
                  ["Lebar", `${p.lebar} m`],
                  ["Panjang", `${p.panjang} m`],
                  ["Hadap", p.hadap.join(", ")],
                  ["Tingkat", `${p.tingkat} lantai`],
                  ["Carport", p.carport ? "Ya" : "Tidak"],
                  ["Status", siapLabel[p.siap]],
                ].map(([k, v]) => (
                  <div key={k} className="bg-bg-soft rounded-md px-3 py-2.5">
                    <div className="text-[11px] text-text-muted uppercase tracking-wide">{k}</div>
                    <div className="text-[13px] font-semibold text-text-primary mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-text-primary mt-4">
                Luas total: {(p.lebar * p.panjang).toFixed(1)} m²
              </p>
            </div>

            <div>
              <p className="font-display text-4xl font-bold text-gold leading-tight">{formatRupiah(p.harga)}</p>
              <p className="text-xs text-text-muted mt-1">Harga dapat dinegosiasi</p>

              <div className="space-y-3 mt-6">
                <a href="tel:+6281234567890" className="w-full inline-flex items-center justify-center gap-2 bg-gold text-text-primary font-semibold py-3 rounded-md hover:bg-gold-light transition-colors">
                  <Phone className="w-4 h-4" /> Hubungi Agent
                </a>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] font-semibold py-3 rounded-md hover:bg-[#25D366] hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(p.kawasan + ", Medan")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-gold hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Buka di Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
