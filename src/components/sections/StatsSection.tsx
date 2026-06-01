"use client";

import { stats } from "@/data/stats";
import { StaggerGroup, fadeItem } from "@/components/ui/FadeUp";
import { motion } from "framer-motion";

export function StatsSection() {
  return (
    <section className="bg-bg-soft py-20 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeItem}
              className="bg-white border border-[#E0E0E0] rounded-lg p-8 text-center hover:border-gold transition-colors"
            >
              <div className="font-display text-5xl md:text-[56px] text-gold leading-none">{s.value}</div>
              <div className="mt-3 text-[13px] text-text-muted">{s.label}</div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
