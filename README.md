# Adhi Teknologi — Company Profile

Situs company profile untuk **adhiteknologi.com**. Menampilkan tiga pilar layanan
(website, IoT, sistem POS) beserta produk yang sudah berjalan: `iotmaxhub.com` dan
`satumeja.com`.

## Stack

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 dengan design token CSS variable |
| 3D | Three.js via `@react-three/fiber` |
| Animasi | GSAP + ScrollTrigger (`useGSAP`) |
| Tema | `next-themes` (dark / light / mengikuti sistem) |
| Ikon | Phosphor Icons (SVG, bukan emoji) |
| Font | Plus Jakarta Sans + JetBrains Mono via `next/font` |

## Menjalankan

```bash
npm run dev
```

Buka http://localhost:3000

```bash
npm run build && npm start
```

## Struktur

```
src/
├─ app/
│  ├─ layout.tsx        metadata, font, provider tema, JSON-LD Organization
│  ├─ page.tsx          susunan seluruh section
│  ├─ globals.css       design token light & dark + utility kustom
│  ├─ icon.svg          favicon
│  ├─ robots.ts / sitemap.ts
├─ components/
│  ├─ three/            scene 3D hero (Canvas + jaringan node)
│  ├─ layout/           header, footer, logo, tombol tema
│  ├─ sections/         hero, stats, layanan, produk, proses, why-us, tech, faq, kontak
│  ├─ ui/               button, section-heading, reveal (animasi scroll)
│  └─ providers/        pembungkus next-themes
└─ lib/
   ├─ site-config.ts    SELURUH TEKS DAN DATA SITUS ADA DI SINI
   └─ use-client-env.ts hook reduced-motion & status hydration
```

## Yang perlu diganti sebelum go-live

Semua ada di [`src/lib/site-config.ts`](src/lib/site-config.ts):

- `email`, `phone`, `whatsapp` — saat ini masih placeholder (`halo@adhiteknologi.com`,
  `+62 812-0000-0000`). Nomor `whatsapp` memakai format internasional tanpa `+`,
  misalnya `6281234567890`.
- `social.instagram` / `linkedin` / `github` — ganti atau hapus dari daftar di
  `src/components/layout/site-footer.tsx` bila belum punya.
- `stats` — angka di sana sengaja konservatif dan bisa diverifikasi. Kalau nanti sudah
  ada jumlah klien atau project nyata, ganti dengan angka itu.

## Formulir kontak

Formulir tidak mengirim data ke server mana pun. Isian disusun menjadi teks pesan di
perangkat pengunjung, lalu dibuka lewat WhatsApp atau aplikasi email mereka. Pilihan ini
diambil supaya situs bisa langsung dipakai tanpa backend, dan tidak ada data pengunjung
yang tersimpan.

Kalau nanti ingin dikirim lewat server (Resend, SMTP, atau Formspree), ganti isi
`handleSubmit` di `src/components/sections/contact.tsx` dengan `fetch("/api/contact")`
dan buat route handler-nya di `src/app/api/contact/route.ts`.

## Tema gelap & terang

Token warna didefinisikan dua kali di `globals.css`: `:root` untuk terang dan `.dark`
untuk gelap. Komponen tidak pernah memakai hex langsung, selalu lewat token
(`text-fg-muted`, `bg-surface`, `border-line`, dan seterusnya), jadi menambah atau
mengubah warna cukup dilakukan di satu tempat.

Kontras teks sudah diperiksa di kedua tema dan seluruhnya memenuhi WCAG AA (≥ 4.5:1
untuk teks normal).

## Aksesibilitas & motion

- Seluruh animasi scroll dan animasi 3D berhenti bila pengguna mengaktifkan
  *reduce motion* di sistem operasinya.
- Render loop 3D berhenti saat tab disembunyikan atau canvas keluar dari viewport.
- Bila WebGL tidak tersedia, canvas tidak dibuat sama sekali dan hero jatuh ke latar
  gradien CSS.
- Tanpa JavaScript seluruh konten tetap terbaca (elemen animasi tidak disembunyikan
  lewat CSS statis).

## Deploy

Situs ini sepenuhnya statis (semua route ter-prerender), jadi bisa dideploy ke Vercel,
Netlify, atau VPS mana pun.

```bash
npm run build
```

Di Vercel cukup hubungkan repository, tidak ada environment variable yang dibutuhkan.
Setelah domain `adhiteknologi.com` diarahkan, pastikan `site.url` di `site-config.ts`
sudah benar agar `sitemap.xml`, canonical URL, dan tag Open Graph ikut menyesuaikan.

## Referensi desain

Design system hasil generate ada di
[`design-system/adhi-teknologi/MASTER.md`](design-system/adhi-teknologi/MASTER.md) —
berisi palet, tipografi, efek, dan anti-pattern yang dipakai sebagai acuan.
