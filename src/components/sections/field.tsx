import Image from "next/image";
import { InfoIcon } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { fieldPhotos, sectionIds } from "@/lib/site-config";
import type { Dictionary } from "@/lib/i18n";

export function Field({ dict }: { dict: Dictionary }) {
  const t = dict.field;

  return (
    <section id={sectionIds.field} className="border-y border-line bg-surface/40 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} description={t.description} />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {fieldPhotos.map((photo, i) => (
            <Reveal
              key={photo.id}
              as="figure"
              className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface"
            >
              <Image
                src={photo.src}
                alt={t.photos[photo.id]}
                width={photo.width}
                height={photo.height}
                /* Hanya foto pertama yang mungkin terlihat lebih awal; sisanya
                   dimuat malas agar tidak menahan render bagian di atasnya. */
                loading={i === 0 ? "eager" : "lazy"}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[3/2] w-full object-cover"
              />
            </Reveal>
          ))}
        </div>

        {/* Foto memperlihatkan orang yang dapat dikenali, jadi status izinnya
            dinyatakan terbuka di halaman — bukan hanya disimpan di arsip. */}
        <Reveal className="mt-8 flex items-start gap-3 text-sm leading-relaxed text-fg-muted">
          <InfoIcon size={18} weight="duotone" className="mt-0.5 shrink-0 text-web" aria-hidden />
          {t.note}
        </Reveal>
      </div>
    </section>
  );
}
