import {
  CheckIcon,
  CubeIcon,
  MonitorIcon,
  StorefrontIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { services, supportServices, type Pillar } from "@/lib/site-config";

const pillarStyle: Record<Pillar, { icon: Icon; text: string; soft: string; ring: string }> = {
  web: { icon: MonitorIcon, text: "text-web", soft: "bg-web-soft", ring: "group-hover:border-web/50" },
  iot: { icon: CubeIcon, text: "text-iot", soft: "bg-iot-soft", ring: "group-hover:border-iot/50" },
  pos: { icon: StorefrontIcon, text: "text-pos", soft: "bg-pos-soft", ring: "group-hover:border-pos/50" },
};

export function Services() {
  return (
    <section id="layanan" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Layanan"
          title="Tiga pilar pekerjaan kami"
          description="Tiap pilar punya kebutuhan teknis berbeda, tapi ditangani proses dan standar kualitas yang sama."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {services.map((service) => {
            const style = pillarStyle[service.pillar];
            const Icon = style.icon;
            return (
              <Reveal
                key={service.id}
                as="article"
                className={`group flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-7 transition-[border-color,transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_hsl(var(--shadow-color)/0.6)] ${style.ring}`}
              >
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${style.soft}`}
                >
                  <Icon size={24} weight="duotone" className={style.text} aria-hidden />
                </span>

                <h3 className="mt-6 text-xl font-bold tracking-tight">{service.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-muted">{service.summary}</p>

                <ul className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-fg-muted">
                      <CheckIcon
                        size={16}
                        weight="bold"
                        className={`mt-0.5 shrink-0 ${style.text}`}
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <p className="mt-auto pt-7 font-mono text-xs tracking-wide text-fg-subtle">
                  {service.deliverable}
                </p>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {supportServices.map((item) => (
            <Reveal
              key={item.title}
              className="rounded-[var(--radius-card)] border border-line bg-surface-2/50 p-6"
            >
              <h3 className="text-base font-bold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
