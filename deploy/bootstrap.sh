#!/usr/bin/env bash
#
# Dijalankan di server, dari dalam /opt/src/adhiteknologi.
#
#   cd /opt/src/adhiteknologi
#   ./deploy/bootstrap.sh
#
# Aman dijalankan berulang kali (idempoten): rilis sebelumnya disimpan sebagai
# 'previous' untuk rollback, dan konfigurasi Nginx yang sudah ada tidak ditimpa
# kecuali diminta lewat FORCE_NGINX=1.
#
# Pengaturan lewat environment (semuanya punya default):
#   APP_PORT=3000                 port yang didengarkan aplikasi di localhost
#   APP_DIR=/opt/adhiteknologi    direktori runtime (terpisah dari direktori source)
#   PM2_APP=adhiteknologi         nama proses PM2
#   SERVER_NAME=adhiteknologi.com domain untuk konfigurasi Nginx
#   SETUP_NGINX=1                 0 untuk melewati bagian Nginx
#   FORCE_NGINX=0                 1 untuk menimpa konfigurasi Nginx yang sudah ada
#
# Contoh bila port 3000 sudah dipakai situs lain di mesin yang sama:
#   APP_PORT=3020 ./deploy/bootstrap.sh

set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SRC"

APP_PORT="${APP_PORT:-3000}"
APP_DIR="${APP_DIR:-/opt/adhiteknologi}"
PM2_APP="${PM2_APP:-adhiteknologi}"
SERVER_NAME="${SERVER_NAME:-adhiteknologi.com}"
SETUP_NGINX="${SETUP_NGINX:-1}"
FORCE_NGINX="${FORCE_NGINX:-0}"
LOG_DIR="/var/log/adhiteknologi"

step() { printf "\n\033[1;34m==>\033[0m %s\n" "$1"; }
warn() { printf "\033[1;33m !\033[0m %s\n" "$1"; }
die()  { printf "\033[1;31m✗\033[0m %s\n" "$1" >&2; exit 1; }

# ------------------------------------------------------------- 1. pemeriksaan
step "Memeriksa prasyarat"

# NODE_BIN menunjuk Node tertentu tanpa mengubah Node sistem. Berguna bila server
# ini juga menjalankan aplikasi lain yang masih bergantung pada versi lama.
#   NODE_BIN=/root/.nvm/versions/node/v22.20.0/bin/node ./deploy/bootstrap.sh
if [[ -n "${NODE_BIN:-}" ]]; then
  [[ -x "$NODE_BIN" ]] || die "NODE_BIN tidak bisa dieksekusi: ${NODE_BIN}"
  # Diletakkan paling depan agar node, npm, dan npx berasal dari instalasi yang sama.
  export PATH="$(dirname "$NODE_BIN"):$PATH"
  echo "Memakai Node dari NODE_BIN: ${NODE_BIN}"
fi

command -v node >/dev/null || die "Node.js belum terpasang."
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [[ "$NODE_MAJOR" -lt 20 ]]; then
  die "Butuh Node.js 20 atau lebih baru, yang terpasang $(node -v).

Next.js 16 tidak bisa berjalan di Node 18, dan Node 18 sendiri sudah berakhir
masa dukungannya sejak April 2025.

Dua pilihan:

  1) Upgrade Node sistem ke 22 LTS
     Paling sederhana, tapi ikut mempengaruhi aplikasi lain di server ini.
     Periksa dulu apa saja yang berjalan:  pm2 list

  2) Pasang Node 22 terpisah, biarkan Node sistem apa adanya
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
     source ~/.bashrc && nvm install 22
     NODE_BIN=\"\$(nvm which 22)\" ./deploy/bootstrap.sh

Langkah lengkap keduanya ada di deploy/README.md."
fi
echo "Node.js $(node -v)"

command -v npm >/dev/null || die "npm belum terpasang."
command -v curl >/dev/null || die "curl belum terpasang."

if ! command -v pm2 >/dev/null; then
  warn "PM2 belum ada, memasang secara global..."
  npm install -g pm2
fi
echo "PM2 $(pm2 -v)"

# Build Next.js cukup rakus memori. Kalau RAM tersedia mepet dan tidak ada swap,
# build bisa mati terbunuh OOM di tengah jalan tanpa pesan yang jelas.
if command -v free >/dev/null; then
  AVAIL_MB="$(free -m | awk '/^Mem:/ {print $7}')"
  SWAP_MB="$(free -m | awk '/^Swap:/ {print $2}')"
  echo "RAM tersedia: ${AVAIL_MB} MB, swap: ${SWAP_MB} MB"
  if [[ "$AVAIL_MB" -lt 900 && "$SWAP_MB" -lt 512 ]]; then
    warn "RAM tersedia di bawah 900 MB tanpa swap memadai — build bisa terhenti karena OOM."
    warn "Pertimbangkan menambah swap sebelum melanjutkan:"
    warn "  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile"
  fi
fi

# --------------------------------------------------------------- 2. cek port
step "Memeriksa port ${APP_PORT}"

port_owner() {
  if command -v ss >/dev/null; then
    ss -ltnpH "sport = :${APP_PORT}" 2>/dev/null | head -1
  fi
}

OWNER="$(port_owner || true)"
if [[ -n "$OWNER" ]]; then
  # Kalau yang memakai adalah proses PM2 kita sendiri, itu wajar (deploy ulang).
  if pm2 describe "$PM2_APP" >/dev/null 2>&1 && grep -q "node" <<<"$OWNER"; then
    echo "Port dipakai oleh proses '${PM2_APP}' yang sedang berjalan — akan dimuat ulang."
  else
    echo "$OWNER"
    die "Port ${APP_PORT} sudah dipakai proses lain. Jalankan ulang dengan APP_PORT lain, misal:
  APP_PORT=3020 ./deploy/bootstrap.sh"
  fi
