import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { sectionIds } from "@/lib/site-config";
import type { Dictionary } from "@/lib/i18n";

export function Faq({ dict }: { dict: Dictionary }) {
  const t = dict.faq;

  return (
    <section id={sectionIds.faq} className="border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
          align="center"
        />

        {/* <details> bawaan browser: bisa dibuka lewat keyboard dan tetap jalan tanpa JavaScript. */}
        <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-3">
          {t.items.map((faq) => (
            <Reveal
              key={faq.q}
              as="details"
              className="group rounded-[var(--radius-card)] border border-line bg-surface transition-colors duration-200 hover:border-line-strong open:border-brand/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                {faq.q}
                <PlusIcon
                  size={18}
                  weight="bold"
                  aria-hidden
                  className="shrink-0 text-brand transition-transform duration-300 ease-[var(--ease-out-expo)] group-open:rotate-45"
                />
              </summary>
              <p className="border-t border-line px-6 py-5 text-[0.95rem] leading-relaxed text-fg-muted">
                {faq.a}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
