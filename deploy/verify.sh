#!/usr/bin/env bash
#
# Memeriksa hasil deploy. Dijalankan di server setelah bootstrap.sh.
#
#   cd /opt/src/adhiteknologi
#   ./deploy/verify.sh
#
# Keluar dengan status 1 bila ada pemeriksaan yang gagal, sehingga bisa dipakai
# di dalam rangkaian perintah lain.
#
# Environment (samakan dengan yang dipakai saat bootstrap):
#   APP_PORT=3000  PM2_APP=adhiteknologi  SERVER_NAME=adhiteknologi.com
#   PUBLIC_CHECK=1   0 untuk melewati pengecekan lewat domain publik

set -uo pipefail

APP_PORT="${APP_PORT:-3000}"
APP_DIR="${APP_DIR:-/opt/adhiteknologi}"
PM2_APP="${PM2_APP:-adhiteknologi}"
SERVER_NAME="${SERVER_NAME:-adhiteknologi.com}"
PUBLIC_CHECK="${PUBLIC_CHECK:-1}"
BASE="http://127.0.0.1:${APP_PORT}"

PASS=0
FAIL=0
WARN=0

ok()   { printf "  \033[1;32m✓\033[0m %s\n" "$1"; PASS=$((PASS+1)); }
bad()  { printf "  \033[1;31m✗\033[0m %s\n" "$1"; FAIL=$((FAIL+1)); }
note() { printf "  \033[1;33m!\033[0m %s\n" "$1"; WARN=$((WARN+1)); }
head2(){ printf "\n\033[1;34m%s\033[0m\n" "$1"; }

code_of() { curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$1" 2>/dev/null; }

# ------------------------------------------------------------------ proses
head2 "Proses"

if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  STATUS="$(pm2 jlist 2>/dev/null | node -e '
    let raw = "";
    process.stdin.on("data", (d) => (raw += d));
    process.stdin.on("end", () => {
      try {
        const app = JSON.parse(raw).find((a) => a.name === process.argv[1]);
        console.log(app ? app.pm2_env.status + " restarts=" + app.pm2_env.restart_time : "tidak ditemukan");
      } catch { console.log("tidak terbaca"); }
    });
  ' "$PM2_APP")"
  case "$STATUS" in
    online*) ok "PM2 '${PM2_APP}': ${STATUS}" ;;
    *)       bad "PM2 '${PM2_APP}': ${STATUS}" ;;
  esac
else
  bad "Proses PM2 '${PM2_APP}' tidak terdaftar."
fi

if [[ -d "${APP_DIR}/app/.next/static" ]]; then
  ok "Aset statis ada di direktori runtime."
else
  bad "${APP_DIR}/app/.next/static tidak ada — situs akan tampil tanpa CSS."
fi

if [[ -d "${APP_DIR}/previous" ]]; then
  ok "Rilis sebelumnya tersimpan (rollback tersedia)."
else
  note "Belum ada rilis sebelumnya — wajar bila ini deploy pertama."
fi

# ------------------------------------------------------------------- route
head2 "Route (langsung ke aplikasi, ${BASE})"

check_route() {
  local path="$1" expected="$2" label="$3"
  local got
  got="$(code_of "${BASE}${path}")"
  if [[ "$got" == "$expected" ]]; then
    ok "${label}: ${got}"
  else
    bad "${label}: dapat ${got}, seharusnya ${expected}"
  fi
}

check_route "/"            "307" "GET /            → redirect ke /id"
check_route "/id"          "200" "GET /id          Bahasa Indonesia"
check_route "/en"          "200" "GET /en          English"
check_route "/fr"          "404" "GET /fr          bahasa tak dikenal ditolak"
check_route "/sitemap.xml" "200" "GET /sitemap.xml"
check_route "/robots.txt"  "200" "GET /robots.txt"
check_route "/icon.svg"    "200" "GET /icon.svg"

# -------------------------------------------------------------------- isi
head2 "Isi halaman"

