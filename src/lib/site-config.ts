export const site = {
  name: "Adhi Teknologi",
  legalName: "Adhi Teknologi",
  domain: "adhiteknologi.com",
  url: "https://adhiteknologi.com",
  tagline: "Software house untuk web, IoT, dan sistem kasir",
  description:
    "Adhi Teknologi membangun website, perangkat & platform IoT, serta sistem POS untuk bisnis di Indonesia. Dari perencanaan sampai maintenance, dikerjakan satu tim.",
  // TODO: ganti dengan data kontak asli sebelum go-live
  email: "halo@adhiteknologi.com",
  phone: "+62 812-0000-0000",
  whatsapp: "6281200000000",
  address: "Indonesia",
  founded: 2024,
  social: {
    instagram: "https://instagram.com/adhiteknologi",
    linkedin: "https://linkedin.com/company/adhiteknologi",
    github: "https://github.com/adhiteknologi",
  },
} as const;

export const navLinks = [
  { label: "Layanan", href: "#layanan" },
  { label: "Produk", href: "#produk" },
  { label: "Proses", href: "#proses" },
  { label: "Teknologi", href: "#teknologi" },
  { label: "FAQ", href: "#faq" },
] as const;

export type Pillar = "web" | "iot" | "pos";

export const services: {
  id: string;
  pillar: Pillar;
  title: string;
  summary: string;
  points: string[];
  deliverable: string;
}[] = [
  {
    id: "web",
    pillar: "web",
    title: "Pembuatan Website & Aplikasi Web",
    summary:
      "Company profile, landing page, e-commerce, sampai dashboard internal. Dibangun cepat dibuka, rapi di mesin pencari, dan gampang diurus sendiri.",
    points: [
      "Company profile & landing page konversi",
      "Web app / dashboard internal & CMS",
      "Toko online + integrasi payment gateway",
      "SEO teknis, Core Web Vitals, dan analytics",
    ],
    deliverable: "Next.js · React · Tailwind · Headless CMS",
  },
  {
    id: "iot",
    pillar: "iot",
    title: "Solusi & Perangkat IoT",
    summary:
      "Sensor di lapangan, gateway, sampai dashboard monitoring real-time. Kami kerjakan firmware dan platformnya sekalian, bukan cuma tampilannya.",
    points: [
      "Firmware ESP32 / STM32 & desain rangkaian",
      "Gateway MQTT, LoRa, dan protokol industri",
      "Dashboard telemetri real-time + alert",
      "Provisioning perangkat & OTA update",
    ],
    deliverable: "ESP32 · MQTT · LoRa · Time-series DB",
  },
  {
    id: "pos",
    pillar: "pos",
    title: "Sistem POS & Operasional Usaha",
    summary:
      "Kasir yang tetap jalan waktu internet putus, cetak struk ke printer thermal, dan laporan yang benar-benar dipakai pemilik usaha.",
    points: [
      "Kasir Android offline-first + sinkronisasi",
      "Cetak struk Bluetooth / thermal printer",
      "Manajemen stok, shift, dan multi-outlet",
      "Laporan penjualan & margin harian",
    ],
    deliverable: "Flutter · Android · SQLite · Cloud sync",
  },
];

export const supportServices = [
  {
    title: "Integrasi & API",
    body: "Menyambungkan sistem yang sudah ada — akuntansi, marketplace, payment, atau perangkat pihak ketiga.",
  },
  {
    title: "Maintenance & Support",
    body: "Monitoring uptime, patch keamanan, backup terjadwal, dan jalur bantuan yang jelas saat ada insiden.",
  },
  {
    title: "UI/UX & Design System",
    body: "Riset alur, wireframe, dan design system supaya produk tetap konsisten saat fitur bertambah.",
  },
];

export const products = [
  {
    name: "IoT Max Hub",
    domain: "iotmaxhub.com",
    href: "https://iotmaxhub.com",
    pillar: "iot" as Pillar,
    kicker: "Platform IoT",
    body: "Hub monitoring perangkat IoT: mengumpulkan data sensor lewat MQTT, menampilkannya real-time, dan mengirim notifikasi saat nilai keluar dari ambang batas.",
    features: ["Telemetri real-time", "Manajemen perangkat", "Rule & alert", "Riwayat data"],
    status: "Produk aktif",
  },
  {
    name: "Satu Meja",
    domain: "satumeja.com",
    href: "https://satumeja.com",
    pillar: "pos" as Pillar,
    kicker: "POS & Kasir",
    body: "Sistem kasir untuk kafe, restoran, dan retail. Transaksi tetap tercatat saat offline, struk langsung tercetak, laporan penjualan siap tiap tutup shift.",
    features: ["Mode offline", "Struk thermal", "Kelola stok", "Laporan harian"],
    status: "Produk aktif",
  },
  {
    name: "Project Website Klien",
    domain: "adhiteknologi.com",
    href: "#kontak",
    pillar: "web" as Pillar,
    kicker: "Jasa Web",
    body: "Company profile, landing page kampanye, dan aplikasi web internal yang dibangun sesuai kebutuhan tiap klien — termasuk situs yang sedang Anda buka ini.",
    features: ["Company profile", "Landing page", "Web app", "E-commerce"],
    status: "Terbuka untuk project",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Discovery",
    body: "Kami dengar dulu masalahnya, bukan langsung menawarkan fitur. Hasilnya: daftar kebutuhan, batasan, dan ukuran keberhasilan.",
  },
  {
    step: "02",
    title: "Perencanaan & Estimasi",
    body: "Ruang lingkup, timeline, dan biaya ditulis terbuka. Anda tahu apa yang dikerjakan dan apa yang tidak sebelum mulai.",
  },
  {
    step: "03",
    title: "Desain & Prototipe",
    body: "Alur dan tampilan diuji lebih dulu lewat prototipe, supaya perubahan besar terjadi di tahap desain, bukan waktu koding.",
  },
  {
    step: "04",
    title: "Pengembangan",
    body: "Dikerjakan bertahap dengan demo berkala. Setiap sprint ada yang bisa dilihat dan dicoba, tidak menunggu sampai akhir.",
  },
  {
    step: "05",
    title: "Rilis & Maintenance",
    body: "Deploy, serah terima dokumentasi, pelatihan tim Anda, lalu monitoring dan dukungan berjalan sesudahnya.",
  },
];

