/**
 * Feed projek untuk automation LinkedIn (repo `linkedin-project-autopost`).
 *
 * Watcher di sana memantau URL ini dan membuatkan draft caption setiap kali
 * ada `id` yang belum pernah dilihat. Karena itu satu aturan mengikat file ini:
 *
 *   JANGAN PERNAH mengubah `id` projek yang sudah pernah tayang.
 *
 * `id` adalah satu-satunya penanda "sudah pernah diposting atau belum".
 * Menggantinya membuat watcher menganggap projek lama sebagai projek baru dan
 * membuat draft duplikat. Menambah entri baru aman; mengganti nama entri lama
 * tidak. Sumber `id`-nya sengaja diambil dari konstanta yang sudah dipakai
 * halaman portofolio, supaya tidak ada daftar kedua yang bisa ikut basi.
 */

import { clientProjects, productMeta, site } from "@/lib/site-config";
import { id as dict } from "@/lib/dictionaries/id";

// Isinya diturunkan dari konstanta build-time, tidak dari request. Menandainya
// force-static membuat Next memprerender respons ini saat build, jadi tidak ada
// kerja per-request sama sekali.
export const dynamic = "force-static";

type FeedProject = {
  id: string;
  title: string;
  summary: string;
  url: string;
  tags: string[];
  kind: "produk" | "klien" | "internal";
};

/**
 * Pekerjaan yang tidak tampil di halaman portofolio: firmware, tooling, dan
 * situs perusahaan sendiri. Didaftar manual di sini — bukan duplikasi, sebab
 * projek-projek ini memang tidak punya entri di site-config.ts. Menaruhnya di
 * sana justru akan memunculkannya di section "Situs yang sudah kami kerjakan",
 * padahal isinya bukan situs klien.
 */
const internalProjects: FeedProject[] = [
  {
    id: "adhiteknologiWeb",
    title: "adhiteknologi.com",
    summary:
      "Situs perusahaan kami sendiri: dua bahasa, dirender di server, dan dideploy sebagai bundel standalone di VPS sendiri di balik Nginx — bukan menumpang platform pihak ketiga.",
    url: "https://adhiteknologi.com",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Dwibahasa", "VPS + Nginx"],
    kind: "internal",
  },
  {
    id: "relay6MejaEsp32",
    title: "Kontrol Relay 6 Meja",
    summary:
      "Firmware ESP32 untuk menyalakan dan mematikan enam meja biliar sekaligus, lengkap dengan timer per meja. Kontrol lokal lewat Ethernet tetap jalan saat internet mati, sementara pengawasan jarak jauh berjalan lewat WiFi ke IoT Max Hub. Pendaftaran perangkat cukup dengan memindai QR yang ditampilkan perangkat itu sendiri.",
    url: "https://iotmaxhub.com",
    tags: ["ESP32", "W5500 Ethernet", "Relay", "Provisioning QR", "Telemetri"],
    kind: "internal",
  },
  {
    id: "linkedinAutopost",
    title: "LinkedIn Project Autopost",
    summary:
      "Automation yang memantau feed projek di situs ini, menyusun draft caption LinkedIn, lalu memposting setelah draftnya disetujui manusia. Memakai Posts API resmi LinkedIn, bukan bot yang menyamar sebagai aktivitas manusia.",
    url: "https://adhiteknologi.com",
    tags: ["Node.js", "OAuth 2.0", "LinkedIn API", "GitHub Actions"],
    kind: "internal",
  },
  {
    id: "jejakOsint",
    title: "jejak — OSINT Footprint Toolkit",
    summary:
      "CLI modular untuk audit jejak digital: memeriksa paparan data akun sendiri, meninjau domain yang kita kelola, dan membaca metadata berkas sebelum dipublikasikan. Dibatasi untuk target milik sendiri atau yang sudah memberi izin.",
    url: "https://adhiteknologi.com",
    tags: ["Python", "CLI", "Keamanan", "Audit jejak digital"],
    kind: "internal",
  },
];

export function GET() {
  // Produk sendiri lebih dulu — ini yang paling layak diumumkan di LinkedIn.
  const products: FeedProject[] = productMeta.map((meta) => {
    const copy = dict.products.items[meta.id];
    return {
      id: meta.id,
      title: copy.name,
      summary: copy.body,
      url: meta.href,
      tags: [...copy.features],
      kind: "produk",
    };
  });

  const clients: FeedProject[] = clientProjects.map((meta) => {
    const copy = dict.portfolio.items[meta.id];
    return {
      id: meta.id,
      title: copy.name,
      summary: copy.body,
      url: meta.href,
      tags: [...copy.tags],
      kind: "klien",
    };
  });

  // Teks sengaja diambil dari kamus Indonesia saja: feed ini bukan halaman
  // publik yang perlu dwibahasa, melainkan masukan untuk caption berbahasa
  // Indonesia. Kalau nanti perlu versi Inggris, buat route terpisah agar `id`
  // projek tidak perlu diutak-atik.
  return Response.json(
    {
      source: site.url,
      generatedFrom: "src/lib/site-config.ts + src/lib/dictionaries/id.ts",
      projects: [...products, ...clients, ...internalProjects],
    },
    {
      headers: {
        // Feed dibaca mesin, bukan browser. Cache pendek supaya projek baru
        // terlihat oleh watcher di hari yang sama tanpa menunggu CDN kedaluwarsa.
        "cache-control": "public, max-age=300, stale-while-revalidate=3600",
      },
    },
  );
}
