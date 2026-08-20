#!/usr/bin/env bash
#
# Deploy adhiteknologi.com ke VPS sendiri.
#
# Build dikerjakan di mesin lokal, hasilnya dialirkan langsung ke server lewat SSH.
# Seluruh proses memakai SATU koneksi SSH — jadi kalau autentikasinya kata sandi,
# yang ditanyakan hanya sekali, bukan tiga kali.
#
# Skrip ini tidak pernah membaca, menyimpan, atau meneruskan kata sandi.
# Yang menanyakannya adalah ssh, langsung ke terminal Anda.
#
# Pemakaian:
#   cp deploy/deploy.env.example deploy/deploy.env   # sekali saja, lalu isi
#   ./deploy/deploy.sh

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
APP_PORT="${APP_PORT:-3000}"
CLOUDFLARED="${CLOUDFLARED:-}"
SSH_AUTH_MODE="${SSH_AUTH_MODE:-key}"

if [[ -z "$DEPLOY_HOST" || -z "$DEPLOY_USER" ]]; then
  echo "DEPLOY_HOST dan DEPLOY_USER belum diisi." >&2
  echo "Salin deploy/deploy.env.example menjadi deploy/deploy.env lalu isi datanya." >&2
  exit 1
fi

SSH_OPTS=(-p "$DEPLOY_PORT")

if [[ -n "$CLOUDFLARED" ]]; then
  if [[ ! -x "$CLOUDFLARED" && ! -f "$CLOUDFLARED" ]]; then
    echo "cloudflared tidak ditemukan di: $CLOUDFLARED" >&2
    exit 1
  fi
  # Koneksi ditembuskan lewat Cloudflare Access, bukan langsung ke port 22 publik.
  SSH_OPTS+=(-o "ProxyCommand=$CLOUDFLARED access ssh --hostname %h")
fi

if [[ "$SSH_AUTH_MODE" == "password" ]]; then
  SSH_OPTS+=(-o PreferredAuthentications=password -o PubkeyAuthentication=no)
fi

TARGET="${DEPLOY_USER}@${DEPLOY_HOST}"
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
# Build standalone tidak menyertakan aset statis dan public/ — keduanya harus
# disalin manual. Kalau terlewat, situs tampil tanpa CSS dan font sama sekali.
step "Menyusun paket rilis"
rm -rf "$STAGE" && mkdir -p "$STAGE"
cp -r .next/standalone/. "$STAGE/"
mkdir -p "$STAGE/.next"
cp -r .next/static "$STAGE/.next/static"
[[ -d public ]] && cp -r public "$STAGE/public"
cp deploy/ecosystem.config.js "$STAGE/ecosystem.config.js"
echo "Isi paket: $(du -sh "$STAGE" | cut -f1)"

# --------------------------------------------------------- 3. skrip sisi server
REMOTE_SCRIPT=$(cat <<REMOTE
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH}"
PM2_APP="${PM2_APP}"
APP_PORT="${APP_PORT}"

command -v node >/dev/null || { echo "Node.js belum terpasang di server." >&2; exit 1; }
command -v pm2  >/dev/null || { echo "PM2 belum terpasang: npm install -g pm2" >&2; exit 1; }

mkdir -p "\$DEPLOY_PATH" /var/log/adhiteknologi
cd "\$DEPLOY_PATH"

# Tarball dibaca dari stdin koneksi SSH ini — tidak ada berkas perantara.
rm -rf incoming && mkdir -p incoming
tar -xzf - -C incoming

# Tukar direktori. 'previous' disimpan supaya rollback tinggal menukar balik.
rm -rf previous
[ -d app ] && mv app previous
mv incoming app

cd app
if pm2 describe "\$PM2_APP" > /dev/null 2>&1; then
  pm2 reload "\$PM2_APP" --update-env
else
  pm2 start ecosystem.config.js --env production
fi
pm2 save > /dev/null

echo "Menunggu aplikasi merespons di 127.0.0.1:\$APP_PORT ..."
for i in \$(seq 1 20); do
  if curl -fsS -o /dev/null "http://127.0.0.1:\$APP_PORT/id"; then
    echo "OK — aplikasi merespons."
    exit 0
  fi
  sleep 1
done

echo "Aplikasi tidak merespons dalam 20 detik. Log terakhir:" >&2
pm2 logs "\$PM2_APP" --lines 30 --nostream >&2 || true
echo "Rollback: cd \$DEPLOY_PATH && rm -rf app && mv previous app && pm2 reload \$PM2_APP" >&2
exit 1
REMOTE
)

# Skrip dikirim sebagai base64 supaya tanda kutip dan variabel di dalamnya tidak
# diinterpretasikan ulang oleh shell mana pun di tengah jalan.
REMOTE_B64="$(printf '%s' "$REMOTE_SCRIPT" | base64 | tr -d '\n')"

# ----------------------------------------------------- 4. kirim + pasang (1 koneksi)
step "Deploy ke ${TARGET}:${DEPLOY_PATH}"
if [[ "$SSH_AUTH_MODE" == "password" ]]; then
  echo "ssh akan menanyakan kata sandi sebentar lagi — cukup sekali untuk seluruh proses."
fi

tar -czf - -C "$STAGE" . \
  | ssh "${SSH_OPTS[@]}" "$TARGET" \
      "printf %s '$REMOTE_B64' | base64 -d > /tmp/adhi-deploy.sh && bash /tmp/adhi-deploy.sh; rc=\$?; rm -f /tmp/adhi-deploy.sh; exit \$rc"

# ----------------------------------------------------------------- 5. bersih
rm -rf "$STAGE"

step "Selesai"
echo "Rilis aktif : ${DEPLOY_PATH}/app"
echo "Rollback    : cd ${DEPLOY_PATH} && rm -rf app && mv previous app && pm2 reload ${PM2_APP}"
echo "Cek publik  : curl -I https://adhiteknologi.com/"
