import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeTicker } from "@/components/sections/MarqueeTicker";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata = {
  title: "Prime Property — Properti Premium Sumatera Utara",
  description: "Jual-beli Ruko & Villa premium di Medan dan sekitarnya. Konsultan properti terpercaya dengan 12 tahun pengalaman.",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeTicker />
      <FeaturedProperties />
      <ValueProposition />
      <StatsSection />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
