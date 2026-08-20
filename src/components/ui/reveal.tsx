"use client";

import type { ElementType, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, ScrollTrigger);

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

/**
 * Penanda elemen yang muncul saat masuk viewport.
 * Kelas `js-reveal` hanya disembunyikan bila <html> punya kelas `gsap-ready`,
 * jadi tanpa JavaScript seluruh konten tetap terbaca (penting untuk SEO).
 */
type RevealProps = {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>;

export function Reveal({ as, className, children, ...rest }: RevealProps) {
  const Tag = (as ?? "div") as ElementType<Record<string, unknown>>;
  return (
    <Tag data-reveal className={cn("js-reveal", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Dipasang sekali di layout: menyiapkan seluruh animasi scroll halaman. */
export function ScrollAnimator() {
  // Sengaja tanpa `scope`: animator ini memang bekerja untuk seluruh halaman.
  // Dengan scope, teks selector di dalam context akan dibatasi ke elemen scope
  // sehingga [data-reveal] di luar komponen ini tidak akan pernah ditemukan.
  useGSAP(() => {
    window.__revealReady = true;

    const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    if (!targets.length) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motionOk: "(prefers-reduced-motion: no-preference)",
        motionReduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { motionReduced } = context.conditions as Record<string, boolean>;

        if (motionReduced) {
          // Tanpa gerakan: langsung tampilkan keadaan akhir.
          gsap.set(targets, { opacity: 1, y: 0 });
          return;
        }

        // Stagger dihitung per induk: elemen bersaudara muncul berurutan,
        // sementara blok yang berbeda tetap mulai dari nol.
        const seen = new Map<Element, number>();

        targets.forEach((el) => {
          const parent = el.parentElement ?? document.body;
          const index = seen.get(parent) ?? 0;
          seen.set(parent, index + 1);

          gsap.fromTo(
            el,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              delay: Math.min(index, 5) * 0.06,
              overwrite: "auto",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                // "play none none none": sekali tampil, tidak diputar ulang saat scroll balik.
                toggleActions: "play none none none",
                once: true,
              },
            },
          );
        });

        ScrollTrigger.refresh();
      },
    );

    return () => mm.revert();
  }, []);

  return null;
}
