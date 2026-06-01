"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Globe, Instagram, Facebook, Youtube, MessageCircle, CheckCircle, Loader2, Plus, Minus } from "lucide-react";
import { SectionLabel, SectionHeading } from "@/components/ui/SectionHeading";
import { FadeUp } from "@/components/ui/FadeUp";
import { faqs } from "@/data/faqs";
import { cn } from "@/lib/utils";

export function KontakClient() {
  return (
    <>
      <section className="bg-bg-primary pt-32 pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <SectionLabel>Hubungi Kami</SectionLabel>
            <h1 className="font-display text-5xl md:text-7xl text-white mt-4 leading-[1.05]">
              Siap Membantu<br /><span className="text-gold">Anda Hari Ini.</span>
            </h1>
            <p className="mt-8 text-lg text-white/60 max-w-2xl">
              Tidak perlu brief yang sempurna. Ceritakan apa yang Anda cari — kami bantu temukan pilihan terbaik.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-white py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          <FadeUp className="lg:col-span-2">
            <div className="bg-bg-soft rounded-xl p-8 md:p-10">
              <SectionLabel>Informasi Kantor</SectionLabel>
              <h2 className="font-display text-[28px] text-text-primary mt-3">Kami Ada untuk Anda</h2>
              <div className="mt-6 space-y-4 text-sm text-text-primary">
                <Item icon={MapPin}>Jl. Krakatau No. 88, Medan Timur, Sumatera Utara 20238</Item>
                <Item icon={Phone}>+62 812 3456 7890</Item>
                <Item icon={Mail}>hello@primeproperty.id</Item>
                <Item icon={Clock}>Senin – Sabtu, 09.00 – 17.00 WIB</Item>
                <Item icon={Globe}>wa.me/6281234567890</Item>
              </div>
              <div className="flex gap-3 mt-6">
                {[Instagram, Facebook, Youtube, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Social" className="text-text-muted hover:text-gold transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <div className="mt-6 bg-[#E0E0E0] rounded-xl h-[220px] flex flex-col items-center justify-center text-text-muted">
                <MapPin className="w-8 h-8" />
                <p className="text-[13px] mt-2">Jl. Krakatau No. 88, Medan</p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1} className="lg:col-span-3">
            <ContactForm />
          </FadeUp>
        </div>
      </section>

      <section className="bg-bg-soft py-24 px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-12">
            <SectionLabel>FAQ</SectionLabel>
            <SectionHeading className="text-3xl md:text-[40px]">Pertanyaan yang Sering Ditanyakan.</SectionHeading>
          </FadeUp>
          <div className="space-y-3">
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>
    </>
  );
}

function Item({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <Icon className="w-[18px] h-[18px] text-gold mt-0.5 shrink-0" />
      <span className="text-sm">{children}</span>
    </div>
  );
}

function FaqItem({ q, a }: { q: string, a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("bg-white border border-[#E0E0E0] rounded-md overflow-hidden transition-all", open && "border-l-[3px] border-l-gold")}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[15px] font-semibold text-text-primary">{q}</span>
        {open ? <Minus className="w-4 h-4 text-gold shrink-0" /> : <Plus className="w-4 h-4 text-gold shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-5 pb-5 text-sm text-text-muted leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ nama: "", email: "", hp: "", tipe: "", anggaran: "", pesan: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handle = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.nama.trim()) err.nama = "Nama wajib diisi";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) err.email = "Email tidak valid";
    if (!form.hp.trim() || form.hp.replace(/\D/g, "").length < 10) err.hp = "Nomor HP minimal 10 digit";
    if (!form.pesan.trim()) err.pesan = "Pesan wajib diisi";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    setForm({ nama: "", email: "", hp: "", tipe: "", anggaran: "", pesan: "" });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <form onSubmit={submit} className="bg-white border border-[#E0E0E0] rounded-xl p-8 md:p-10 space-y-5">
      <div>
        <SectionLabel>Kirim Pesan</SectionLabel>
        <h2 className="font-display text-[28px] text-text-primary mt-3">Ada Pertanyaan?</h2>
      </div>

      {success && (
        <div className="bg-green-50 border-l-[3px] border-green-500 rounded p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-text-primary">Pesan terkirim! Tim kami akan menghubungi Anda dalam 1×24 jam.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nama Lengkap *" error={errors.nama}>
          <input value={form.nama} onChange={handle("nama")} className={inputCls(errors.nama)} />
        </Field>
        <Field label="Email *" error={errors.email}>
          <input type="email" value={form.email} onChange={handle("email")} className={inputCls(errors.email)} />
        </Field>
        <Field label="Nomor HP *" error={errors.hp}>
          <input value={form.hp} onChange={handle("hp")} className={inputCls(errors.hp)} />
        </Field>
        <Field label="Jenis Properti">
          <select value={form.tipe} onChange={handle("tipe")} className={inputCls()}>
            <option value="">Pilih...</option>
            <option>Ruko</option><option>Villa</option><option>Keduanya</option><option>Masih Mencari</option>
          </select>
        </Field>
        <Field label="Kisaran Anggaran" className="md:col-span-2">
          <select value={form.anggaran} onChange={handle("anggaran")} className={inputCls()}>
            <option value="">Pilih...</option>
            <option>&lt; 500 Juta</option><option>500 Juta – 1 Miliar</option>
            <option>1 – 2 Miliar</option><option>&gt; 2 Miliar</option>
          </select>
        </Field>
        <Field label="Pesan *" error={errors.pesan} className="md:col-span-2">
          <textarea rows={5} value={form.pesan} onChange={handle("pesan")} className={inputCls(errors.pesan)} />
        </Field>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold text-text-primary py-3.5 rounded-md font-semibold text-[15px] hover:bg-gold-light transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</> : "Kirim Pesan"}
      </button>
    </form>
  );
}

const inputCls = (error?: string) => cn(
  "w-full bg-bg-soft border rounded-md px-3 py-2.5 text-sm outline-none transition-colors",
  error ? "border-red-accent focus:border-red-accent" : "border-[#E0E0E0] focus:border-gold",
);

function Field({ label, children, error, className }: { label: string, children: React.ReactNode, error?: string, className?: string }) {
  return (
    <div className={className}>
      <label className="text-[12px] font-semibold uppercase tracking-wide text-text-primary block mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-accent">{error}</p>}
    </div>
  );
}
