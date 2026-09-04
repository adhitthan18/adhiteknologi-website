import { ArrowUpRightIcon, InfoIcon } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { clientProjects, sectionIds, type Pillar } from "@/lib/site-config";
import type { Dictionary } from "@/lib/i18n";

/** Kelas Tailwind ditulis utuh, bukan disusun dari potongan string, supaya
 *  pemindai kelas Tailwind tetap menemukannya saat build. */
const accent: Record<Pillar, { text: string; border: string; hover: string }> = {
  web: { text: "text-web", border: "hover:border-web/50", hover: "hover:text-web" },
  iot: { text: "text-iot", border: "hover:border-iot/50", hover: "hover:text-iot" },
  pos: { text: "text-pos", border: "hover:border-pos/50", hover: "hover:text-pos" },
};

export function Portfolio({ dict }: { dict: Dictionary }) {
  const t = dict.portfolio;

  return (
    <section id={sectionIds.portfolio} className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {clientProjects.map((meta) => {
            const copy = t.items[meta.id];
            const tone = accent[meta.pillar ?? "web"];

            return (
              <Reveal
                key={meta.id}
                as="article"
                className={`group flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-7 transition-[border-color,transform] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 ${tone.border} ${meta.wide ? "md:col-span-2" : ""}`}
              >
                <p
                  className={`font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${tone.text}`}
                >
                  {copy.sector}
                </p>

                <h3 className="mt-3 text-xl font-extrabold tracking-tight">{copy.name}</h3>

                {/* Pekerjaan perangkat keras tidak punya alamat web. Barisnya
                    dilewati sama sekali, bukan dirender jadi tautan kosong. */}
                {meta.href && meta.domain && (
                  <a
                    href={meta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-1 inline-flex w-fit items-center gap-1 py-1 font-mono text-sm text-fg-muted transition-colors hover:underline ${tone.hover}`}
                  >
                    {meta.domain}
                    <ArrowUpRightIcon
                      size={14}
                      weight="bold"
                      aria-hidden
                      className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                    <span className="sr-only">{t.newTab}</span>
                  </a>
                )}

                <p className="mt-4 text-[0.95rem] leading-relaxed text-fg-muted">{copy.body}</p>

                <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                  {copy.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-[var(--radius-pill)] border border-line bg-surface-2/60 px-3 py-1.5 text-xs text-fg-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>

        {/* Dua situs di atas milik klien yang sama; tanpa catatan ini pembaca bisa
            mengira kami menghitung satu klien sebagai dua. */}
        <Reveal className="mt-8 flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-surface-2/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3 text-sm leading-relaxed text-fg-muted">
            <InfoIcon size={18} weight="duotone" className="mt-0.5 shrink-0 text-web" aria-hidden />
            {t.note}
          </p>
          <ButtonLink href={`#${sectionIds.contact}`} variant="secondary" className="shrink-0">
            {t.cta}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
