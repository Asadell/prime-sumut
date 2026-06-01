import Link from "next/link";
import { MapPin, Phone, Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-bg-primary border-t border-border-dark pt-16 pb-8 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-landscape.png" alt="Prime Property" className="h-10 w-auto brightness-0 invert" />
          <p className="mt-3 text-[13px] text-white/40">Properti Premium Sumatera Utara</p>
          <p className="text-[13px] text-white/40">Medan · Est. 2012</p>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 font-sans">Layanan</h4>
          <ul className="space-y-2 text-[13px] text-white/50">
            <li><Link href="/properti" className="hover:text-gold">Ruko</Link></li>
            <li><Link href="/properti" className="hover:text-gold">Villa</Link></li>
            <li><Link href="/kontak" className="hover:text-gold">Konsultasi Gratis</Link></li>
            <li><Link href="/kontak" className="hover:text-gold">Hubungi Agent</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 font-sans">Perusahaan</h4>
          <ul className="space-y-2 text-[13px] text-white/50">
            <li><Link href="/tentang" className="hover:text-gold">Tentang Kami</Link></li>
            <li><Link href="/tentang" className="hover:text-gold">Tim Kami</Link></li>
            <li><a href="#" className="hover:text-gold">Karir</a></li>
            <li><a href="#" className="hover:text-gold">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 font-sans">Kontak</h4>
          <ul className="space-y-3 text-[13px] text-white/50">
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gold" /> Jl. Krakatau No. 88, Medan Timur, Sumatera Utara 20238</li>
            <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0 text-gold" /> +62 812 3456 7890</li>
          </ul>
          <div className="flex gap-3 mt-4 text-white/50">
            {[Instagram, Facebook, Youtube, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social" className="hover:text-gold transition-colors">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border-dark text-[12px] text-white/30">
        © 2026 Prime Property. Semua hak cipta dilindungi.
      </div>
    </footer>
  );
}
