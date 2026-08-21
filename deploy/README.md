# Deploy adhiteknologi.com

Mengikuti pola yang sama dengan project lain di server ini: kirim tarball source ke
`/opt/src`, ekstrak, lalu jalankan `bootstrap.sh` dan `verify.sh`.

Build dikerjakan **di server**, bukan di mesin lokal. Runtime-nya memakai
`output: "standalone"`, jadi yang benar-benar berjalan hanya ± 24 MB — bukan seluruh
`node_modules`.

```
mesin lokal                 server
───────────                 ──────
pack.sh  ──► adhiteknologi.tar.gz ──scp──► /opt/src/
                                            └─ tar -xzf
                                               └─ bootstrap.sh  (build → PM2 → Nginx)
                                                  └─ verify.sh  (23 pemeriksaan)
```

---

## 1. Kemas di mesin lokal

```bash
./deploy/pack.sh
```

Menghasilkan `adhiteknologi.tar.gz` dari commit terakhir, dengan folder teratas
`adhiteknologi/`. `node_modules`, `.next`, dan `.git` tidak ikut. Skrip menolak
melanjutkan bila ada berkas wajib yang hilang, dan memperingatkan bila ada perubahan
yang belum di-commit.

## 2. Upload dari PowerShell

```powershell
cd C:\src\adhiteknologi

scp -o PreferredAuthentications=password -o PubkeyAuthentication=no `
  -o "ProxyCommand=cloudflared access ssh --hostname %h" `
  adhiteknologi.tar.gz root@ssh.example.com:/opt/src/

ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no `
  -o "ProxyCommand=cloudflared access ssh --hostname %h" `
  root@ssh.example.com
```

## 3. Jalankan di server

```bash
set -euo pipefail

cd /opt/src
tar -tzf adhiteknologi.tar.gz >/dev/null

if [[ -d adhiteknologi ]]; then
  mv adhiteknologi "adhiteknologi.before-$(date +%Y%m%d-%H%M%S)"
fi

tar -xzf adhiteknologi.tar.gz --no-same-owner
chmod +x adhiteknologi/deploy/*.sh

cd /opt/src/adhiteknologi
./deploy/bootstrap.sh
./deploy/verify.sh
```

### Kalau Node di server masih di bawah 20

Next.js 16 memerlukan Node 20+. Node 18 juga sudah habis masa dukungannya sejak
April 2025. `bootstrap.sh` memeriksanya lebih dulu dan berhenti dengan pesan jelas.

**Pilihan 1 — upgrade Node sistem ke 22 LTS.** Paling sederhana, tapi ikut
mempengaruhi aplikasi lain di server yang sama.

```bash
pm2 list                    # catat apa saja yang berjalan sebelum mengubah apa pun
node -v

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
node -v                     # harus v22.x

npm install -g pm2
pm2 update                  # daemon PM2 ikut memakai Node baru
pm2 list                    # pastikan aplikasi lain kembali online
```

**Pilihan 2 — pasang Node 22 terpisah, Node sistem dibiarkan.** Lebih aman bila
aplikasi lain belum diuji di Node 22.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22

