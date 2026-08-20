import { Reveal } from "@/components/ui/reveal";
import { stats } from "@/lib/site-config";

export function Stats() {
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="container-page grid grid-cols-1 gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Reveal
            key={item.label}
            className="flex flex-col gap-2 border-line py-8 sm:border-r sm:px-6 sm:last:border-r-0 lg:py-10"
          >
            <p className="font-mono text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
              {item.value}
              <span className="text-brand">{item.suffix}</span>
            </p>
            <p className="text-sm leading-relaxed text-fg-muted">{item.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
