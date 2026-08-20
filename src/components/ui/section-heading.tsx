import type { ReactNode } from "react";
import { Reveal } from "./reveal";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      <Reveal as="p" className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        {eyebrow}
      </Reveal>
      <Reveal as="h2" className="text-3xl font-extrabold leading-[1.15] tracking-tight text-balance sm:text-4xl">
        {title}
      </Reveal>
      {description && (
        <Reveal as="p" className="text-base leading-relaxed text-fg-muted sm:text-lg">
          {description}
        </Reveal>
      )}
    </div>
  );
}
