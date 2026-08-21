# Adhi Teknologi — Company Profile

Situs company profile dua bahasa (Indonesia & Inggris) untuk **adhiteknologi.com**.
Menampilkan tiga pilar layanan — website, IoT, sistem POS — beserta produk yang sudah
berjalan: `iotmaxhub.com` dan `satumeja.com`.

## Stack

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 dengan design token CSS variable |
| 3D | Three.js via `@react-three/fiber` |
| Animasi | GSAP + ScrollTrigger (`useGSAP`) |
| Tema | `next-themes` (gelap / terang / mengikuti sistem) |
| Bahasa | Routing `/[lang]` bawaan Next.js, tanpa library i18n |
| Ikon | Phosphor Icons (SVG, bukan emoji) |
| Font | Plus Jakarta Sans + JetBrains Mono via `next/font` |

## Menjalankan

```bash
npm run dev
```

- http://localhost:3000/id — Bahasa Indonesia
- http://localhost:3000/en — English
- http://localhost:3000 — dialihkan ke `/id`

```bash
npm run build && npm start
```

## Struktur

```
src/
├─ app/
│  ├─ [lang]/
│  │  ├─ layout.tsx      root layout: <html lang>, metadata per bahasa, hreflang, JSON-LD
│  │  └─ page.tsx        susunan seluruh section
│  ├─ globals.css        design token terang & gelap + utility kustom
│  ├─ icon.svg           favicon
│  ├─ robots.ts / sitemap.ts
├─ components/
│  ├─ three/             scene 3D hero (Canvas + jaringan node)
│  ├─ layout/            header, footer, logo, tombol tema, pengalih bahasa
│  ├─ sections/          hero, stats, layanan, produk, proses, why-us, tech, faq, kontak
│  ├─ ui/                button, section-heading, reveal (animasi scroll)
│  └─ providers/         pembungkus next-themes
└─ lib/
   ├─ dictionaries/
   │  ├─ id.ts           SELURUH TEKS BAHASA INDONESIA
   │  └─ en.ts           SELURUH TEKS BAHASA INGGRIS
   ├─ i18n.ts            daftar bahasa, tipe Dictionary, pemuat kamus
   ├─ site-config.ts     data yang tidak diterjemahkan (kontak, domain, tech stack)
   └─ use-client-env.ts  hook reduced-motion & status hydration
```

## Dua bahasa

Setiap bahasa punya URL sendiri (`/id`, `/en`) dan dirender statis saat build, jadi
keduanya bisa diindeks mesin pencari dan dibagikan sebagai tautan.

- Semua teks ada di `src/lib/dictionaries/`. Nama teknologi (Next.js, ESP32, MQTT…)
  sengaja tidak diterjemahkan dan tetap di `site-config.ts`.
- `Dictionary` diturunkan dari `id.ts` (`type Dictionary = typeof id`), jadi **build
  akan gagal** kalau terjemahan Inggris kehilangan atau menambah satu kunci pun.
  Ini yang menjaga kedua bahasa tetap sinkron.
- Pengalih bahasa berupa dua tautan `<a>` biasa, bukan tombol JavaScript, lengkap
  dengan `hreflang` dan `aria-current`.
- Menambah bahasa ketiga: buat `dictionaries/xx.ts`, tambahkan kodenya ke `locales`
  di `i18n.ts`, dan tangani di `getDictionary`. Tidak ada yang lain perlu diubah.

Bahasa default diatur di `next.config.ts` — akar situs `/` dialihkan ke `/id`.

## Kontak

Email dan nomor WhatsApp ada di `src/lib/site-config.ts`:

- `iotadhiteknologi@gmail.com`
- `+62 895-0110-2075` (`whatsapp: "6289501102075"` — format internasional tanpa `+`)

Akun media sosial di `site.social` masih placeholder — ganti, atau hapus dari daftar
`socials` di `src/components/layout/site-footer.tsx` bila belum ada.

## Formulir kontak

Formulir tidak mengirim data ke server mana pun. Isian disusun menjadi teks pesan di
perangkat pengunjung, lalu dibuka lewat WhatsApp atau aplikasi email mereka. Pilihan ini
diambil supaya situs bisa langsung dipakai tanpa backend, dan tidak ada data pengunjung
yang tersimpan.

