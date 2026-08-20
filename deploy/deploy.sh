#!/usr/bin/env bash
#
# Deploy adhiteknologi.com ke VPS sendiri.
#
# Alur: build di mesin lokal -> kemas -> kirim lewat SSH -> tukar direktori -> pm2 reload.
# Server tidak perlu punya toolchain build; cukup Node.js dan PM2.
#
# Pemakaian:
#   cp deploy/deploy.env.example deploy/deploy.env   # sekali saja, lalu isi
#   ./deploy/deploy.sh
#
# Autentikasi SSH memakai kunci (ssh-copy-id). Skrip ini tidak pernah meminta,
# menyimpan, atau mengirimkan kata sandi.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# ---------------------------------------------------------------- konfigurasi
if [[ -f deploy/deploy.env ]]; then
  # shellcheck disable=SC1091
  source deploy/deploy.env
fi

DEPLOY_HOST="${DEPLOY_HOST:-}"
DEPLOY_USER="${DEPLOY_USER:-}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/adhiteknologi}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
PM2_APP="${PM2_APP:-adhiteknologi}"

if [[ -z "$DEPLOY_HOST" || -z "$DEPLOY_USER" ]]; then
  echo "DEPLOY_HOST dan DEPLOY_USER belum diisi." >&2
  echo "Salin deploy/deploy.env.example menjadi deploy/deploy.env lalu isi datanya." >&2
  exit 1
fi

SSH="ssh -p $DEPLOY_PORT ${DEPLOY_USER}@${DEPLOY_HOST}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BUNDLE="adhiteknologi-${STAMP}.tar.gz"
STAGE=".deploy-stage"

step() { printf "\n\033[1;34m==>\033[0m %s\n" "$1"; }

# ------------------------------------------------------------------- 1. build
step "Build produksi"
npm run build

if [[ ! -d .next/standalone ]]; then
  echo "'.next/standalone' tidak ada. Pastikan next.config.ts memakai output: \"standalone\"." >&2
  exit 1
fi

# ------------------------------------------------------------------ 2. kemas
# Build standalone tidak menyertakan aset statis dan public/ — keduanya
# harus disalin manual, kalau tidak seluruh CSS dan font akan 404.
step "Menyusun paket rilis"
rm -rf "$STAGE" && mkdir -p "$STAGE"
cp -r .next/standalone/. "$STAGE/"
mkdir -p "$STAGE/.next"
cp -r .next/static "$STAGE/.next/static"
[[ -d public ]] && cp -r public "$STAGE/public"
cp deploy/ecosystem.config.js "$STAGE/ecosystem.config.js"

tar -czf "$BUNDLE" -C "$STAGE" .
SIZE="$(du -h "$BUNDLE" | cut -f1)"
echo "Paket: $BUNDLE ($SIZE)"

# ------------------------------------------------------------------ 3. kirim
step "Mengirim ke ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
$SSH "mkdir -p '${DEPLOY_PATH}' /var/log/adhiteknologi 2>/dev/null || mkdir -p '${DEPLOY_PATH}'"
scp -P "$DEPLOY_PORT" "$BUNDLE" "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

# ------------------------------------------------------------------ 4. pasang
step "Memasang rilis dan memuat ulang PM2"
$SSH bash -s <<REMOTE
set -euo pipefail
cd "${DEPLOY_PATH}"

rm -rf incoming && mkdir -p incoming
tar -xzf "${BUNDLE}" -C incoming
rm -f "${BUNDLE}"

# Tukar direktori: 'previous' disimpan agar rollback tinggal menukar balik.
rm -rf previous
[[ -d app ]] && mv app previous
mv incoming app

cd app
if pm2 describe "${PM2_APP}" > /dev/null 2>&1; then
  pm2 reload "${PM2_APP}" --update-env
else
  pm2 start ecosystem.config.js --env production
fi
pm2 save > /dev/null

echo "Menunggu aplikasi merespons..."
for i in \$(seq 1 20); do
  if curl -fsS -o /dev/null "http://127.0.0.1:3000/id"; then
    echo "Aplikasi merespons."
    exit 0
  fi
  sleep 1
done

echo "Aplikasi tidak merespons dalam 20 detik. Log terakhir:" >&2
pm2 logs "${PM2_APP}" --lines 30 --nostream >&2 || true
exit 1
REMOTE

# ----------------------------------------------------------------- 5. bersih
rm -rf "$STAGE" "$BUNDLE"

step "Selesai"
echo "Rilis aktif  : ${DEPLOY_PATH}/app"
echo "Rollback     : ssh ${DEPLOY_USER}@${DEPLOY_HOST} \"cd ${DEPLOY_PATH} && rm -rf app && mv previous app && pm2 reload ${PM2_APP}\""
echo "Cek publik   : curl -I https://adhiteknologi.com/"
