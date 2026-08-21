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

  // Flex column supaya `order` bisa memindahkan canvas ke bawah teks di layar
  // sempit. Satu canvas saja untuk seluruh halaman — merender dua Canvas
  // (satu disembunyikan CSS) tetap membuat dua konteks WebGL.
  return (
    <section
      id="hero"
      className="relative isolate flex flex-col overflow-hidden pt-32 pb-16 sm:pt-40 lg:block lg:pb-28"
    >
      <div className="absolute inset-0 -z-10 grid-backdrop" data-parallax aria-hidden="true" />

      {/* Mobile: blok tersendiri di bawah teks, tidak menimpa apa pun.
          Desktop (lg+): kembali menjadi lapisan absolut di belakang konten. */}
      <div className="order-2 mt-10 h-[19rem] w-full sm:h-[23rem] lg:absolute lg:inset-x-0 lg:top-0 lg:-z-10 lg:order-none lg:mt-0 lg:h-[46rem]">
        <HeroCanvas />
      </div>

      <div className="container-page relative order-1 lg:order-none">
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
            data-split
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
