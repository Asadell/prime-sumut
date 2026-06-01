"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, var(--gold) 0%, transparent 50%), radial-gradient(circle at 80% 70%, var(--gold) 0%, transparent 50%)",
      }} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <img src="/logo-landscape.png" alt="Prime Property" className="h-12 md:h-16 w-auto brightness-0 invert" />
        <div className="text-[11px] tracking-widest-2 uppercase text-white/60 mt-1">Property Specialist</div>
      </motion.div>

      <h1 className="font-display leading-[1.05] max-w-5xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="block text-5xl md:text-7xl lg:text-[80px] text-white"
        >
          Properti Impian,
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="block text-5xl md:text-7xl lg:text-[80px] text-gold"
        >
          Investasi Terbaik.
        </motion.span>
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="mt-8 text-base md:text-lg text-white/70 max-w-xl"
      >
        Temukan Ruko dan Villa terbaik di Sumatera Utara bersama konsultan properti berpengalaman yang memahami pasar lokal.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-10 flex flex-col sm:flex-row gap-4"
      >
        <Link href="/properti"><Button variant="primary">Lihat Properti</Button></Link>
        <Link href="/kontak"><Button variant="outline">Hubungi Kami</Button></Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.85 }}
        className="mt-10 text-[13px] text-white/50 tracking-wide"
      >
        500+ Properti  |  12 Tahun Pengalaman  |  98% Klien Puas
      </motion.div>
    </section>
  );
}
