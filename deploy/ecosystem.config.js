/**
 * Konfigurasi PM2 untuk server produksi.
 * Disalin oleh deploy/bootstrap.sh ke dalam direktori runtime, lalu dijalankan
 * dari sana (bersebelahan dengan server.js hasil build standalone).
 *
 *   pm2 start ecosystem.config.js --env production
 *   pm2 reload adhiteknologi --update-env
 *   pm2 logs adhiteknologi
 *
 * APP_PORT dan PM2_APP dibaca dari environment supaya port di sini tidak pernah
 * berbeda dengan port yang dipakai Nginx — keduanya diisi dari sumber yang sama
 * oleh bootstrap.sh.
 */
const port = Number(process.env.APP_PORT) || 3000;
const name = process.env.PM2_APP || "adhiteknologi";

// Bila Node sistem masih lama dan aplikasi ini dijalankan dengan Node terpisah,
// PM2 harus diberi tahu binary mana yang dipakai — kalau tidak, ia akan memakai
// Node sistem dan aplikasi gagal start.
const nodeBin = process.env.NODE_BIN || "";

module.exports = {
  apps: [
    {
      name,
      script: "server.js",
      cwd: __dirname,

      // Next.js standalone berjalan single-process. Naikkan `instances` hanya bila
      // trafiknya memang menuntut; untuk company profile satu proses sudah cukup.
      instances: 1,
      exec_mode: "fork",
      ...(nodeBin ? { interpreter: nodeBin } : {}),

      env: {
        NODE_ENV: "production",
        PORT: port,
        // Hanya menerima koneksi dari localhost — Nginx yang menghadap internet.
        HOSTNAME: "127.0.0.1",
      },

      // `pm2 start --env production` mencari kunci env_production dan
      // memperingatkan bila tidak ada. Isinya sama; ini hanya menghilangkan
      // peringatan sekaligus membuat maksudnya eksplisit.
      env_production: {
        NODE_ENV: "production",
        PORT: port,
        HOSTNAME: "127.0.0.1",
      },

      max_memory_restart: "400M",
      autorestart: true,
      // Cegah restart-loop tak berujung kalau aplikasinya memang gagal start.
      max_restarts: 10,
      min_uptime: "20s",

      merge_logs: true,
      time: true,
      out_file: "/var/log/adhiteknologi/out.log",
      error_file: "/var/log/adhiteknologi/error.log",
    },
  ],
};
