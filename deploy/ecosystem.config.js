/**
 * Konfigurasi PM2 untuk server produksi.
 * Dijalankan dari dalam direktori rilis (hasil salin .next/standalone).
 *
 *   pm2 start ecosystem.config.js --env production
 *   pm2 reload adhiteknologi          # rilis berikutnya, tanpa downtime
 *   pm2 logs adhiteknologi
 *   pm2 save                          # agar hidup lagi setelah server reboot
 */
module.exports = {
  apps: [
    {
      name: "adhiteknologi",
      script: "server.js",
      cwd: __dirname,

      // Next.js standalone berjalan single-process. Naikkan `instances` hanya bila
      // trafiknya memang menuntut; untuk company profile satu proses sudah cukup.
      instances: 1,
      exec_mode: "fork",

      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // Hanya menerima koneksi dari localhost — Nginx yang menghadap internet.
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
