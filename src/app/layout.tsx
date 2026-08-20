import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScrollAnimator } from "@/components/ui/reveal";
import { site } from "@/lib/site-config";

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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "jasa pembuatan website",
    "software house Indonesia",
    "jasa IoT",
    "sistem POS",
    "aplikasi kasir",
    "web developer Indonesia",
    site.name,
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  url: site.url,
  description: site.description,
  email: site.email,
  telephone: site.phone,
  address: { "@type": "PostalAddress", addressCountry: "ID" },
  foundingDate: String(site.founded),
  sameAs: Object.values(site.social),
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pembuatan Website & Aplikasi Web" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Solusi & Perangkat IoT" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sistem POS & Kasir" } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body className={`${jakarta.variable} ${mono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#konten"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-brand-fg"
          >
            Lompat ke konten utama
          </a>
          <SiteHeader />
          <main id="konten">{children}</main>
          <SiteFooter />
          <ScrollAnimator />
        </ThemeProvider>

        <Script
          id="schema-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
