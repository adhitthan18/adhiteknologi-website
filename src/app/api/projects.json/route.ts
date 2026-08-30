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
  kind: "produk" | "klien";
};

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
      projects: [...products, ...clients],
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