NODE_BIN="$(nvm which 22)" APP_PORT=3020 ./deploy/bootstrap.sh
NODE_BIN="$(nvm which 22)" APP_PORT=3020 ./deploy/verify.sh
```

`NODE_BIN` menaruh direktori Node tersebut di depan `PATH` (sehingga `npm ci` dan
`npm run build` memakai versi yang sama) dan diteruskan ke PM2 sebagai `interpreter`,
supaya aplikasi benar-benar dijalankan dengan Node 22 — bukan Node sistem.

> Bila proses PM2 sudah pernah dibuat tanpa `NODE_BIN`, `pm2 reload` tidak mengganti
> interpreter. Hapus dulu prosesnya, lalu bootstrap ulang:
> `pm2 delete adhiteknologi`

### Kalau disk penuh

Tiap deploy menyisakan `adhiteknologi.before-*` di `/opt/src`, dan masing-masing
menyimpan `node_modules` (± 400 MB) serta `.next`. Setelah beberapa kali deploy,
ruangnya habis dan `npm ci` berhenti dengan `ENOSPC`.

`bootstrap.sh` memeriksanya lebih dulu dan menolak jalan bila tersisa di bawah 1,5 GB,
lengkap dengan daftar pemakai ruang terbesar.

Membersihkan tanpa menghilangkan source rilis lama:

```bash
rm -rf /opt/src/adhiteknologi.before-*/node_modules /opt/src/adhiteknologi.before-*/.next
npm cache clean --force
df -h /
```

Menyisakan dua arsip terbaru saja:

```bash
ls -dt /opt/src/adhiteknologi.before-* | tail -n +3 | xargs rm -rf
```

### Kalau port 3000 sudah dipakai

Server ini juga menjalankan situs lain. `bootstrap.sh` memeriksanya lebih dulu dan
berhenti dengan pesan jelas kalau bentrok. Jalankan ulang dengan port lain:

```bash
APP_PORT=3020 ./deploy/bootstrap.sh
APP_PORT=3020 ./deploy/verify.sh
```

Port itu dipakai serentak oleh PM2 **dan** oleh konfigurasi Nginx yang dirender dari
`nginx.conf.template`, jadi keduanya tidak mungkin berbeda.

---

## Apa yang dikerjakan `bootstrap.sh`

1. **Prasyarat** — Node ≥ 20, npm, curl; memasang PM2 bila belum ada. Memperingatkan
   bila RAM tersedia < 900 MB tanpa swap, karena build Next.js bisa mati kena OOM.
2. **Cek port** — berhenti bila `APP_PORT` dipakai proses lain.
3. **`npm ci`** lalu **`npm run build`**.
4. **Menyusun runtime** di `/opt/adhiteknologi/app`: `.next/standalone` +
   `.next/static` + `public/` + `ecosystem.config.js`. Dua yang di tengah tidak
   disertakan otomatis oleh build standalone — kalau terlewat, situs terbuka tapi
   tampil tanpa CSS dan font.
5. **Tukar direktori** — rilis lama jadi `previous`, rilis baru jadi `app`.
6. **PM2** — `reload` bila sudah berjalan, `start` bila belum, lalu `pm2 save`.
7. **Nginx** — merender template ke `/etc/nginx/sites-available/adhiteknologi.com`,
   membuat symlink, `nginx -t`, lalu reload. Konfigurasi yang sudah ada **tidak**
   ditimpa kecuali `FORCE_NGINX=1`.

Aman dijalankan berulang kali.

### Pengaturan lewat environment

| Variabel | Default | Keterangan |
|---|---|---|
| `NODE_BIN` | — | Path ke binary Node tertentu, bila Node sistem masih lama |
| `APP_PORT` | `3000` | Port aplikasi di localhost |
| `APP_DIR` | `/opt/adhiteknologi` | Direktori runtime (terpisah dari `/opt/src`) |
| `PM2_APP` | `adhiteknologi` | Nama proses PM2 |
| `SERVER_NAME` | `adhiteknologi.com` | Domain untuk konfigurasi Nginx |
| `TLS_MODE` | `none` | `none` (HTTP saja), `origin`, atau `letsencrypt` |
| `SETUP_NGINX` | `1` | `0` untuk melewati bagian Nginx |
| `FORCE_NGINX` | `0` | `1` untuk menimpa konfigurasi Nginx yang ada |

## Apa yang diperiksa `verify.sh`

- Proses PM2 `online`, jumlah restart
- `/opt/adhiteknologi/app/.next/static` benar-benar ada
- `/` → 307, `/id` → 200, `/en` → 200, `/fr` → 404, `sitemap.xml`, `robots.txt`, `icon.svg`
- `<html lang="id">` dan `<html lang="en">` sesuai halamannya
- Email dan tautan WhatsApp muncul di HTML
- Berkas CSS dan font `.woff2` ber-hash benar-benar termuat 200
- `nginx -t` valid, site aktif, dan menunjuk ke port yang benar
- `https://adhiteknologi.com/id` dari luar

Keluar dengan status 1 bila ada yang gagal, disertai perintah rollback.
Lewati pengecekan publik dengan `PUBLIC_CHECK=0` bila DNS belum diarahkan.

---

## TLS

`bootstrap.sh` punya tiga mode lewat `TLS_MODE`, default **`none`**.

