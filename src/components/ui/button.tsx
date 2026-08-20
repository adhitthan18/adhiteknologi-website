import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-semibold " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-expo)] " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-fg shadow-[0_8px_24px_-10px_var(--brand)] hover:brightness-110 hover:shadow-[0_12px_32px_-10px_var(--brand)]",
  secondary:
    "glass text-fg hover:border-line-strong hover:bg-surface-2",
  ghost: "text-fg-muted hover:text-fg hover:bg-surface-2",
};

// Tinggi minimum 44px agar memenuhi target sentuh di mobile.
const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}
