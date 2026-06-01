"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/properti", label: "Properti" },
  { href: "/kontak", label: "Kontak" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  const isHeroDark = pathname === "/" || pathname === "/tentang" || pathname === "/kontak";
  const onDarkHero = isHeroDark && !scrolled;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur shadow-sm" : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-landscape.png"
            alt="Prime Property"
            className={cn(
              "h-10 w-auto transition-all duration-300",
              onDarkHero ? "brightness-0 invert" : ""
            )}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-gold relative py-2",
                pathname === item.href
                  ? "text-gold border-b-2 border-gold"
                  : cn(onDarkHero ? "text-white" : "text-text-primary", "border-b-2 border-transparent")
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/agent/login"
            className={cn(
              "text-[13px] font-semibold px-4 py-2 border rounded transition-all hover:border-gold hover:text-gold",
              onDarkHero ? "text-white border-white/60" : "text-text-primary border-text-primary/40",
            )}
          >
            Login Agent
          </Link>
        </div>

        <button
          aria-label="Buka menu"
          className={cn("md:hidden p-2", onDarkHero ? "text-white" : "text-text-primary")}
          onClick={() => setOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-white md:hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-6 h-16 border-b border-[#E0E0E0]">
            <img src="/logo-landscape.png" alt="Prime Property" className="h-8 w-auto" />
            <button aria-label="Tutup menu" onClick={() => setOpen(false)} className="p-2 text-text-primary">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col px-6 py-8 gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-lg px-4 py-2 rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-[#FEF9EC] text-gold font-semibold"
                    : "text-text-primary font-medium hover:text-gold"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/agent/login" className="mt-4 text-center text-sm font-semibold px-4 py-3 border border-text-primary rounded">
              Login Agent
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
