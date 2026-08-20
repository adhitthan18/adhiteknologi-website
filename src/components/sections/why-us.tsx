import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/lib/i18n";

export function WhyUs({ dict }: { dict: Dictionary }) {
  const t = dict.why;

  return (
    <section className="border-y border-line bg-surface/40 py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
          {t.items.map((item) => (
            <Reveal key={item.title} className="bg-surface p-7">
              <h3 className="text-base font-bold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
