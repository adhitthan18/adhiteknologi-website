import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build standalone: menghasilkan .next/standalone berisi server.js beserta
  // node_modules seperlunya saja. Yang perlu diunggah ke server jadi puluhan MB,
  // bukan ratusan, dan server tidak perlu menjalankan `npm install`.
  output: "standalone",

  // Nginx yang menambahkan header X-Powered-By/Server sendiri; tidak perlu dobel.
  poweredByHeader: false,

  // Nginx di depan sudah mengompresi; biarkan satu pihak saja yang mengerjakannya.
  compress: false,

  async redirects() {
    return [
      // Akar situs mengarah ke bahasa default. Ganti `/id` ke `/en` bila suatu saat
      // bahasa Inggris yang dijadikan default.
      { source: "/", destination: "/id", permanent: false },
    ];
  },
};

export default nextConfig;
