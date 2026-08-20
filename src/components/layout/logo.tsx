import { cn } from "@/lib/cn";

/**
 * Lambang Adhi Teknologi: huruf "A" yang dibentuk dari jalur sirkuit dengan
 * tiga simpul — mewakili tiga pilar layanan (web, IoT, POS).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="Lambang Adhi Teknologi"
    >
      <rect
        x="1.25"
        y="1.25"
        width="37.5"
        height="37.5"
        rx="11"
        className="fill-brand-soft stroke-brand"
        strokeWidth="1.5"
      />
      <path
        d="M11 29.5 20 10.5l9 19"
        className="stroke-brand"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15.1 23.2h9.8" className="stroke-brand" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="20" cy="10.5" r="3" className="fill-bg stroke-brand" strokeWidth="2.2" />
      <circle cx="11" cy="29.5" r="2.4" className="fill-brand" />
      <circle cx="29" cy="29.5" r="2.4" className="fill-brand" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-[0.95rem] font-extrabold tracking-tight text-fg">
          Adhi<span className="text-brand">Teknologi</span>
        </span>
        <span className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-fg-subtle">
          web · iot · pos
        </span>
      </span>
    </span>
  );
}
