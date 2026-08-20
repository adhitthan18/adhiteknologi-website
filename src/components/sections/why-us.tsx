import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { differentiators } from "@/lib/site-config";

export function WhyUs() {
  return (
    <section className="border-y border-line bg-surface/40 py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
        <SectionHeading
          eyebrow="Kenapa Adhi Teknologi"
          title="Alasan klien bertahan setelah project pertama"
          description="Bukan karena harga paling murah, tapi karena tahu persis apa yang dikerjakan dan siapa yang bertanggung jawab."
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
          {differentiators.map((item) => (
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
