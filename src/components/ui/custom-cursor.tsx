"use client";

import { useEffect, useRef } from "react";

/** Seberapa jauh pil tertinggal di belakang kursor. Makin kecil, makin malas. */
const LERP_PIL = 0.08;
/** Kecepatan pil dan cincin tumbuh atau menyusut. */
const LERP_SKALA = 0.15;

/**
 * Cincin yang mengikuti kursor persis, plus pil kaca yang tertinggal di
 * belakangnya.
 *
 * Kursor sistem sengaja TIDAK disembunyikan. `cursor: none` membuat orang
 * kehilangan penunjuk sama sekali kalau JavaScript gagal dimuat, dan
 * menghilangkan isyarat bentuk kursor yang dipakai banyak orang untuk tahu
 * apa yang bisa diklik. Kedua elemen ini menumpang di atasnya, bukan
 * menggantikannya.
 */
export function CustomCursor({ label }: { label: string }) {
  const cincin = useRef<HTMLDivElement>(null);
  const pil = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hanya untuk penunjuk presisi. Di layar sentuh tidak ada kursor untuk
    // diikuti, dan elemen ini justru akan tersangkut di titik sentuh terakhir.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const c = cincin.current;
    const p = pil.current;
    if (!c || !p) return;

    let tikusX = window.innerWidth / 2;
    let tikusY = window.innerHeight / 2;
    let pilX = tikusX;
    let pilY = tikusY;
    let skala = 0;
    let targetSkala = 0;
    let diAtasTautan = false;
    let pertama = true;
    let frame = 0;

    const gerak = (e: PointerEvent) => {
      tikusX = e.clientX;
      tikusY = e.clientY;

      // Lompatan di gerakan pertama dihindari dengan menempatkan pil tepat di
      // kursor, bukan menariknya dari tengah layar.
      if (pertama) {
        pilX = tikusX;
        pilY = tikusY;
        pertama = false;
        c.dataset.aktif = "true";
        p.dataset.aktif = "true";
      }

      if (!diAtasTautan) targetSkala = 1;
    };

    // Satu listener untuk seluruh halaman, bukan satu per tautan. Situs ini
    // punya puluhan tautan, dan memasang listener di masing-masing berarti
    // memasang ulang setiap kali React merender bagian mana pun.
    const lewat = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const interaktif = Boolean(target?.closest?.("a, button, [role='button']"));
      if (interaktif === diAtasTautan) return;

      diAtasTautan = interaktif;
      targetSkala = interaktif ? 0 : 1;
      c.dataset.lebar = interaktif ? "true" : "false";
    };

    const keluarJendela = () => {
      targetSkala = 0;
    };
    const masukJendela = () => {
      if (!diAtasTautan) targetSkala = 1;
    };

    const putar = () => {
      pilX += (tikusX - pilX) * LERP_PIL;
      pilY += (tikusY - pilY) * LERP_PIL;
      skala += (targetSkala - skala) * LERP_SKALA;

      const skalaCincin = diAtasTautan ? 1.6 * skala : skala;

      // translate3d memaksa komposisi di GPU; hanya transform yang berubah,
      // jadi tidak ada reflow di 60 frame per detik.
      p.style.transform = `translate3d(${pilX}px, ${pilY}px, 0) translate(-50%, -50%) scale(${skala})`;
      c.style.transform = `translate3d(${tikusX}px, ${tikusY}px, 0) translate(-50%, -50%) scale(${skalaCincin})`;

      frame = requestAnimationFrame(putar);
    };

    window.addEventListener("pointermove", gerak, { passive: true });
    window.addEventListener("pointerover", lewat, { passive: true });
    document.addEventListener("pointerleave", keluarJendela);
    document.addEventListener("pointerenter", masukJendela);
    frame = requestAnimationFrame(putar);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", gerak);
      window.removeEventListener("pointerover", lewat);
      document.removeEventListener("pointerleave", keluarJendela);
      document.removeEventListener("pointerenter", masukJendela);
    };
  }, []);

  return (
    <>
      <div ref={cincin} aria-hidden="true" className="cursor-cincin" />
      <div ref={pil} aria-hidden="true" className="cursor-pil backdrop-blur-md backdrop-saturate-150">
        {label}
      </div>
    </>
  );
}
