"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ListIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { navLinks } from "@/lib/site-config";
import { cn } from "@/lib/cn";

export function SiteHeader() {
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
        <Link href="/" aria-label="Adhi Teknologi — beranda">
          <Logo />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
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
          <ThemeToggle />
          {/* Dibungkus agar aturan sembunyi tidak bertabrakan dengan `inline-flex` bawaan tombol. */}
          <div className="hidden sm:block">
            <ButtonLink href="#kontak">Konsultasi gratis</ButtonLink>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-fg lg:hidden"
          >
            {open ? <XIcon size={20} weight="bold" aria-hidden /> : <ListIcon size={20} weight="bold" aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-line bg-glass-strong backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Navigasi mobile" className="container-page flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3.5 text-base font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink href="#kontak" size="lg" className="mt-2" onClick={() => setOpen(false)}>
            Konsultasi gratis
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
