import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { productMeta, sectionIds, type Pillar } from "@/lib/site-config";
import type { Dictionary } from "@/lib/i18n";

const accent: Record<Pillar, { text: string; soft: string; border: string }> = {
  web: { text: "text-web", soft: "bg-web-soft", border: "hover:border-web/50" },
  iot: { text: "text-iot", soft: "bg-iot-soft", border: "hover:border-iot/50" },
  pos: { text: "text-pos", soft: "bg-pos-soft", border: "hover:border-pos/50" },
};

/** Ilustrasi antarmuka — bentuk abstrak, bukan tangkapan layar atau data nyata. */
function Preview({ pillar }: { pillar: Pillar }) {
  const tone = accent[pillar];
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-line bg-surface-2/70 p-4"
      aria-hidden="true"
    >
      <div className="flex gap-1.5 pb-3">
        <span className="h-2 w-2 rounded-full bg-line-strong" />
        <span className="h-2 w-2 rounded-full bg-line-strong" />
        <span className="h-2 w-2 rounded-full bg-line-strong" />
      </div>

      {pillar === "iot" && (
        <div className="flex gap-3">
          <div className="flex w-1/3 flex-col gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-surface px-2 py-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${i < 3 ? "bg-iot" : "bg-warning"}`} />
                <span className="h-1.5 flex-1 rounded-full bg-line" />
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-lg bg-surface p-3">
            <svg viewBox="0 0 120 44" className="h-full w-full" preserveAspectRatio="none">
              <polyline
                points="0,34 15,26 30,30 45,14 60,20 75,8 90,16 105,6 120,12"
                fill="none"
                className={tone.text}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {pillar === "pos" && (
        <div className="flex gap-3">
          <div className="grid flex-1 grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`h-9 rounded-lg ${i === 1 ? tone.soft : "bg-surface"}`} />
            ))}
          </div>
          <div className="flex w-1/3 flex-col gap-2 rounded-lg bg-surface p-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 rounded-full bg-line" />
            ))}
            <span className={`mt-auto h-5 rounded-md ${tone.soft}`} />
          </div>
        </div>
      )}

      {pillar === "web" && (
        <div className="flex flex-col gap-2">
          <div className={`h-10 rounded-lg ${tone.soft}`} />
          <div className="flex gap-2">
            <div className="h-14 flex-1 rounded-lg bg-surface" />
            <div className="h-14 flex-1 rounded-lg bg-surface" />
            <div className="h-14 flex-1 rounded-lg bg-surface" />
          </div>
        </div>
      )}
    </div>
  );
}

export function Products({ dict }: { dict: Dictionary }) {
  const t = dict.products;

  return (
    <section id={sectionIds.products} className="border-y border-line bg-surface/40 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

        {/* Dua produk, jadi dua kolom — tiga kolom akan menyisakan satu sel kosong. */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {productMeta.map((meta) => {
            const copy = t.items[meta.id];
            const tone = accent[meta.pillar];
            const external = meta.href.startsWith("http");

            return (
              <Reveal
                key={meta.id}
                as="article"
                className={`flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-[border-color,transform] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 ${tone.border}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-[var(--radius-pill)] px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-wider ${tone.soft} ${tone.text}`}
                  >
                    {copy.kicker}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-fg-subtle">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
                    {copy.status}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-extrabold tracking-tight">{copy.name}</h3>
                <a
                  href={meta.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`mt-1 inline-flex w-fit items-center gap-1 py-1 font-mono text-sm ${tone.text} hover:underline`}
                >
                  {meta.domain}
                  <ArrowUpRightIcon size={14} weight="bold" aria-hidden />
                  {external && <span className="sr-only">{t.newTab}</span>}
                </a>

                <p className="mt-4 text-[0.95rem] leading-relaxed text-fg-muted">{copy.body}</p>

                <div className="mt-6">
                  <Preview pillar={meta.pillar} />
                </div>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {copy.features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-[var(--radius-pill)] border border-line px-3 py-1.5 text-xs text-fg-muted"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
