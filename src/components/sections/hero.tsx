import {
  ArrowRightIcon,
  CubeIcon,
  MonitorIcon,
  StorefrontIcon,
} from "@phosphor-icons/react/dist/ssr";
import { HeroCanvas } from "@/components/three/hero-canvas";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const pillars = [
  { icon: MonitorIcon, label: "Website & Web App", tint: "text-web", bg: "bg-web-soft" },
  { icon: CubeIcon, label: "Solusi IoT", tint: "text-iot", bg: "bg-iot-soft" },
  { icon: StorefrontIcon, label: "Sistem POS", tint: "text-pos", bg: "bg-pos-soft" },
];

export function Hero() {
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
            <span className="text-xs font-semibold tracking-wide text-fg-muted">
              Software house · Menerima project baru
            </span>
          </Reveal>

          <Reveal
            as="h1"
            className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight text-balance sm:text-6xl lg:text-[4.25rem]"
          >
            Website, <span className="text-gradient">IoT</span>, dan sistem kasir —
            dibangun oleh satu tim.
          </Reveal>

          <Reveal as="p" className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
            Adhi Teknologi mengerjakan pembuatan website, perangkat serta platform IoT, dan sistem
            POS untuk usaha di Indonesia. Dari perencanaan, pengembangan, sampai perawatan setelah
            rilis.
          </Reveal>

          <Reveal className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="#kontak" size="lg">
              Mulai project Anda
              <ArrowRightIcon size={18} weight="bold" aria-hidden />
            </ButtonLink>
            <ButtonLink href="#produk" variant="secondary" size="lg">
              Lihat produk kami
            </ButtonLink>
          </Reveal>

          <Reveal className="mt-12 flex flex-wrap gap-3">
            {pillars.map(({ icon: Icon, label, tint, bg }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-line bg-glass px-4 py-2.5 text-sm font-medium text-fg backdrop-blur-md"
              >
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${bg}`}>
                  <Icon size={16} weight="bold" className={tint} aria-hidden />
                </span>
                {label}
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
