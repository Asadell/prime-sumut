"use client";

import { Quote, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { SectionLabel, SectionHeading } from "@/components/ui/SectionHeading";
import { FadeUp, StaggerGroup, fadeItem } from "@/components/ui/FadeUp";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  return (
    <section className="bg-bg-primary py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <FadeUp className="text-center mb-14">
          <SectionLabel>Apa Kata Klien Kami</SectionLabel>
          <SectionHeading light>Kepercayaan Adalah Aset Kami.</SectionHeading>
        </FadeUp>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <motion.div
              key={t.nama}
              variants={fadeItem}
              className="bg-bg-card border border-border-dark p-8 rounded-lg flex flex-col"
            >
              <Quote className="w-8 h-8 text-gold/40" />
              <p className="mt-5 font-display italic text-lg text-white leading-relaxed flex-1">&quot;{t.quote}&quot;</p>
              <div className="mt-6">
                <div className="flex gap-0.5 text-gold mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold" />
                  ))}
                </div>
                <p className="text-[13px] text-white/50">— {t.nama} · {t.detail}</p>
              </div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
