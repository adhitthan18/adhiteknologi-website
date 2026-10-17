# adhiteknologi-website

The bilingual (Indonesian/English) company website for PT Adhi Teknologi Indonesia: **[adhiteknologi.com](https://adhiteknologi.com)**.

It presents three service lines (websites, IoT, POS systems), the company's own products, and client and hardware work. The site is self-hosted on a VPS.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 with CSS-variable design tokens, light and dark themes |
| Motion | GSAP + ScrollTrigger (`useGSAP`): masked text reveals, a giant outline wordmark written letter by letter |
| i18n | Built-in `/[lang]` routing, with no i18n library |
| Icons and fonts | Phosphor Icons; Plus Jakarta Sans and JetBrains Mono via `next/font` |

## Notable details

- **Type-checked translations.** All copy lives in `src/lib/dictionaries/`. The English dictionary is typed against the Indonesian one (`type Dictionary = typeof id`), so the build fails if a key is missing from, or added to, only one language.
- **Statically rendered per language.** `/id` and `/en` are static pages with `hreflang`, canonical URLs, a sitemap, Open Graph tags, and JSON-LD. The language switcher uses plain links, not JavaScript.
- **Accessibility.**
  - Text contrast meets WCAG AA in both themes.
  - Every animation is skipped under *prefers-reduced-motion*.
  - Reveal targets are hidden only after GSAP has loaded (`html.gsap-ready`), so content stays readable without JavaScript and to crawlers.
- **Private contact form.** The form sends nothing to a server. It composes a message on the visitor's device and opens it in WhatsApp or their email app, so no visitor data is stored.
- **Project feed.** `GET /api/projects.json` is a static JSON feed of portfolio entries, built from the same constants as the portfolio section. A separate LinkedIn automation watches it and drafts a post for each new project. Project `id`s are stable by design.
- **Brand system.** Logo geometry is copied exactly from the official brand kit. Its gradients read from CSS variables, so one component renders both the primary and the reversed logo.

## Development

```bash
npm ci
npm run dev       # http://localhost:3000 redirects to /id; /en for English
npm run lint
npm run build && npm start
```

```text
src/
├─ app/[lang]/          layout (metadata, hreflang, JSON-LD) and page
├─ app/api/projects.json/  static project feed
├─ components/
│  ├─ sections/         hero, services, products, portfolio, process, FAQ, contact, …
│  ├─ layout/           header, footer, logo, theme toggle, language switcher
│  └─ ui/               button, section heading, scroll reveal
└─ lib/
   ├─ dictionaries/     id.ts and en.ts: all copy
   ├─ i18n.ts           locales and dictionary loader
   └─ site-config.ts    untranslated data: contacts, domains, products
```

## Deployment

The site runs on a VPS with Node.js behind nginx, managed by PM2. It builds with `output: "standalone"`, so the runtime is about 24 MB instead of the full `node_modules`.

```text
deploy/pack.sh ─> source tarball ─scp─> server
                                         └─ bootstrap.sh   build, PM2, nginx (HTTP or TLS template)
                                            └─ verify.sh   post-deploy checks
```

Full steps, including rollback, are in [`deploy/README.md`](deploy/README.md) (Indonesian). The app needs no code changes to deploy on Vercel or Netlify instead.
