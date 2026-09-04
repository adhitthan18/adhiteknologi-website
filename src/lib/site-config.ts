/**
 * Data yang tidak bergantung bahasa. Seluruh teks yang perlu diterjemahkan
 * ada di `src/lib/dictionaries/{id,en}.ts`.
 */
export const site = {
  // Nama pendek untuk header dan tempat sempit lainnya.
  name: "Adhi Teknologi",
  // Nama resmi, mengikuti penulisan di brand kit (tanpa titik setelah PT).
  legalName: "PT Adhi Teknologi Indonesia",
  // Moto dari lockup logo resmi.
  motto: ["Teknologi", "Inovasi", "Integrasi", "Solusi"],
  domain: "adhiteknologi.com",
  url: "https://adhiteknologi.com",
  email: "iotadhiteknologi@gmail.com",
  phone: "+62 895-0110-2075",
  whatsapp: "6289501102075",
  address: "Indonesia",
  founded: 2024,
  social: {
    // TODO: ganti atau hapus bila akunnya belum ada
    instagram: "https://instagram.com/adhiteknologi",
    linkedin: "https://linkedin.com/company/adhiteknologi",
    github: "https://github.com/adhiteknologi",
  },
  // Aset dari brand kit, disalin ke public/brand/
  ogImage: "/brand/og-korporat.png",
} as const;

export type Pillar = "web" | "iot" | "pos";

/** Nama teknologi tidak diterjemahkan; hanya nama grupnya yang ada di kamus. */
export const serviceMeta: { id: Pillar; deliverable: string }[] = [
  { id: "web", deliverable: "Next.js · React · Tailwind · Headless CMS" },
  { id: "iot", deliverable: "ESP32 · MQTT · LoRa · Time-series DB" },
  { id: "pos", deliverable: "Flutter · Android · SQLite · Cloud sync" },
];

export const productMeta: {
  id: "iotmaxhub" | "satumeja";
  pillar: Pillar;
  domain: string;
  href: string;
}[] = [
  { id: "iotmaxhub", pillar: "iot", domain: "iotmaxhub.com", href: "https://iotmaxhub.com" },
  { id: "satumeja", pillar: "pos", domain: "satumeja.com", href: "https://satumeja.com" },
];

export type ClientProjectId =
  | "orensaGlobal"
  | "indonesiaCommodities"
  | "jualRumahTangerang"
  | "orensaId"
  | "pcbRelay";

/**
 * Pekerjaan yang sudah selesai. Nama dan deskripsinya ada di kamus bahasa;
 * di sini hanya domain dan tautannya, yang tidak diterjemahkan.
 *
 * orensaGlobal dan orensaId adalah klien yang sama — Orensa — dengan dua situs
 * untuk dua pasar yang berbeda.
 *
 * `domain` dan `href` opsional: pekerjaan perangkat keras tidak punya alamat
 * web, jadi kartunya melewatkan baris tautan sama sekali. `wide` melebarkan
 * kartu jadi dua kolom supaya baris terakhir tidak menyisakan sel kosong.
 */
export const clientProjects: {
  id: ClientProjectId;
  domain?: string;
  href?: string;
  pillar?: Pillar;
  wide?: boolean;
}[] = [
  { id: "orensaGlobal", domain: "orensaglobal.com", href: "https://orensaglobal.com" },
  {
    id: "indonesiaCommodities",
    domain: "indonesiatapiocastarchs.com",
    href: "https://indonesiatapiocastarchs.com",
  },
  { id: "jualRumahTangerang", domain: "jualrumahtangerang.com", href: "https://jualrumahtangerang.com" },
  { id: "orensaId", domain: "jualperlengkapanhotel.id", href: "https://jualperlengkapanhotel.id" },
  { id: "pcbRelay", pillar: "iot", wide: true },
];

/**
 * Bagian dari `clientProjects` yang punya alamat web, dengan tipe yang sudah
 * dipersempit sehingga `href` dan `domain` dijamin ada.
 *
 * Dipakai tempat-tempat yang isinya memang harus berupa tautan — footer,
 * misalnya. Pekerjaan perangkat keras tidak punya alamat dan tersaring di sini,
 * bukan dilewati satu per satu di tiap pemanggil.
 */
export const linkedProjects = clientProjects.filter(
  (p): p is typeof p & { domain: string; href: string } => Boolean(p.href && p.domain),
);

export const techGroups: { id: "frontend" | "backend" | "iot" | "mobile" | "infra"; items: string[] }[] = [
  { id: "frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js", "GSAP"] },
  { id: "backend", items: ["Node.js", "Laravel", "PostgreSQL", "MySQL", "Redis", "REST & GraphQL"] },
  { id: "iot", items: ["ESP32", "Arduino", "MQTT", "LoRaWAN", "Modbus", "InfluxDB"] },
  { id: "mobile", items: ["Flutter", "Android", "SQLite", "Bluetooth Printer", "Riverpod", "Offline sync"] },
  { id: "infra", items: ["Docker", "Nginx", "Vercel", "VPS", "CI/CD", "Cloudflare"] },
];

/** Foto dokumentasi pelatihan Guru Melek Digital, dipublikasikan atas izin
 *  peserta — lihat catatan `field.note` yang tampil di bawah galerinya. */
export const fieldPhotos = [
  { id: "robot", src: "/lapangan/robot-lego.webp", width: 1104, height: 736 },
  { id: "merakit", src: "/lapangan/merakit.webp", width: 1104, height: 736 },
  { id: "pendampingan", src: "/lapangan/pendampingan.webp", width: 1104, height: 736 },
] as const;

export const sectionIds = {
  services: "services",
  products: "products",
  portfolio: "portfolio",
  field: "field",
  process: "process",
  tech: "tech",
  faq: "faq",
  contact: "contact",
} as const;
