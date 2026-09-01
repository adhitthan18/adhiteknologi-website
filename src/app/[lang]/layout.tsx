import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScrollAnimator } from "@/components/ui/reveal";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { site } from "@/lib/site-config";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${dict.meta.tagline}`,
      template: `%s · ${site.name}`,
    },
    description: dict.meta.description,
    keywords: [...dict.meta.keywords, site.name],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    openGraph: {
      type: "website",
      locale: dict.ogLocale,
      url: `${site.url}/${lang}`,
      siteName: site.name,
      title: `${site.legalName} — ${dict.meta.tagline}`,
      description: dict.meta.description,
      images: [
        {
          url: site.ogImage,
          width: 1600,
          height: 1000,
          alt: `${site.legalName} — ${dict.meta.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.legalName} — ${dict.meta.tagline}`,
      description: dict.meta.description,
      images: [site.ogImage],
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        id: "/id",
        en: "/en",
        "x-default": "/id",
      },
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#060a12" },
  ],
};

/**
 * Menyembunyikan elemen ber-reveal sebelum cat pertama, tapi hanya bila JavaScript
 * benar-benar jalan. Bila animator gagal dimuat dalam 2,5 detik, kelasnya dilepas
 * supaya konten tidak pernah tertinggal dalam keadaan tak terlihat.
 */
const revealBootstrap = `
document.documentElement.classList.add('gsap-ready');
setTimeout(function(){
  if(!window.__revealReady){ document.documentElement.classList.remove('gsap-ready'); }
}, 2500);
`;

function organizationSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: `${site.url}/brand/ati-lockup-primer.svg`,
    slogan: site.motto.join(" · "),
    description,
    email: site.email,
    telephone: site.phone,
    address: { "@type": "PostalAddress", addressCountry: "ID" },
    foundingDate: String(site.founded),
    sameAs: Object.values(site.social),
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <html lang={dict.htmlLang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body className={`${jakarta.variable} ${mono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#konten"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-brand-fg"
          >
            {dict.nav.skipToContent}
          </a>
          <SiteHeader dict={dict} locale={locale} />
          <main id="konten">{children}</main>
          <SiteFooter dict={dict} locale={locale} />
          <ScrollAnimator />
          <CustomCursor label={dict.cursor.hello} />
        </ThemeProvider>

        <Script
          id="schema-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema(dict.meta.description)),
          }}
        />
      </body>
    </html>
  );
}
