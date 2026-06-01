import Link from "next/link";
import type { Property } from "@/types/database";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { SectionLabel, SectionHeading } from "@/components/ui/SectionHeading";
import { FadeUp, StaggerGroup } from "@/components/ui/FadeUp";
import { Button } from "@/components/ui/Button";

export function FeaturedProperties({ initialProperties: featured }: { initialProperties: Property[] }) {
  return (
    <section className="bg-bg-soft py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <FadeUp className="text-center mb-14">
          <SectionLabel>Properti Unggulan</SectionLabel>
          <SectionHeading>Pilihan Terbaik Kami</SectionHeading>
        </FadeUp>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </StaggerGroup>
        <FadeUp className="text-center mt-14">
          <Link href="/properti"><Button>Lihat Semua Properti →</Button></Link>
        </FadeUp>
      </div>
    </section>
  );
}
