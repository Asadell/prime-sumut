"use client";

import { Check, Scale, Eye, Handshake, Star, User } from "lucide-react";
import { SectionLabel, SectionHeading } from "@/components/ui/SectionHeading";
import { FadeUp, StaggerGroup, fadeItem } from "@/components/ui/FadeUp";
import { motion } from "framer-motion";
import { team } from "@/data/team";
import Image from "next/image";

export function TentangClient() {
  return (
    <>
      {/* Hero */}
      <section className="bg-bg-primary pt-32 pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <SectionLabel>Tentang Prime Property</SectionLabel>
            <h1 className="font-display text-5xl md:text-7xl text-white mt-4 leading-[1.05]">
              Lebih dari Sekedar<br />
              <span className="text-gold">Transaksi Properti.</span>
            </h1>
            <p className="mt-8 text-lg text-white/60 max-w-2xl">
              Kami percaya bahwa membeli properti adalah keputusan besar. Itulah mengapa kami hadir bukan hanya sebagai agen - melainkan sebagai mitra perjalanan investasi Anda.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Profil */}
      <section className="bg-white py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeUp>
            <SectionLabel>Kisah Kami</SectionLabel>
            <SectionHeading className="text-3xl md:text-[40px]">Lahir dari Kepercayaan, Tumbuh bersama Klien.</SectionHeading>
            <div className="mt-6 space-y-5 text-[15px] text-text-muted leading-[1.8]">
              <p>Prime Property didirikan pada tahun 2012 di Medan, Sumatera Utara, oleh sekelompok profesional properti yang frustasi melihat praktik agensi yang tidak transparan dan merugikan pembeli.</p>
              <p>Selama 12 tahun, kami telah membantu lebih dari 500 keluarga dan investor menemukan properti yang tepat - dari ruko bisnis di kawasan strategis hingga villa premium untuk hunian keluarga.</p>
              <p>Fokus kami tidak pernah berubah: integritas, transparansi, dan hasil nyata untuk setiap klien yang mempercayai kami.</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="bg-bg-soft border-l-4 border-gold p-8 rounded-r-lg">
              <p className="font-display italic text-xl md:text-[22px] text-text-primary leading-relaxed">
                &quot;Properti bukan hanya bata dan semen. Ia adalah tempat keluarga bertumbuh, dan bisnis berkembang.&quot;
              </p>
              <p className="mt-4 text-[13px] text-text-muted">- Pendiri Prime Property</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { v: "2012", l: "Tahun Berdiri" },
                { v: "Medan", l: "Kota Pusat" },
                { v: "12+", l: "Tahun Aktif" },
                { v: "500+", l: "Transaksi Sukses" },
              ].map((s) => (
                <div key={s.l} className="bg-white border border-[#E0E0E0] p-5 rounded-lg">
                  <div className="font-display text-2xl text-gold">{s.v}</div>
                  <div className="text-xs text-text-muted mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-bg-primary py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeUp className="bg-bg-card border border-border-dark border-t-[3px] border-t-gold p-8 rounded-lg">
            <SectionLabel>Visi</SectionLabel>
            <h3 className="font-display text-[28px] text-white mt-3 leading-tight">
              Menjadi Referensi Pertama Properti Premium di Sumatera Utara.
            </h3>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Kami membangun reputasi melalui hasil nyata, bukan janji. Setiap transaksi adalah testimoni bahwa kepercayaan klien tidak pernah kami anggap remeh.
            </p>
          </FadeUp>
          <FadeUp delay={0.1} className="bg-bg-card border border-border-dark border-t-[3px] border-t-gold p-8 rounded-lg">
            <SectionLabel>Misi</SectionLabel>
            <ul className="mt-4 space-y-3">
              {[
                "Menyediakan pilihan properti yang terverifikasi dan transparan",
                "Mendampingi klien dari awal pencarian hingga akad selesai",
                "Memberikan penilaian harga yang jujur berbasis data pasar",
                "Membangun hubungan jangka panjang, bukan transaksi sekali",
              ].map((m) => (
                <li key={m} className="flex gap-3 text-sm text-white/70">
                  <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* Nilai */}
      <section className="bg-bg-soft py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-14 max-w-3xl mx-auto">
            <SectionLabel>Nilai Kami</SectionLabel>
            <SectionHeading className="text-3xl md:text-[40px]">Prinsip yang Tidak Pernah Kami Kompromikan.</SectionHeading>
          </FadeUp>
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: Scale, title: "Integritas", desc: "Kami tidak menjual properti yang tidak layak, meski itu berarti kehilangan komisi. Kepercayaan klien adalah prioritas utama." },
              { icon: Eye, title: "Transparansi", desc: "Semua biaya, kondisi, dan dokumen kami jelaskan sejak awal. Tidak ada informasi yang disembunyikan demi keuntungan sendiri." },
              { icon: Handshake, title: "Kemitraan", desc: "Kami bukan sekadar perantara. Kami adalah mitra yang ikut memikirkan kebutuhan jangka panjang investasi Anda." },
              { icon: Star, title: "Profesionalisme", desc: "Tim kami terlatih, bersertifikat, dan selalu mengikuti perkembangan regulasi properti terkini." },
            ].map((v) => (
              <motion.div key={v.title} variants={fadeItem} className="bg-white border border-[#E0E0E0] rounded-lg p-7 hover:border-gold hover:shadow-sm transition-all">
                <v.icon className="w-7 h-7 text-gold" strokeWidth={1.5} />
                <h3 className="font-display text-[22px] text-text-primary mt-4">{v.title}</h3>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Tim */}
      <section className="bg-white py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-14">
            <SectionLabel>Tim Kami</SectionLabel>
            <SectionHeading className="text-3xl md:text-[40px]">Orang-Orang di Balik Prime Property.</SectionHeading>
          </FadeUp>
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((m) => (
              <motion.div key={m.nama} variants={fadeItem} className="bg-bg-soft border border-[#E0E0E0] rounded-lg p-6 text-center hover:border-gold hover:shadow-md transition-all">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-[#D0D0D0] overflow-hidden flex items-center justify-center">
                  {m.foto ? (
                    <Image src={m.foto} alt={m.nama} fill sizes="96px" className="object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-[#888]" />
                  )}
                </div>
                <h3 className="mt-4 text-base font-semibold text-text-primary">{m.nama}</h3>
                <p className="text-[13px] text-gold mt-1">{m.jabatan}</p>
                <p className="text-[13px] text-text-muted mt-3 leading-relaxed">{m.bio}</p>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  );
}
