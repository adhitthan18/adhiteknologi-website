import Link from "next/link";
import {
  GithubLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Logo } from "./logo";
import { navLinks, products, services, site } from "@/lib/site-config";

const socials = [
  { href: site.social.instagram, label: "Instagram", Icon: InstagramLogoIcon },
  { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedinLogoIcon },
  { href: site.social.github, label: "GitHub", Icon: GithubLogoIcon },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface/60">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-sm leading-relaxed text-fg-muted">{site.description}</p>
          <div className="mt-6 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} ${site.name} (buka di tab baru)`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                <Icon size={19} weight="regular" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Layanan">
          {services.map((service) => (
            <FooterLink key={service.id} href="#layanan">
              {service.title.replace(" & Aplikasi Web", "").replace("Sistem ", "")}
            </FooterLink>
          ))}
          <FooterLink href="#layanan">Maintenance & Support</FooterLink>
        </FooterColumn>

        <FooterColumn title="Produk">
          {products.map((product) => (
            <FooterLink key={product.name} href={product.href} external={product.href.startsWith("http")}>
              {product.name}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Perusahaan">
          {navLinks.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
          <FooterLink href="#kontak">Kontak</FooterLink>
        </FooterColumn>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Seluruh hak cipta dilindungi.
          </p>
          <p className="font-mono">{site.domain}</p>
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
        <Link href={href} className="inline-block py-0.5 text-sm text-fg-muted transition-colors hover:text-fg">
          {children}
        </Link>
      )}
    </li>
  );
}
