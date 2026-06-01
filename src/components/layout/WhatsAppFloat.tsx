"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const WA_URL = "https://wa.me/6282165432100?text=Halo%20Prime%20Property%2C%20saya%20ingin%20bertanya";

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-20 right-0 w-[300px] bg-white border border-[#E0E0E0] shadow-2xl rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center font-display font-bold text-gold">P</div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-text-primary">Prime Property</p>
                  <p className="text-[11px] text-[#25D366]">● Online</p>
                </div>
              </div>
              <button aria-label="Tutup chat" onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-bg-soft rounded-lg p-3 text-[13px] text-text-primary">Halo! Ada yang bisa kami bantu? 🏠</div>
              {["📋 Lihat Daftar Properti", "📞 Jadwalkan Survei", "💬 Diskusi Kebutuhan Saya"].map((t) => (
                <a
                  key={t}
                  href={WA_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[13px] border border-[#E0E0E0] rounded-lg px-3 py-2 hover:border-gold hover:text-gold transition-colors"
                >
                  {t}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        aria-label="Buka WhatsApp"
        onClick={() => setOpen((v) => !v)}
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gold animate-ping" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gold" />
      </button>
    </div>
  );
}
