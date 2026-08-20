"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@phosphor-icons/react/dist/ssr";
import { useIsHydrated } from "@/lib/use-client-env";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsHydrated();

  const isDark = resolvedTheme === "dark";
  // Sebelum mounted, tema aktif belum diketahui di server — label harus netral
  // supaya markup server dan klien identik saat hydration.
  const label = !mounted
    ? "Ganti tema terang atau gelap"
    : isDark
      ? "Aktifkan tema terang"
      : "Aktifkan tema gelap";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface-2/60 text-fg-muted transition-colors duration-200 hover:border-line-strong hover:text-fg"
    >
      {/* Sebelum hydration selesai, tema belum diketahui — jangan tebak ikonnya. */}
      {mounted ? (
        isDark ? (
          <SunIcon size={19} weight="bold" aria-hidden />
        ) : (
          <MoonIcon size={19} weight="bold" aria-hidden />
        )
      ) : (
        <span className="h-[19px] w-[19px]" />
      )}
    </button>
  );
}
