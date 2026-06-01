"use client";

import { Award, ShieldCheck, MapPin } from "lucide-react";
import { SectionLabel, SectionHeading } from "@/components/ui/SectionHeading";
import { FadeUp, StaggerGroup, fadeItem } from "@/components/ui/FadeUp";
import { motion } from "framer-motion";

const items = [
  { icon: Award, title: "12 Tahun Pengalaman", desc: "Pemahaman mendalam terhadap pasar properti Sumatera Utara — dari kawasan industri hingga hunian premium." },
  { icon: ShieldCheck, title: "Transaksi Aman & Transparan", desc: "Setiap transaksi didampingi tim legal kami. Sertifikat diverifikasi, proses jelas, tidak ada biaya tersembunyi." },
  { icon: MapPin, title: "Spesialis Pasar Lokal", desc: "Fokus di Sumatera Utara membuat kami mengenal setiap kawasan, potensi investasi, dan tren harga terkini." },
];

export function ValueProposition() {
  return (
    <section className="bg-bg-primary py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <FadeUp className="text-center mb-14 max-w-3xl mx-auto">
          <SectionLabel>Mengapa Prime Property</SectionLabel>
          <SectionHeading light>Bukan Sekedar Agen. Partner Investasi Anda.</SectionHeading>
        </FadeUp>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it) => (
            <motion.div
              key={it.title}
              variants={fadeItem}
              className="bg-bg-card border border-border-dark p-8 rounded-lg hover:border-gold transition-colors"
            >
              <it.icon className="w-8 h-8 text-gold" strokeWidth={1.5} />
              <h3 className="mt-5 text-xl font-semibold text-white font-sans">{it.title}</h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
