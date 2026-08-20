"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Nilai tetap reaktif: pengguna bisa mengubah setelan sistem di tengah sesi
 * dan animasi harus ikut berhenti tanpa perlu memuat ulang halaman.
 */
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false, // di server anggap gerakan diizinkan; klien mengoreksinya saat hydration
  );
}

const noopSubscribe = () => () => {};

/** false saat render server dan render hydration pertama, true sesudahnya. */
export function useIsHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
