"use client";

import { useState, useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Globe, Instagram, Facebook, Youtube, MessageCircle, CheckCircle, Loader2, Plus, Minus } from "lucide-react";
import { SectionLabel, SectionHeading } from "@/components/ui/SectionHeading";
import { FadeUp } from "@/components/ui/FadeUp";
import { faqs } from "@/data/faqs";
import { cn } from "@/lib/utils";
import { submitContactAction } from "@/actions/contact";
import { Select } from "@/components/ui/Select";

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
              Tidak perlu brief yang sempurna. Ceritakan apa yang Anda cari - kami bantu temukan pilihan terbaik.
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
                <Item icon={Phone}><a href="tel:+6281234567890" className="hover:text-gold transition-colors">+62 812 3456 7890</a></Item>
                <Item icon={Mail}><a href="mailto:hello@primeproperty.id" className="hover:text-gold transition-colors">hello@primeproperty.id</a></Item>
                <Item icon={Clock}>Senin – Sabtu, 09.00 – 17.00 WIB</Item>
                <Item icon={Globe}><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">wa.me/6281234567890</a></Item>
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


const jenisPropertiOptions = [
  { value: "", label: "Pilih..." },
  { value: "Ruko", label: "Ruko" },
  { value: "Villa", label: "Villa" },
  { value: "Keduanya", label: "Keduanya" },
  { value: "Masih Mencari", label: "Masih Mencari" }
];

const kisaranAnggaranOptions = [
  { value: "", label: "Pilih..." },
  { value: "< 500 Juta", label: "< 500 Juta" },
  { value: "500 Juta – 1 Miliar", label: "500 Juta – 1 Miliar" },
  { value: "1 – 2 Miliar", label: "1 – 2 Miliar" },
  { value: "> 2 Miliar", label: "> 2 Miliar" }
];

function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactAction, { error: null, success: false });
  const [success, setSuccess] = useState(false);
  const [jenisProperti, setJenisProperti] = useState("");
  const [kisaranAnggaran, setKisaranAnggaran] = useState("");

  useEffect(() => {
    if (state.success) {
      setSuccess(true);
      const t = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(t);
    }
  }, [state.success]);

  return (
    <form action={formAction} className="bg-white border border-[#E0E0E0] rounded-xl p-8 md:p-10 space-y-5">
      <div>
        <SectionLabel>Kirim Pesan</SectionLabel>
        <h2 className="font-display text-[28px] text-text-primary mt-3">Ada Pertanyaan?</h2>
      </div>

      {success && (
        <div className="bg-green-50 border-l-[3px] border-green-500 rounded p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-text-primary">Pesan terkirim, tim kami akan menghubungi Anda.</p>
        </div>
      )}

      {state.error && (
        <div className="bg-red-50 border-l-[3px] border-red-accent rounded p-4 flex gap-3">
          <p className="text-sm text-red-accent">{state.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nama Lengkap *">
          <input name="nama" required className={inputCls()} />
        </Field>
        <Field label="Email *">
          <input type="email" name="email" required className={inputCls()} />
        </Field>
        <Field label="Nomor HP *">
          <input name="nomor_hp" required className={inputCls()} />
        </Field>
        <Field label="Jenis Properti">
          <Select name="jenis_properti" value={jenisProperti} onChange={setJenisProperti} options={jenisPropertiOptions} />
        </Field>
        <Field label="Kisaran Anggaran" className="md:col-span-2">
          <Select name="kisaran_anggaran" value={kisaranAnggaran} onChange={setKisaranAnggaran} options={kisaranAnggaranOptions} />
        </Field>
        <Field label="Pesan *" className="md:col-span-2">
          <textarea rows={5} name="pesan" required className={inputCls()} />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gold text-text-primary py-3.5 rounded-md font-semibold text-[15px] hover:bg-gold-light transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</> : "Kirim Pesan"}
      </button>
    </form>
  );
}

const inputCls = (error?: string) => cn(
  "w-full bg-bg-soft border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors",
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
