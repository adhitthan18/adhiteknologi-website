import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { techStack } from "@/lib/site-config";

const marqueeItems = techStack.flatMap((group) => group.items);

export function Tech() {
  return (
    <section id="teknologi" className="overflow-hidden py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Teknologi"
          title="Perkakas yang kami pakai sehari-hari"
          description="Dipilih karena stabil dan mudah dirawat jangka panjang — bukan karena sedang ramai dibicarakan."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {techStack.map((group) => (
            <Reveal
              key={group.group}
              className="rounded-[var(--radius-card)] border border-line bg-surface p-6"
            >
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                {group.group}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-[var(--radius-pill)] border border-line bg-surface-2/60 px-3 py-1.5 text-sm text-fg-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>

      <div
        className="relative mt-16 flex overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
        aria-hidden="true"
      >
        <div className="animate-marquee flex shrink-0 gap-10 pr-10">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="whitespace-nowrap font-mono text-sm tracking-wide text-fg-subtle"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
