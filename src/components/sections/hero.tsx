import {
  ArrowRightIcon,
  CubeIcon,
  MonitorIcon,
  StorefrontIcon,
} from "@phosphor-icons/react/dist/ssr";
import { HeroCanvas } from "@/components/three/hero-canvas";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { sectionIds } from "@/lib/site-config";
import type { Dictionary } from "@/lib/i18n";

const pillars = [
  { key: "web", icon: MonitorIcon, tint: "text-web", bg: "bg-web-soft" },
  { key: "iot", icon: CubeIcon, tint: "text-iot", bg: "bg-iot-soft" },
  { key: "pos", icon: StorefrontIcon, tint: "text-pos", bg: "bg-pos-soft" },
] as const;

export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 -z-10 grid-backdrop" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[46rem]">
        <HeroCanvas />
      </div>

      <div className="container-page relative">
        <div className="max-w-3xl">
          <Reveal className="inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-line bg-glass px-4 py-2 backdrop-blur-md">
            <span
              className="h-2 w-2 rounded-full bg-brand [animation:pulse-dot_2.4s_ease-in-out_infinite]"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold tracking-wide text-fg-muted">{t.badge}</span>
          </Reveal>

          <Reveal
            as="h1"
            className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight text-balance sm:text-6xl lg:text-[4.25rem]"
          >
            {t.titleStart}
            <span className="text-gradient">{t.titleHighlight}</span>
            {t.titleEnd}
          </Reveal>

          <Reveal as="p" className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
            {t.subtitle}
          </Reveal>

          <Reveal className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={`#${sectionIds.contact}`} size="lg">
              {t.ctaPrimary}
              <ArrowRightIcon size={18} weight="bold" aria-hidden />
            </ButtonLink>
            <ButtonLink href={`#${sectionIds.products}`} variant="secondary" size="lg">
              {t.ctaSecondary}
            </ButtonLink>
          </Reveal>

          <Reveal className="mt-12 flex flex-wrap gap-3">
            {pillars.map(({ key, icon: Icon, tint, bg }) => (
              <span
                key={key}
                className="inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-line bg-glass px-4 py-2.5 text-sm font-medium text-fg backdrop-blur-md"
              >
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${bg}`}>
                  <Icon size={16} weight="bold" className={tint} aria-hidden />
                </span>
                {t.pillars[key]}
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