Kalau nanti ingin dikirim lewat server (Resend, SMTP, atau Formspree), ganti isi
`handleSubmit` di `src/components/sections/contact.tsx` dengan `fetch("/api/contact")`
dan buat route handler-nya di `src/app/api/contact/route.ts`.

## Merek & warna

Situs ini memakai identitas resmi **PT Adhi Teknologi Indonesia** dari brand kit
(`brand-ati/`). Palet diambil langsung dari sana:

| Peran | Terang | Gelap |
|---|---|---|
| Biru korporat (brand) | `#1B4F9C` | `#8FB6EC` |
| Navy | `#0A1F44` | `#DBE8F7` |
| Emas aksen | `#F5B301` | `#FFD500` |

Marka logo ada di [`src/components/layout/logo.tsx`](src/components/layout/logo.tsx).
**Geometri path-nya disalin persis dari brand kit** — jangan diubah di sini. Kalau
bentuk marka direvisi, ubah di brand kit lalu salin ulang, sesuai catatan di README
brand.

Yang berbeda dari berkas asli hanya sumber warnanya: gradien mengambil nilai dari CSS
variable (`--mark-left-from` dan seterusnya), sehingga satu komponen melayani versi
primer (latar terang) dan reverse (latar gelap) tanpa dua berkas terpisah.

> **Emas hanya untuk elemen dekoratif di latar terang.** Kontrasnya di sana cuma
> 1,8:1 — jauh di bawah ambang teks. Di latar gelap emas terbaca (10,7:1) dan boleh
> dipakai untuk teks.

Token didefinisikan dua kali di `globals.css`: `:root` untuk terang dan `.dark` untuk
gelap. Komponen tidak pernah memakai hex langsung, selalu lewat token (`text-fg-muted`,
`bg-surface`, `border-line`, dan seterusnya), jadi mengganti warna cukup di satu tempat.

Kontras teks diperiksa di kedua tema dan seluruhnya memenuhi WCAG AA (≥ 4.5:1 untuk
teks normal).

### Aset merek di dalam project

| Berkas | Dari | Untuk |
|---|---|---|
| `src/app/icon.svg` | `logo/ati-favicon.svg` | Favicon |
| `public/brand/ati-marka-*.svg` | brand kit | Rujukan marka |
| `public/brand/ati-lockup-*.svg` | brand kit | Logo penuh, dipakai di JSON-LD |
| `public/brand/og-korporat.png` | `png/banner-korporat-1600x1000.png` | Gambar Open Graph |

## Aksesibilitas & motion

- Seluruh animasi scroll dan animasi 3D berhenti bila pengguna mengaktifkan
  *reduce motion* di sistem operasinya.
- Render loop 3D berhenti saat tab disembunyikan atau canvas keluar dari viewport.
- Bila WebGL tidak tersedia, canvas tidak dibuat sama sekali dan hero jatuh ke latar
  gradien CSS.
- Tanpa JavaScript seluruh konten tetap terbaca (elemen animasi tidak disembunyikan
  lewat CSS statis).

## Deploy

VPS sendiri: Node.js di balik Nginx, dikelola PM2. Alurnya berbasis paket —
kirim tarball source ke `/opt/src`, lalu bootstrap di server.

```bash
./deploy/pack.sh          # menghasilkan adhiteknologi.tar.gz
# scp ke /opt/src, lalu di server:
#   ./deploy/bootstrap.sh
#   ./deploy/verify.sh
```

Runtime memakai `output: "standalone"` sehingga yang berjalan hanya ± 24 MB.
Perintah lengkap (termasuk lewat Cloudflare Access), konfigurasi Nginx + TLS,
dan cara rollback ada di [`deploy/README.md`](deploy/README.md).

Situs ini juga tetap bisa dideploy ke Vercel atau Netlify tanpa perubahan kode.

Setelah domain `adhiteknologi.com` diarahkan, pastikan `site.url` di `site-config.ts`
sudah benar agar `sitemap.xml`, canonical URL, `hreflang`, dan tag Open Graph ikut
menyesuaikan.

## Referensi desain

Design system hasil generate ada di
[`design-system/adhi-teknologi/MASTER.md`](design-system/adhi-teknologi/MASTER.md) —
berisi pola halaman, tipografi, efek, dan anti-pattern yang dipakai sebagai acuan.

Palet di berkas itu berasal dari generate awal saat aksen masih hijau, dan sudah
ditandai demikian di bagian atasnya. **Sumber kebenaran untuk warna adalah
`src/app/globals.css`.**
