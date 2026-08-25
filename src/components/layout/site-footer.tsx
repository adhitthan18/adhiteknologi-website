import Link from "next/link";
import {
  GithubLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Logo } from "./logo";
import { clientProjects, productMeta, sectionIds, serviceMeta, site } from "@/lib/site-config";
import type { Dictionary, Locale } from "@/lib/i18n";

const socials = [
  { href: site.social.instagram, label: "Instagram", Icon: InstagramLogoIcon },
  { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedinLogoIcon },
  { href: site.social.github, label: "GitHub", Icon: GithubLogoIcon },
];

export function SiteFooter({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.footer;

  return (
    <footer className="border-t border-line bg-surface/60">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo full />

          {/* Moto dari lockup logo resmi. Bilah emas meniru bilah pada marka —
              emas dipakai sebagai elemen dekoratif, bukan sebagai warna teks,
              karena kontrasnya di latar terang hanya 1,8:1. */}
          <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-fg-muted">
            {site.motto.map((word, i) => (
              <span key={word} className="inline-flex items-center gap-2">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-gold" aria-hidden />}
                {word}
              </span>
            ))}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-fg-muted">{dict.meta.description}</p>
          <div className="mt-6 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} ${site.name} ${t.social}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                <Icon size={19} weight="regular" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title={t.columns.services}>
          {serviceMeta.map((meta) => (
            <FooterLink key={meta.id} href={`#${sectionIds.services}`}>
              {dict.hero.pillars[meta.id]}
            </FooterLink>
          ))}
          <FooterLink href={`#${sectionIds.services}`}>{t.maintenance}</FooterLink>
        </FooterColumn>

        <FooterColumn title={t.columns.products}>
          {productMeta.map((meta) => (
            <FooterLink key={meta.id} href={meta.href} external>
              {dict.products.items[meta.id].name}
            </FooterLink>
          ))}
          {clientProjects.slice(0, 2).map((meta) => (
            <FooterLink key={meta.id} href={meta.href} external>
              {dict.portfolio.items[meta.id].name}
            </FooterLink>
          ))}
          <FooterLink href={`#${sectionIds.portfolio}`}>{dict.portfolio.eyebrow}</FooterLink>
        </FooterColumn>

        <FooterColumn title={t.columns.company}>
          {dict.nav.links.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
          <FooterLink href={`#${sectionIds.contact}`}>{dict.nav.contact}</FooterLink>
        </FooterColumn>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. {t.rights}
          </p>
          <p className="font-mono">
            {site.domain}/{locale}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fg">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <li>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block py-0.5 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          {children}
        </a>
      ) : (
        <Link
          href={href}
          className="inline-block py-0.5 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          {children}
        </Link>
      )}
    </li>
  );
}