else
  echo "Port ${APP_PORT} bebas."
fi

# ------------------------------------------------------------ 3. dependensi
step "Memasang dependensi"
if [[ -f package-lock.json ]]; then
  npm ci
else
  warn "package-lock.json tidak ada, memakai npm install."
  npm install
fi

# ----------------------------------------------------------------- 4. build
step "Build produksi"
npm run build
[[ -d .next/standalone ]] || die "'.next/standalone' tidak terbentuk. Pastikan next.config.ts memakai output: \"standalone\"."

# ------------------------------------------------------- 5. susun direktori runtime
# Build standalone TIDAK menyertakan .next/static dan public/. Kalau keduanya
# terlewat, situs tetap terbuka tapi tampil tanpa CSS dan font sama sekali.
step "Menyusun direktori runtime di ${APP_DIR}"

mkdir -p "$APP_DIR" "$LOG_DIR"
rm -rf "${APP_DIR}/incoming"
mkdir -p "${APP_DIR}/incoming"

cp -r .next/standalone/. "${APP_DIR}/incoming/"
mkdir -p "${APP_DIR}/incoming/.next"
cp -r .next/static "${APP_DIR}/incoming/.next/static"
[[ -d public ]] && cp -r public "${APP_DIR}/incoming/public"
cp deploy/ecosystem.config.js "${APP_DIR}/incoming/ecosystem.config.js"

for required in server.js .next/static ecosystem.config.js; do
  [[ -e "${APP_DIR}/incoming/${required}" ]] || die "Direktori runtime tidak lengkap: ${required} tidak ada."
done
echo "Isi runtime: $(du -sh "${APP_DIR}/incoming" | cut -f1)"

# Tukar direktori. 'previous' disimpan supaya rollback tinggal menukar balik.
rm -rf "${APP_DIR}/previous"
[[ -d "${APP_DIR}/app" ]] && mv "${APP_DIR}/app" "${APP_DIR}/previous"
mv "${APP_DIR}/incoming" "${APP_DIR}/app"

# ------------------------------------------------------------------- 6. PM2
step "Menjalankan aplikasi lewat PM2"
cd "${APP_DIR}/app"

export APP_PORT PM2_APP NODE_BIN="${NODE_BIN:-}"
if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  pm2 reload "$PM2_APP" --update-env
else
  pm2 start ecosystem.config.js --env production
fi
pm2 save >/dev/null

if ! pm2 startup 2>/dev/null | grep -q "sudo env"; then
  echo "PM2 startup sudah aktif."
else
  warn "PM2 belum diatur agar hidup lagi setelah reboot. Jalankan 'pm2 startup' lalu ikuti perintahnya."
fi

cd "$SRC"

# ----------------------------------------------------------------- 7. Nginx
if [[ "$SETUP_NGINX" == "1" ]] && command -v nginx >/dev/null; then
  step "Menyiapkan Nginx untuk ${SERVER_NAME}"

  AVAILABLE="/etc/nginx/sites-available/${SERVER_NAME}"
  ENABLED="/etc/nginx/sites-enabled/${SERVER_NAME}"

  if [[ -f "$AVAILABLE" && "$FORCE_NGINX" != "1" ]]; then
    warn "Konfigurasi Nginx sudah ada di ${AVAILABLE}, dibiarkan apa adanya."
    warn "Untuk menimpanya: FORCE_NGINX=1 ./deploy/bootstrap.sh"
    # Pastikan port di konfigurasi lama masih cocok dengan port aplikasi sekarang.
    if ! grep -q "127.0.0.1:${APP_PORT}" "$AVAILABLE"; then
      warn "PERHATIAN: konfigurasi itu tidak menunjuk ke port ${APP_PORT}. Nginx akan 502."
    fi
  else
    sed -e "s/__APP_PORT__/${APP_PORT}/g" \
        -e "s/__SERVER_NAME__/${SERVER_NAME}/g" \
        deploy/nginx.conf.template > "$AVAILABLE"
    echo "Ditulis: ${AVAILABLE}"

    [[ -L "$ENABLED" ]] || ln -s "$AVAILABLE" "$ENABLED"
    echo "Diaktifkan: ${ENABLED}"

    # Konfigurasi mengacu ke sertifikat TLS. Kalau belum ada, nginx -t akan gagal —
    # itu wajar pada pemasangan pertama, jadi dilaporkan sebagai catatan, bukan error.
    if nginx -t 2>/dev/null; then
      systemctl reload nginx
      echo "Nginx dimuat ulang."
    else
      warn "nginx -t gagal — biasanya karena sertifikat TLS belum dipasang."
      warn "Terbitkan sertifikatnya dulu, lalu: nginx -t && systemctl reload nginx"
      warn "Detail langkahnya ada di deploy/README.md."
    fi
  fi
else
  step "Melewati bagian Nginx"
  [[ "$SETUP_NGINX" == "1" ]] && warn "nginx tidak ditemukan di server ini."
fi

# --------------------------------------------------------------- 8. ringkasan
step "Bootstrap selesai"
cat <<SUMMARY
Source    : ${SRC}
Runtime   : ${APP_DIR}/app
Proses    : ${PM2_APP} di 127.0.0.1:${APP_PORT}
Rollback  : rm -rf ${APP_DIR}/app && mv ${APP_DIR}/previous ${APP_DIR}/app && pm2 reload ${PM2_APP}

Verifikasi : ./deploy/verify.sh
SUMMARY