### `TLS_MODE=none` (default)

Origin melayani HTTP di port 80 saja, TLS diterminasi di depan oleh Cloudflare.
Tidak ada sertifikat yang perlu diurus di server. Ini pola yang dipakai vhost lain
di server ini, dan pasangannya di Cloudflare adalah mode SSL/TLS **Flexible**.

Template: `nginx-http.conf.template`.

### `TLS_MODE=origin`

Trafik Cloudflare→origin ikut terenkripsi memakai Cloudflare Origin Certificate.

1. Dashboard Cloudflare → SSL/TLS → Origin Server → Create Certificate
2. Simpan di server sebagai `/etc/ssl/cloudflare/adhiteknologi.pem` dan `.key`
   (`chmod 600` untuk kuncinya)
3. Di konfigurasi yang dirender, aktifkan dua baris `ssl_certificate` versi
   Cloudflare dan nonaktifkan yang Let's Encrypt
4. Set mode SSL/TLS ke **Full (strict)**

Sertifikat origin berlaku 15 tahun, tidak perlu perpanjangan berkala.

### `TLS_MODE=letsencrypt`

Sertifikat diterbitkan di server ini:

```bash
certbot --nginx -d adhiteknologi.com -d www.adhiteknologi.com
```

Arahkan DNS lebih dulu, karena verifikasinya lewat HTTP.

> Pada pemasangan pertama dengan `origin` atau `letsencrypt`, `nginx -t` di dalam
> `bootstrap.sh` akan gagal karena sertifikatnya memang belum ada. Itu dilaporkan
> sebagai catatan, bukan error — terbitkan sertifikatnya, lalu
> `nginx -t && systemctl reload nginx`.

### Kompatibilitas versi Nginx

Template TLS ditulis dengan sintaks Nginx 1.25.1+ (`listen 443 ssl;` + `http2 on;`).
Bila Nginx di server lebih lama — Ubuntu 24.04 membawa 1.24 — `bootstrap.sh`
menurunkannya otomatis ke `listen 443 ssl http2;`. Tanpa itu, `nginx -t` gagal
dengan `unknown directive "http2"` dan **seluruh** konfigurasi Nginx tidak dimuat,
sehingga domain jatuh ke vhost lain yang kebetulan berada di urutan pertama.

## Kalau domain menampilkan situs lain

Nginx melayani server block pertama yang cocok. Bila tidak ada `server_name` yang
cocok — atau konfigurasi kita gagal dimuat — permintaan jatuh ke vhost lain.

```bash
nginx -t                                   # gagal? konfigurasi kita tidak aktif
ls -l /etc/nginx/sites-enabled/            # adakah vhost lain mengklaim domain ini?
nginx -T | grep -n "server_name"           # siapa saja yang terdaftar
```

Bila ada vhost lama yang juga mengklaim domain ini, keluarkan domainnya dari
`server_name` vhost tersebut, jangan menonaktifkan seluruh berkasnya — subdomain
lain di dalamnya mungkin masih dipakai.

## Rollback

```bash
rm -rf /opt/adhiteknologi/app
mv /opt/adhiteknologi/previous /opt/adhiteknologi/app
pm2 reload adhiteknologi
```

Source rilis sebelumnya juga masih tersimpan di `/opt/src/adhiteknologi.before-*`.

## Perintah harian

```bash
pm2 status
pm2 logs adhiteknologi --lines 40
pm2 monit
```

## Kalau ada yang tidak beres

| Gejala | Penyebab yang paling sering |
|---|---|
| Situs tampil tanpa CSS/font | `.next/static` tidak ikut tersalin — `verify.sh` menangkap ini |
| 502 Bad Gateway | Proses PM2 mati, atau port di Nginx beda dengan port aplikasi |
| Build terhenti tanpa pesan | Kehabisan memori; tambahkan swap lalu ulangi |
| Node 18 terdeteksi | Lihat bagian "Kalau Node di server masih di bawah 20" |
| `cloudflared` minta login | `cloudflared access login ssh.example.com` sekali saja |
| Cloudflare error 526 | Mode SSL "Full (strict)" tapi sertifikat origin belum terpasang |
| Perubahan tidak muncul | Cache Cloudflare — Purge Everything |
