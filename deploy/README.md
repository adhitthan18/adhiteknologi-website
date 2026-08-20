# Deploy ke VPS sendiri

Next.js dijalankan sebagai proses Node di balik Nginx. Build dikerjakan di mesin lokal,
server hanya menerima hasilnya — jadi VPS tidak perlu toolchain build, dan tidak ada
`npm install` yang bisa gagal di tengah rilis.

Paket rilis yang dikirim berukuran **± 4,5 MB terkompresi** (24 MB setelah diekstrak),
karena memakai `output: "standalone"` — bukan menyalin seluruh `node_modules`.

Seluruh deploy berjalan dalam **satu koneksi SSH**: tarball dialirkan lewat stdin,
diekstrak, ditukar, lalu PM2 dimuat ulang. Kalau autentikasinya kata sandi, yang
ditanyakan hanya sekali.

## Konfigurasi lokal (sekali saja)

```bash
cp deploy/deploy.env.example deploy/deploy.env
```

Isi sesuai server Anda. Untuk akses lewat Cloudflare Access:

```bash
DEPLOY_HOST=ssh.example.com
DEPLOY_USER=root
DEPLOY_PATH=/var/www/adhiteknologi
APP_PORT=3000
CLOUDFLARED=/c/Users/user/Downloads/Project/iotmaxhub-deploy/.tools/cloudflared.exe
SSH_AUTH_MODE=password
```

> Jangan menaruh kata sandi di berkas ini. Skrip tidak membacanya — `ssh` yang
> menanyakannya langsung ke terminal Anda.

`deploy/deploy.env` sudah masuk `.gitignore`.

Path `CLOUDFLARED` ditulis gaya Git Bash (`/c/Users/...`). Kalau menjalankan dari
PowerShell, pakai `C:/Users/...`.

## Yang perlu ada di server (sekali saja)

```bash
node -v                        # Node.js 20 atau lebih baru
sudo npm install -g pm2

sudo mkdir -p /var/www/adhiteknologi /var/log/adhiteknologi

pm2 startup                    # jalankan perintah yang ditampilkannya,
                               # agar PM2 hidup lagi setelah server reboot
```

Kalau server ini sudah menjalankan situs lain, pastikan port `APP_PORT` belum dipakai:

```bash
ss -ltnp | grep :3000
```

Bila sudah terpakai, ganti `APP_PORT` di `deploy.env`, lalu sesuaikan `PORT` di
`ecosystem.config.js` dan `upstream` di `nginx.conf`.

## Deploy

```bash
./deploy/deploy.sh
```

Yang dikerjakan skrip:

1. `npm run build` di mesin lokal
2. Menyusun paket: `.next/standalone` + `.next/static` + `public/` + `ecosystem.config.js`
   — dua yang di tengah **tidak** disertakan otomatis oleh build standalone, dan itu
   penyebab paling umum situs tampil tanpa CSS setelah deploy
3. Mengalirkan paket ke server lewat satu koneksi SSH (tanpa berkas perantara)
4. Menukar direktori: rilis lama dipindah ke `previous`, rilis baru jadi `app`
5. `pm2 reload` (atau `pm2 start` bila belum pernah jalan)
6. Menunggu sampai `http://127.0.0.1:$APP_PORT/id` merespons; kalau gagal dalam
   20 detik, skrip berhenti dengan status error, mencetak 30 baris log terakhir,
   dan menampilkan perintah rollback

## Nginx dan TLS (sekali saja)

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/adhiteknologi.com
sudo ln -s /etc/nginx/sites-available/adhiteknologi.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Sertifikatnya pilih salah satu — keduanya sudah disiapkan di `nginx.conf`:

**A. Domain diproksikan Cloudflare (awan oranye)** — paling praktis bila domain
sudah di Cloudflare:

1. Dashboard Cloudflare → SSL/TLS → Origin Server → Create Certificate
2. Simpan di server sebagai `/etc/ssl/cloudflare/adhiteknologi.pem` dan `.key`
3. Di `nginx.conf`, aktifkan dua baris `ssl_certificate` versi Cloudflare
4. Set mode SSL/TLS ke **Full (strict)**

Certbot tidak dipakai di skenario ini, dan sertifikat originnya berlaku 15 tahun.

**B. Domain langsung ke server (awan abu-abu)**:

```bash
sudo certbot --nginx -d adhiteknologi.com -d www.adhiteknologi.com
```

Arahkan DNS lebih dulu, karena verifikasinya lewat HTTP.

| Tipe | Nama | Nilai |
|---|---|---|
| A | `@` | IP server |
| A | `www` | IP server |

Konfigurasi Nginx sudah mencakup redirect HTTP→HTTPS, `www`→non-`www`, gzip,
header keamanan, cache satu tahun untuk `/_next/static/` (termasuk font), dan
meneruskan `CF-Connecting-IP` supaya IP asli pengunjung tidak hilang di balik Cloudflare.

## Rollback

```bash
cd /var/www/adhiteknologi && rm -rf app && mv previous app && pm2 reload adhiteknologi
```

## Perintah harian

```bash
pm2 status
pm2 logs adhiteknologi
pm2 monit
```

## Kalau ada yang tidak beres

| Gejala | Penyebab yang paling sering |
|---|---|
| Situs tampil tanpa CSS/font | `.next/static` tidak ikut tersalin ke direktori rilis |
| 502 Bad Gateway | Proses PM2 mati — cek `pm2 logs adhiteknologi` |
| Port sudah dipakai | Situs lain di mesin yang sama; ganti `APP_PORT` |
| `cloudflared` diminta login | Jalankan `cloudflared access login <hostname>` sekali |
| Error 526 dari Cloudflare | Mode SSL "Full (strict)" tapi sertifikat origin belum terpasang |
| Perubahan tidak muncul | Cache Cloudflare — Purge Everything, atau cache browser |
