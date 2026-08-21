"use client";

import type { ElementType, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";
import { heroScroll } from "@/lib/scroll-progress";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

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
export function Reveal({
  as,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>) {
  const Tag = (as ?? "div") as ElementType<Record<string, unknown>>;
  return (
    <Tag data-reveal className={cn("js-reveal", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Dipasang sekali di layout: menyiapkan seluruh animasi scroll halaman. */
export function ScrollAnimator() {
  useGSAP(() => {
    window.__revealReady = true;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motionOk: "(prefers-reduced-motion: no-preference)",
        motionReduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { motionReduced } = context.conditions as Record<string, boolean>;

        const revealTargets = gsap.utils.toArray<HTMLElement>(
          "[data-reveal]:not([data-split])",
        );
        const splitTarget = document.querySelector<HTMLElement>("[data-split]");
        const cleanups: Array<() => void> = [];

        // ---------------------------------------------------------------
        // Tanpa gerakan: tampilkan keadaan akhir, lalu selesai.
        // Scroll hero tetap disambungkan ke scene 3D karena itu posisi, bukan
        // animasi otomatis — pengguna sendiri yang menggerakkannya.
        // ---------------------------------------------------------------
        if (motionReduced) {
          gsap.set(revealTargets, { opacity: 1, y: 0 });
          if (splitTarget) gsap.set(splitTarget, { opacity: 1 });
          heroScroll.progress = 0;
          return;
        }

        // ---------------------------------------------------------------
        // 1. Reveal umum — muncul berurutan per induk.
        // ---------------------------------------------------------------
        const seen = new Map<Element, number>();
        revealTargets.forEach((el) => {
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
              scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none", once: true },
            },
          );
        });

        // ---------------------------------------------------------------
        // 2. Judul hero — dipecah per kata, bukan per huruf.
        // Judulnya sepuluh kata; memecah per huruf membuat ratusan node DOM dan
        // berisiko merusak gradien yang di-clip ke teks.
        // ---------------------------------------------------------------
        if (splitTarget) {
          gsap.set(splitTarget, { opacity: 1 });
          const split = new SplitText(splitTarget, { type: "words" });
          gsap.from(split.words, {
            opacity: 0,
            yPercent: 60,
            duration: 0.7,
            ease: "expo.out",
            stagger: 0.045,
          });
          // Kembalikan node teks aslinya agar pembaca layar dan alat bantu lain
          // tidak menemukan teks yang terpecah-pecah.
          cleanups.push(() => split.revert());
        }

        // ---------------------------------------------------------------
        // 3. Scroll hero → scene 3D. Nilainya ditulis ke objek biasa supaya
        // tidak memicu render ulang React tiap frame.
        // ---------------------------------------------------------------
        const hero = document.getElementById("hero");
        if (hero) {
          ScrollTrigger.create({
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              heroScroll.progress = self.progress;
            },
          });
        }

        // ---------------------------------------------------------------
        // 4. Parallax latar. Hanya transform — tidak memicu reflow.
        // ---------------------------------------------------------------
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.to(el, {
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        // ---------------------------------------------------------------
        // 5. Angka statistik menghitung naik sekali saat masuk layar.
        // ---------------------------------------------------------------
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          if (!Number.isFinite(target)) return;

          // Tween dibuat dalam keadaan paused dan baru diputar oleh ScrollTrigger.
          // Kalau tween langsung dipasangi scrollTrigger, GSAP merender frame nol
          // saat pembuatan dan menulis "0" ke DOM — pengunjung melihat angka nol
          // sebelum sempat menggulir, dan nol itu menetap bila animasinya tak jadi
          // berjalan. Angka asli tetap utuh sampai animasinya benar-benar mulai.
          const counter = { value: 0 };
          const tween = gsap.to(counter, {
            value: target,
            duration: 1.3,
            ease: "power2.out",
            snap: { value: 1 },
            paused: true,
            onUpdate: () => {
              el.textContent = String(Math.round(counter.value));
            },
            // Pastikan berhenti tepat di angka aslinya, bukan hasil pembulatan.
            onComplete: () => {
              el.textContent = String(target);
            },
          });

          ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () => tween.play(),
          });

          cleanups.push(() => {
            tween.kill();
            el.textContent = String(target);
          });
        });

        // ---------------------------------------------------------------
        // 6. Garis tahapan proses "digambar" mengikuti scroll.
        // ---------------------------------------------------------------
        const line = document.querySelector<HTMLElement>("[data-progress-line]");
        if (line?.parentElement) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: line.parentElement,
                start: "top 75%",
                end: "bottom 85%",
                scrub: 0.6,
              },
            },
          );
        }

        ScrollTrigger.refresh();

        return () => cleanups.forEach((fn) => fn());
      },
    );

    return () => mm.revert();
  }, []);

  return null;
}
