import { cn } from "@/lib/utils";

export function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block text-[12px] font-semibold tracking-widest-2 uppercase text-gold",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({ children, className = "", light = false }: { children: React.ReactNode; className?: string; light?: boolean }) {
  return (
    <h2
      className={cn(
        "font-display text-4xl md:text-5xl leading-[1.1] mt-3",
        light ? "text-white" : "text-text-primary",
        className,
      )}
    >
      {children}
    </h2>
  );
}
