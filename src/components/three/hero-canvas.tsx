"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { LogoMark3D } from "./logo-mark-3d";
import { useIsHydrated, usePrefersReducedMotion } from "@/lib/use-client-env";

// Warna prisma mengikuti dua varian marka di brand kit: primer untuk latar
// terang, reverse untuk latar gelap. Nilainya sengaja sedikit dinaikkan dari
// hex datar karena material ber-cahaya menggelapkan warna dasar.
const PALETTES = {
  light: {
    left: "#12305c",
    right: "#2f7ad1",
    gold: "#f5b301",
    rim: "#8fb6ec",
  },
  dark: {
    left: "#e8eef9",
    right: "#8fb6ec",
    gold: "#ffd500",
    rim: "#2f7ad1",
  },
} as const;

/**
 * Pembungkus Canvas untuk hero.
 * - satu renderer untuk seluruh halaman (hanya Canvas ini)
 * - dpr dibatasi 2 agar tidak membakar GPU di layar retina
 * - render loop berhenti saat tab disembunyikan atau canvas keluar viewport
 */
export function HeroCanvas() {
  const wrapper = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const mounted = useIsHydrated();
  const [active, setActive] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;

    let visible = !document.hidden;
    let onScreen = true;
    const sync = () => setActive(visible && onScreen);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "120px" },
    );
    io.observe(el);

    const onVisibility = () => {
      visible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const palette = useMemo(
    () => (resolvedTheme === "light" ? PALETTES.light : PALETTES.dark),
    [resolvedTheme],
  );

  return (
    <div ref={wrapper} className="absolute inset-0" aria-hidden="true">
      {/* Lapisan cahaya CSS: tetap tampil kalau WebGL tidak tersedia */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--brand-soft),transparent_65%)] blur-2xl" />
      </div>

      {mounted && !failed && (
        <Canvas
          className="!absolute inset-0"
          dpr={[1, 2]}
          frameloop={active ? "always" : "never"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 8.2], fov: 42 }}
          onCreated={({ gl }) => gl.setClearAlpha(0)}
          fallback={null}
        >
          <LogoMark3D palette={palette} reducedMotion={reducedMotion} />
        </Canvas>
      )}
      <WebGLGuard onFail={() => setFailed(true)} />
    </div>
  );
}

/** Deteksi WebGL sekali; kalau tidak didukung, canvas tidak dirender sama sekali. */
function WebGLGuard({ onFail }: { onFail: () => void }) {
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok =
        !!window.WebGLRenderingContext &&
        !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      if (!ok) onFail();
    } catch {
      onFail();
    }
  }, [onFail]);
  return null;
}
