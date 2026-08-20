"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ListIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { ButtonLink } from "@/components/ui/button";
import { sectionIds } from "@/lib/site-config";
import type { Dictionary, Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function SiteHeader({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobile: kunci scroll dan sediakan jalan keluar lewat Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-line bg-glass backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link href={`/${locale}`} aria-label={t.home}>
          <Logo />
        </Link>

        <nav aria-label={t.mainNav} className="hidden items-center gap-1 lg:flex">
          {t.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Pembungkus menahan aturan sembunyi; `inline-flex` milik komponen tidak bisa menimpanya. */}
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} labels={dict.language} />
          </div>
          <ThemeToggle labels={dict.theme} />
          {/* Dibungkus agar aturan sembunyi tidak bertabrakan dengan `inline-flex` bawaan tombol. */}
          <div className="hidden lg:block">
            <ButtonLink href={`#${sectionIds.contact}`}>{t.cta}</ButtonLink>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? t.closeMenu : t.openMenu}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-fg lg:hidden"
          >
            {open ? (
              <XIcon size={20} weight="bold" aria-hidden />
            ) : (
              <ListIcon size={20} weight="bold" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-line bg-glass-strong backdrop-blur-xl lg:hidden"
      >
        <nav aria-label={t.mobileNav} className="container-page flex flex-col gap-1 py-4">
          {t.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3.5 text-base font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 sm:hidden">
            <LanguageSwitcher locale={locale} labels={dict.language} />
          </div>
          <ButtonLink
            href={`#${sectionIds.contact}`}
            size="lg"
            className="mt-3"
            onClick={() => setOpen(false)}
          >
            {t.cta}
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
