import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Akar situs mengarah ke bahasa default. Ganti `/id` ke `/en` bila suatu saat
      // bahasa Inggris yang dijadikan default.
      { source: "/", destination: "/id", permanent: false },
    ];
  },
};

export default nextConfig;
