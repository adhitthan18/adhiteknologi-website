# Deploy ke VPS sendiri

Next.js dijalankan sebagai proses Node di balik Nginx. Build dikerjakan di mesin lokal,
server hanya menerima hasilnya — jadi VPS tidak perlu toolchain build, dan tidak ada
`npm install` yang bisa gagal di tengah rilis.

Paket rilis yang dikirim berukuran **± 4,5 MB terkompresi** (24 MB setelah diekstrak),
karena memakai `output: "standalone"` — bukan menyalin seluruh `node_modules`.

## Yang perlu ada di server (sekali saja)

```bash
# Node.js 20 atau lebih baru
node -v

# PM2 sebagai process manager
sudo npm install -g pm2

# Direktori aplikasi dan log
sudo mkdir -p /var/www/adhiteknologi /var/log/adhiteknologi
sudo chown -R $USER:$USER /var/www/adhiteknologi /var/log/adhiteknologi

# Agar PM2 hidup lagi setelah server reboot
pm2 startup   # jalankan perintah yang ditampilkannya
```

Akses SSH memakai kunci, bukan kata sandi:

```bash
ssh-keygen -t ed25519 -C "deploy adhiteknologi"
ssh-copy-id -p 22 user@ip-server
```

## Konfigurasi lokal (sekali saja)

```bash
cp deploy/deploy.env.example deploy/deploy.env
```

Isi `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PORT`, dan `DEPLOY_PATH`.
Berkas ini masuk `.gitignore` dan tidak akan ikut ter-commit.

## Deploy

```bash
./deploy/deploy.sh
```

Yang dikerjakan skrip:

1. `npm run build` di mesin lokal
2. Menyusun paket: `.next/standalone` + `.next/static` + `public/` + `ecosystem.config.js`
   — dua yang terakhir **tidak** disertakan otomatis oleh build standalone, dan itu
   penyebab paling umum situs tampil tanpa CSS setelah deploy
3. Mengirim paket lewat `scp`
4. Menukar direktori: rilis lama dipindah ke `previous`, rilis baru jadi `app`
5. `pm2 reload` (atau `pm2 start` bila belum pernah jalan)
6. Menunggu sampai `http://127.0.0.1:3000/id` merespons; kalau gagal dalam 20 detik,
   skrip berhenti dengan status error dan mencetak 30 baris log terakhir

## Nginx dan TLS (sekali saja)

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/adhiteknologi.com
sudo ln -s /etc/nginx/sites-available/adhiteknologi.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo certbot --nginx -d adhiteknologi.com -d www.adhiteknologi.com
```

Arahkan DNS lebih dulu sebelum menjalankan certbot, karena verifikasinya lewat HTTP:

| Tipe | Nama | Nilai |
|---|---|---|
| A | `@` | IP server |
| A | `www` | IP server |

Konfigurasi Nginx sudah mencakup redirect HTTP ke HTTPS, `www` ke non-`www`, gzip,
header keamanan, dan cache satu tahun untuk `/_next/static/` (termasuk font).

## Rollback

```bash
ssh user@server "cd /var/www/adhiteknologi && rm -rf app && mv previous app && pm2 reload adhiteknologi"
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
| Port 3000 sudah dipakai | Ada proses lama; `pm2 delete adhiteknologi` lalu deploy ulang |
| Perubahan tidak muncul | Cache browser pada aset lama; buka dengan hard reload |
