import Link from "next/link";
import { locales, otherLocale, type Dictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/**
 * Dua tautan nyata ke `/id` dan `/en`, bukan tombol JavaScript — supaya setiap
 * bahasa punya URL sendiri yang bisa dibagikan dan diindeks mesin pencari.
 */
export function LanguageSwitcher({
  locale,
  labels,
  className,
}: {
  locale: Locale;
  labels: Dictionary["language"];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] border border-line bg-surface-2/60 p-0.5",
        className,
      )}
      role="group"
      aria-label={labels.label}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={`/${code}`}
            hrefLang={code}
            aria-current={active ? "true" : undefined}
            className={cn(
              "inline-flex h-11 min-w-12 items-center justify-center rounded-[var(--radius-pill)] px-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-200",
              active
                ? "bg-brand text-brand-fg"
                : "text-fg-subtle hover:bg-surface hover:text-fg",
            )}
          >
            {code}
            {!active && <span className="sr-only"> — {labels.switchTo}</span>}
          </Link>
        );
      })}
    </div>
  );
}

export { otherLocale };
