import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { sectionIds } from "@/lib/site-config";
import type { Dictionary } from "@/lib/i18n";

export function Process({ dict }: { dict: Dictionary }) {
  const t = dict.process;

  return (
    <section id={sectionIds.process} className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

        <ol className="relative mt-14 flex flex-col gap-4">
          <span
            className="absolute left-6 top-4 bottom-4 hidden w-px bg-line md:block"
            aria-hidden="true"
          />
          {t.steps.map((item, index) => (
            <Reveal
              key={item.title}
              as="li"
              className="relative flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-6 md:flex-row md:items-start md:gap-8 md:pl-20"
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-brand-soft font-mono text-sm font-bold text-brand md:absolute md:left-0 md:top-6">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-fg-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