export const techStack = [
  {
    group: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js", "GSAP"],
  },
  {
    group: "Backend & Data",
    items: ["Node.js", "Laravel", "PostgreSQL", "MySQL", "Redis", "REST & GraphQL"],
  },
  {
    group: "IoT & Embedded",
    items: ["ESP32", "Arduino", "MQTT", "LoRaWAN", "Modbus", "InfluxDB"],
  },
  {
    group: "Mobile & POS",
    items: ["Flutter", "Android", "SQLite", "Bluetooth Printer", "Riverpod", "Offline sync"],
  },
  {
    group: "Infrastruktur",
    items: ["Docker", "Nginx", "Vercel", "VPS", "CI/CD", "Cloudflare"],
  },
];

export const stats = [
  { value: "3", suffix: " pilar", label: "Web, IoT, dan POS dikerjakan satu tim" },
  { value: "2", suffix: " produk", label: "Platform aktif: IoT Max Hub & Satu Meja" },
  { value: "100", suffix: "%", label: "Kode dan dokumentasi jadi milik klien" },
  { value: "24", suffix: " jam", label: "Waktu respons maksimal untuk permintaan baru" },
];

export const differentiators = [
  {
    title: "Satu tim untuk hardware dan software",
    body: "Project IoT sering macet karena vendor perangkat dan vendor aplikasi saling lempar tanggung jawab. Di sini keduanya dikerjakan tim yang sama.",
  },
  {
    title: "Dibangun dari pemakaian nyata",
    body: "Satu Meja dan IoT Max Hub kami bangun dan operasikan sendiri, jadi keputusan teknis datang dari pengalaman memakainya, bukan dari teori.",
  },
  {
    title: "Tanpa kunci vendor",
    body: "Source code, akun hosting, dan dokumentasi diserahkan ke Anda. Kalau suatu saat pindah tim, tidak ada yang tertinggal.",
  },
  {
    title: "Perkiraan biaya yang jujur",
    body: "Estimasi dirinci per bagian pekerjaan. Kalau ada yang berpotensi membengkak, kami sampaikan di awal, bukan di tengah jalan.",
  },
];

export const faqs = [
  {
    q: "Berapa lama pengerjaan sebuah project?",
    a: "Company profile umumnya 2–4 minggu. Aplikasi web atau POS dengan alur khusus biasanya 6–12 minggu. Project IoT bergantung pada perangkat keras dan uji lapangan, jadi estimasinya kami buat setelah discovery.",
  },
  {
    q: "Bagaimana skema biayanya?",
    a: "Untuk lingkup yang sudah jelas, kami pakai harga tetap per project. Untuk pengembangan jangka panjang tersedia skema retainer bulanan. Rinciannya selalu dikirim tertulis sebelum pekerjaan dimulai.",
  },
  {
    q: "Apakah source code diserahkan ke klien?",
    a: "Ya. Setelah pelunasan, seluruh source code, aset desain, dan akses infrastruktur menjadi milik Anda beserta dokumentasinya.",
  },
  {
    q: "Bisa melanjutkan sistem yang sudah ada?",
    a: "Bisa. Kami mulai dengan audit singkat untuk melihat kondisi kode dan infrastruktur, lalu menyampaikan apakah lebih masuk akal dilanjutkan atau ditulis ulang — beserta alasannya.",
  },
  {
    q: "Apakah menyediakan perangkat kerasnya juga?",
    a: "Untuk project IoT kami bantu memilih dan menyiapkan perangkat, termasuk purwarupa dan pengujian. Pengadaan jumlah besar bisa lewat kami atau vendor pilihan Anda.",
  },
  {
    q: "Setelah rilis, apakah ada dukungan lanjutan?",
    a: "Ada masa garansi perbaikan bug setelah rilis, dan tersedia paket maintenance bulanan untuk monitoring, pembaruan keamanan, serta penambahan fitur kecil.",
  },
];
