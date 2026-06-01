import Link from "next/link";
import { FadeUp } from "@/components/ui/FadeUp";
import { Button } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <section className="bg-gold py-20 px-6 text-center">
      <FadeUp>
        <h2 className="font-display text-4xl md:text-[56px] text-text-primary leading-tight">Siap Menemukan Properti Ideal?</h2>
        <p className="mt-4 text-base md:text-lg text-text-primary/70">Konsultasi gratis dengan agen kami hari ini.</p>
        <div className="mt-8">
          <Link href="/kontak">
            <Button variant="dark">Hubungi Sekarang</Button>
          </Link>
        </div>
      </FadeUp>
    </section>
  );
}
