import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-gold text-text-primary hover:bg-gold-light",
  outline: "border border-white/50 text-white bg-transparent hover:border-gold hover:text-gold",
  outlineGold: "border border-gold text-gold bg-transparent hover:bg-gold hover:text-text-primary",
  dark: "bg-text-primary text-gold hover:opacity-85",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  as?: React.ElementType;
}

export function Button({ variant = "primary", className, children, as: As = "button", ...props }: ButtonProps) {
  return (
    <As
      className={cn(
        "inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold transition-all duration-200 rounded-md hover:scale-[1.02] active:scale-100 disabled:opacity-60 disabled:pointer-events-none",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </As>
  );
}
