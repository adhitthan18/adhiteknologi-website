import { cn } from "@/lib/cn";

/**
 * Marka PT Adhi Teknologi Indonesia.
 *
 * Geometri path disalin persis dari brand kit (`logo/ati-marka-primer.svg`) —
 * jangan diubah di sini. Bila bentuk marka perlu direvisi, ubah di brand kit
 * lalu salin ulang, sesuai catatan di README brand.
 *
 * Yang berbeda dari berkas aslinya hanya sumber warnanya: gradien mengambil
 * nilai dari CSS variable, sehingga satu komponen ini melayani versi primer
 * (latar terang) dan reverse (latar gelap) tanpa perlu dua berkas terpisah.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="Marka PT Adhi Teknologi Indonesia"
    >
      <defs>
        <linearGradient id="ati-left" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--mark-left-from)" />
          <stop offset="100%" stopColor="var(--mark-left-to)" />
        </linearGradient>
        <linearGradient id="ati-right" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--mark-right-from)" />
          <stop offset="100%" stopColor="var(--mark-right-to)" />
        </linearGradient>
        <linearGradient id="ati-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe375" />
          <stop offset="100%" stopColor="#f5b301" />
        </linearGradient>
      </defs>

      {/* Kaki kiri */}
      <path d="M70 14 L44 118 L14 118 L56 14 Z" fill="url(#ati-left)" />
      {/* Kaki kanan */}
      <path d="M84 14 L126 118 L94 118 L64 40 Z" fill="url(#ati-right)" />
      {/* Bilah emas */}
      <path d="M34 82 L118 66 L114 90 L30 106 Z" fill="url(#ati-gold)" />
      {/* Kilau tipis di puncak, hanya tampak pada versi primer */}
      <path d="M70 14 L62 46 L56 46 L64 14 Z" fill="#ffffff" fillOpacity="0.16" />
    </svg>
  );
}

/**
 * Lockup: marka + nama perusahaan, disusun ulang untuk layar sempit.
 * Nama panjang dipakai di footer, nama pendek di header agar tidak memakan
 * lebar yang dibutuhkan navigasi.
 */
export function Logo({
  className,
  full = false,
}: {
  className?: string;
  full?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className={full ? "h-11 w-11" : "h-9 w-9"} />

      {/* Bilah pemisah tipis, meniru garis vertikal pada lockup resmi */}
      <span className="h-9 w-px shrink-0 bg-line" aria-hidden="true" />

      <span className="flex flex-col leading-none">
        {full ? (
          <>
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand">
              PT Adhi
            </span>
            <span className="mt-1 text-base font-extrabold uppercase tracking-tight text-fg">
              Teknologi
            </span>
            <span className="mt-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-fg-muted">
              Indonesia
            </span>
          </>
        ) : (
          <>
            <span className="text-[0.95rem] font-extrabold tracking-tight text-fg">
              Adhi<span className="text-brand">Teknologi</span>
            </span>
            <span className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-fg-subtle">
              web · iot · pos
            </span>
          </>
        )}
      </span>
    </span>
  );
}