HTML="$(curl -s --max-time 10 "${BASE}/id" 2>/dev/null)"
if [[ -n "$HTML" ]]; then
  grep -q '<html lang="id"' <<<"$HTML" && ok 'Atribut lang="id" benar.' || bad 'Atribut lang="id" tidak ditemukan.'
  grep -q 'iotadhiteknologi@gmail.com' <<<"$HTML" && ok "Email kontak tampil." || bad "Email kontak tidak tampil."
  grep -q 'wa.me/6289501102075' <<<"$HTML" && ok "Tautan WhatsApp tampil." || bad "Tautan WhatsApp tidak tampil."

  EN_HTML="$(curl -s --max-time 10 "${BASE}/en" 2>/dev/null)"
  grep -q '<html lang="en"' <<<"$EN_HTML" && ok 'Halaman Inggris memakai lang="en".' || bad 'Halaman Inggris tidak memakai lang="en".'

  # Aset ber-hash: penyebab paling umum situs tampil polos setelah deploy.
  CSS="$(grep -oE '/_next/static/[^"]+\.css' <<<"$HTML" | head -1)"
  if [[ -n "$CSS" ]]; then
    [[ "$(code_of "${BASE}${CSS}")" == "200" ]] && ok "CSS termuat: ${CSS}" || bad "CSS gagal dimuat: ${CSS}"
  else
    bad "Tidak ada tautan CSS di halaman."
  fi

  FONT="$(grep -oE '/_next/static/media/[^"]+\.woff2' <<<"$HTML" | head -1)"
  if [[ -n "$FONT" ]]; then
    [[ "$(code_of "${BASE}${FONT}")" == "200" ]] && ok "Font termuat." || bad "Font gagal dimuat: ${FONT}"
  else
    note "Tidak ada font woff2 di HTML awal."
  fi
else
  bad "Tidak bisa mengambil halaman dari ${BASE}/id."
fi

# ------------------------------------------------------------------ nginx
head2 "Nginx"

if command -v nginx >/dev/null; then
  if nginx -t >/dev/null 2>&1; then
    ok "Konfigurasi Nginx valid."
  else
    bad "nginx -t gagal — jalankan 'nginx -t' untuk melihat sebabnya."
  fi

  CONF="/etc/nginx/sites-enabled/${SERVER_NAME}"
  if [[ -e "$CONF" ]]; then
    ok "Site aktif: ${CONF}"
    if grep -q "127.0.0.1:${APP_PORT}" "$CONF"; then
      ok "Nginx menunjuk ke port ${APP_PORT}."
    else
      bad "Nginx TIDAK menunjuk ke port ${APP_PORT} — akan 502."
    fi
  else
    note "Site ${SERVER_NAME} belum diaktifkan di Nginx."
  fi
else
  note "Nginx tidak terpasang di server ini."
fi

# ----------------------------------------------------------------- publik
if [[ "$PUBLIC_CHECK" == "1" ]]; then
  head2 "Akses publik (https://${SERVER_NAME})"
  PUB="$(code_of "https://${SERVER_NAME}/id")"
  case "$PUB" in
    200) ok "https://${SERVER_NAME}/id merespons 200." ;;
    000) note "Tidak bisa dijangkau — DNS/TLS mungkin belum siap. Ini wajar sebelum domain diarahkan." ;;
    526|525) note "Cloudflare ${PUB}: sertifikat origin belum cocok dengan mode SSL 'Full (strict)'." ;;
    502) bad "502 Bad Gateway — Nginx tidak bisa menghubungi aplikasi." ;;
    *)   note "Status ${PUB}." ;;
  esac
fi

# --------------------------------------------------------------- ringkasan
printf "\n\033[1m%s\033[0m\n" "Ringkasan: ${PASS} lolos, ${FAIL} gagal, ${WARN} catatan"

if [[ "$FAIL" -gt 0 ]]; then
  printf "\nBeberapa pemeriksaan gagal. Perintah yang berguna:\n"
  printf "  pm2 logs %s --lines 40\n" "$PM2_APP"
  printf "  rm -rf %s/app && mv %s/previous %s/app && pm2 reload %s   # rollback\n" \
    "$APP_DIR" "$APP_DIR" "$APP_DIR" "$PM2_APP"
  exit 1
fi

printf "\nSemua pemeriksaan penting lolos.\n"
