export const id = {
  htmlLang: "id",
  localeName: "Bahasa Indonesia",
  ogLocale: "id_ID",

  meta: {
    tagline: "Software house untuk web, IoT, dan sistem kasir",
    description:
      "PT Adhi Teknologi Indonesia membangun website, perangkat & platform IoT, serta sistem POS untuk bisnis di Indonesia. Dari perencanaan sampai maintenance, dikerjakan satu tim.",
    keywords: [
      "jasa pembuatan website",
      "software house Indonesia",
      "jasa IoT",
      "sistem POS",
      "aplikasi kasir",
      "web developer Indonesia",
    ],
  },

  nav: {
    links: [
      { label: "Layanan", href: "#services" },
      { label: "Produk", href: "#products" },
      { label: "Portofolio", href: "#portfolio" },
      { label: "Proses", href: "#process" },
      { label: "Teknologi", href: "#tech" },
      { label: "FAQ", href: "#faq" },
    ],
    contact: "Kontak",
    cta: "Konsultasi gratis",
    home: "Adhi Teknologi — beranda",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    mainNav: "Navigasi utama",
    mobileNav: "Navigasi mobile",
    skipToContent: "Lompat ke konten utama",
  },

  theme: {
    neutral: "Ganti tema terang atau gelap",
    toLight: "Aktifkan tema terang",
    toDark: "Aktifkan tema gelap",
  },

  language: {
    label: "Ganti bahasa",
    switchTo: "Lihat dalam Bahasa Inggris",
  },

  cursor: { hello: "Sapa kami" },

  hero: {
    badge: "Software house · Menerima project baru",
    titleStart: "Website, ",
    titleHighlight: "IoT",
    titleEnd: ", dan sistem kasir — dibangun oleh satu tim.",
    subtitle:
      "PT Adhi Teknologi Indonesia mengerjakan pembuatan website, perangkat serta platform IoT, dan sistem POS untuk usaha di Indonesia. Dari perencanaan, pengembangan, sampai perawatan setelah rilis.",
    ctaPrimary: "Mulai project Anda",
    ctaSecondary: "Lihat produk kami",
    photoAlt: "Pendiri Adhi Teknologi membawakan sesi pelatihan robotika",
    pillars: { web: "Website & Web App", iot: "Solusi IoT", pos: "Sistem POS" },
  },

  stats: [
    { value: "3", suffix: " pilar", label: "Web, IoT, dan POS dikerjakan satu tim" },
    { value: "2", suffix: " produk", label: "Platform aktif: IoT Max Hub & Satu Meja" },
    { value: "100", suffix: "%", label: "Kode dan dokumentasi jadi milik klien" },
    { value: "24", suffix: " jam", label: "Waktu respons maksimal untuk permintaan baru" },
  ],

  services: {
    eyebrow: "Layanan",
    title: "Tiga pilar pekerjaan kami",
    description:
      "Tiap pilar punya kebutuhan teknis berbeda, tapi ditangani proses dan standar kualitas yang sama.",
    items: {
      web: {
        title: "Pembuatan Website & Aplikasi Web",
        summary:
          "Company profile, landing page, e-commerce, sampai dashboard internal. Dibangun cepat dibuka, rapi di mesin pencari, dan gampang diurus sendiri.",
        points: [
          "Company profile & landing page konversi",
          "Web app / dashboard internal & CMS",
          "Toko online + integrasi payment gateway",
          "SEO teknis, Core Web Vitals, dan analytics",
        ],
      },
      iot: {
        title: "Solusi & Perangkat IoT",
        summary:
          "Sensor di lapangan, gateway, sampai dashboard monitoring real-time. Kami kerjakan firmware dan platformnya sekalian, bukan cuma tampilannya.",
        points: [
          "Firmware ESP32 / STM32 & desain rangkaian",
          "Gateway MQTT, LoRa, dan protokol industri",
          "Dashboard telemetri real-time + alert",
          "Provisioning perangkat & OTA update",
        ],
      },
      pos: {
        title: "Sistem POS & Operasional Usaha",
        summary:
          "Kasir yang tetap jalan waktu internet putus, cetak struk ke printer thermal, dan laporan yang benar-benar dipakai pemilik usaha.",
        points: [
          "Kasir Android offline-first + sinkronisasi",
          "Cetak struk Bluetooth / thermal printer",
          "Manajemen stok, shift, dan multi-outlet",
          "Laporan penjualan & margin harian",
        ],
      },
    },
    support: [
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
      {
        title: "Pelatihan & Workshop",
        body: "Pelatihan robotika, IoT, dan literasi digital untuk guru maupun tim internal — memakai perangkat dan materi yang kami siapkan sendiri.",
      },
    ],
  },

  products: {
    eyebrow: "Produk & Portofolio",
    title: "Yang sudah kami bangun dan jalankan",
    description:
      "Dua platform ini kami kembangkan sendiri, jadi teknologi yang kami tawarkan ke klien sudah kami pakai lebih dulu.",
    newTab: "(buka di tab baru)",
    items: {
      iotmaxhub: {
        name: "IoT Max Hub",
        kicker: "Platform IoT",
        status: "Produk aktif",
        body: "Hub monitoring perangkat IoT: mengumpulkan data sensor lewat MQTT, menampilkannya real-time, dan mengirim notifikasi saat nilai keluar dari ambang batas.",
        features: ["Telemetri real-time", "Manajemen perangkat", "Rule & alert", "Riwayat data"],
      },
      satumeja: {
        name: "Satu Meja",
        kicker: "POS & Kasir",
        status: "Produk aktif",
        body: "Sistem kasir untuk kafe, restoran, dan retail. Transaksi tetap tercatat saat offline, struk langsung tercetak, laporan penjualan siap tiap tutup shift.",
        features: ["Mode offline", "Struk thermal", "Kelola stok", "Laporan harian"],
      },
    },
  },

  portfolio: {
    eyebrow: "Portofolio",
    title: "Situs yang sudah kami kerjakan",
    description:
      "Empat situs klien yang sudah berjalan. Dua di antaranya milik perusahaan yang sama, dibuat terpisah karena pasarnya berbeda.",
    newTab: "(buka di tab baru)",
    items: {
      orensaGlobal: {
        name: "Orensa Global",
        sector: "Perhotelan · Ekspor",
        body: "Situs berbahasa Inggris untuk pemasok tekstil perhotelan — handuk, seprai, jubah, linen meja, dan amenitas — yang menyasar hotel, resort, dan spa di luar negeri.",
        tags: ["Company profile", "Berbahasa Inggris", "Permintaan penawaran"],
      },
      indonesiaCommodities: {
        name: "Indonesia Commodities",
        sector: "Komoditas · B2B",
        body: "Katalog B2B untuk distributor komoditas: tepung tapioka, dextrin, dan bubble starch. Menghubungkan pembeli dengan tiga produsen mitra di Indonesia.",
        tags: ["Katalog produk", "B2B", "Halaman produsen"],
      },
      jualRumahTangerang: {
        name: "Jual Rumah Tangerang",
        sector: "Properti",
        body: "Situs agen properti untuk wilayah Tangerang Raya, dengan listing rumah, apartemen, ruko, dan tanah yang bisa dicari per kawasan dan tipe.",
        tags: ["Listing properti", "Pencarian & filter", "Artikel panduan"],
      },
      orensaId: {
        name: "Orensa Indonesia",
        sector: "Perhotelan · Domestik",
        body: "Situs Orensa untuk pasar dalam negeri: katalog perlengkapan hotel dalam enam kategori, unduhan katalog PDF, dan konsultasi langsung lewat WhatsApp.",
        tags: ["Katalog digital", "Unduh PDF", "Konsultasi WhatsApp"],
      },
    },
    note: "Orensa Global dan Orensa Indonesia adalah klien yang sama, dengan dua situs untuk dua pasar.",
    cta: "Ingin situs seperti ini?",
  },

  field: {
    eyebrow: "Di lapangan",
    title: "Kami mengajarkan apa yang kami bangun",
    description:
      "Selain mengerjakan proyek klien, kami melatih guru dan tim internal perusahaan memakai perangkat yang sama seperti yang kami pakai sehari-hari — kit robotika, mikrokontroler, dan sistem yang kami kembangkan sendiri.",
    photos: {
      robot: "Ruang pelatihan penuh peserta, dengan robot LEGO rakitan mereka di atas meja",
      merakit: "Pengajar mendampingi seorang peserta menjalankan robotnya di laptop",
      pendampingan: "Pendampingan satu per satu di depan laptop peserta",
    },
    note: "Dokumentasi pelatihan Guru Melek Digital, dipublikasikan atas izin peserta.",
  },

  process: {
    eyebrow: "Cara kerja",
    title: "Lima tahap, tanpa kejutan di tengah jalan",
    description:
      "Setiap tahap punya keluaran yang bisa Anda lihat dan setujui sebelum lanjut ke tahap berikutnya.",
    steps: [
      {
        title: "Discovery",
        body: "Kami dengar dulu masalahnya, bukan langsung menawarkan fitur. Hasilnya: daftar kebutuhan, batasan, dan ukuran keberhasilan.",
      },
      {
        title: "Perencanaan & Estimasi",
        body: "Ruang lingkup, timeline, dan biaya ditulis terbuka. Anda tahu apa yang dikerjakan dan apa yang tidak sebelum mulai.",
      },
      {
        title: "Desain & Prototipe",
        body: "Alur dan tampilan diuji lebih dulu lewat prototipe, supaya perubahan besar terjadi di tahap desain, bukan waktu koding.",
      },
      {
        title: "Pengembangan",
        body: "Dikerjakan bertahap dengan demo berkala. Setiap sprint ada yang bisa dilihat dan dicoba, tidak menunggu sampai akhir.",
      },
      {
        title: "Rilis & Maintenance",
        body: "Deploy, serah terima dokumentasi, pelatihan tim Anda, lalu monitoring dan dukungan berjalan sesudahnya.",
      },
    ],
  },

  why: {
    eyebrow: "Kenapa Adhi Teknologi",
    title: "Alasan klien bertahan setelah project pertama",
    description:
      "Bukan karena harga paling murah, tapi karena tahu persis apa yang dikerjakan dan siapa yang bertanggung jawab.",
    items: [
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
    ],
  },

  tech: {
    eyebrow: "Teknologi",
    title: "Perkakas yang kami pakai sehari-hari",
    description:
      "Dipilih karena stabil dan mudah dirawat jangka panjang — bukan karena sedang ramai dibicarakan.",
    groups: {
      frontend: "Frontend",
      backend: "Backend & Data",
      iot: "IoT & Embedded",
      mobile: "Mobile & POS",
      infra: "Infrastruktur",
    },
  },

  faq: {
    eyebrow: "FAQ",
    title: "Pertanyaan yang paling sering masuk",
    description:
      "Belum terjawab di sini? Kirim pertanyaannya lewat form di bawah — biasanya dibalas di hari yang sama.",
    items: [
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
    ],
  },

  contact: {
    eyebrow: "Mulai",
    title: "Ceritakan kebutuhan Anda, kami balas dengan langkah konkret",
    description:
      "Tidak perlu dokumen kebutuhan yang rapi. Cukup jelaskan masalah yang ingin diselesaikan, nanti kami bantu susun ruang lingkup dan estimasinya.",
    whatsappNewTab: "(buka WhatsApp di tab baru)",
    labels: {
      nama: "Nama / perusahaan",
      kontak: "Email atau nomor WhatsApp",
      kebutuhan: "Kebutuhan",
      pesan: "Ceritakan singkat kebutuhannya",
    },
    placeholders: {
      nama: "Contoh: Kopi Senja / Budi Santoso",
      kontak: "nama@email.com atau 08xxxxxxxxxx",
      pesan: "Misalnya: butuh sistem kasir untuk 2 outlet yang tetap jalan saat internet mati.",
    },
    options: [
      "Website / Web App",
      "Solusi IoT",
      "Sistem POS / Kasir",
      "Maintenance sistem berjalan",
      "Belum yakin, ingin diskusi dulu",
    ],
    errors: {
      nama: "Isi nama atau nama perusahaan Anda.",
      kontak: "Isi email atau nomor WhatsApp yang bisa kami hubungi.",
      pesan: "Tulis minimal satu kalimat tentang kebutuhan Anda.",
    },
    summaryOne: "Ada 1 isian yang perlu diperbaiki",
    summaryMany: "Ada {n} isian yang perlu diperbaiki",
    hint: "Sebutkan target waktu dan perkiraan anggaran bila sudah ada — mempercepat estimasi.",
    submitWhatsapp: "Kirim lewat WhatsApp",
    submitEmail: "Kirim lewat email",
    privacy:
      "Isian di atas hanya disusun menjadi pesan di perangkat Anda — tidak dikirim atau disimpan di server situs ini.",
    messageIntro: "Halo PT Adhi Teknologi Indonesia, saya ingin konsultasi.",
    messageName: "Nama/Perusahaan",
    messageContact: "Kontak",
    messageNeed: "Kebutuhan",
    emailSubject: "Permintaan project",
  },

  footer: {
    columns: { services: "Layanan", products: "Produk", company: "Perusahaan" },
    maintenance: "Maintenance & Support",
    rights: "Seluruh hak cipta dilindungi.",
    social: "(buka di tab baru)",
  },
};
