#!/usr/bin/env bash
#
# Membuat adhiteknologi.tar.gz untuk diunggah ke /opt/src di server.
#
# Isi paket adalah source code, bukan hasil build — build dikerjakan di server
# oleh deploy/bootstrap.sh. node_modules, .next, dan .git tidak ikut.
#
# Pemakaian:
#   ./deploy/pack.sh                 # hasilnya adhiteknologi.tar.gz di root project
#   ./deploy/pack.sh /d/kirim        # simpan ke direktori lain

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

OUT_DIR="${1:-$ROOT}"
OUT="${OUT_DIR%/}/adhiteknologi.tar.gz"
PREFIX="adhiteknologi/"

step() { printf "\n\033[1;34m==>\033[0m %s\n" "$1"; }

# Kalau ada perubahan yang belum di-commit, git archive tidak akan menyertakannya.
# Lebih baik diberitahu sekarang daripada bingung kenapa server memakai versi lama.
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Peringatan: ada perubahan yang belum di-commit." >&2
  echo "Paket dibuat dari isi commit terakhir, perubahan tersebut TIDAK ikut." >&2
  echo "Commit dulu, atau lanjutkan dengan sadar." >&2
  printf "Lanjutkan? [y/N] "
  read -r answer
  [[ "$answer" == "y" || "$answer" == "Y" ]] || exit 1
fi

step "Mengemas dari commit $(git rev-parse --short HEAD)"
git archive --format=tar.gz --prefix="$PREFIX" -o "$OUT" HEAD

step "Memeriksa isi paket"
tar -tzf "$OUT" > /dev/null && echo "Arsip utuh dan bisa dibaca."

for required in \
  "${PREFIX}package.json" \
  "${PREFIX}package-lock.json" \
  "${PREFIX}next.config.ts" \
  "${PREFIX}deploy/bootstrap.sh" \
  "${PREFIX}deploy/verify.sh" \
  "${PREFIX}deploy/ecosystem.config.js" \
  "${PREFIX}deploy/nginx.conf.template" \
  "${PREFIX}src/app/[lang]/page.tsx"
do
  if ! tar -tzf "$OUT" | grep -qxF "$required"; then
    echo "Berkas wajib tidak ada di paket: $required" >&2
    exit 1
  fi
done
echo "Seluruh berkas wajib ada."

if tar -tzf "$OUT" | grep -qE "(^|/)(node_modules|\.next)/"; then
  echo "Paket ikut membawa node_modules atau .next — seharusnya tidak." >&2
  exit 1
fi
echo "Tidak ada node_modules / .next yang ikut terbawa."

step "Selesai"
ls -lh "$OUT" | awk '{print "Paket   : " $NF " (" $5 ")"}'
FILES=$(tar -tzf "$OUT" | wc -l)
echo "Berkas  : $FILES"
echo
echo "Langkah berikutnya — dari PowerShell:"
echo
echo '  scp -o PreferredAuthentications=password -o PubkeyAuthentication=no `'
echo '    -o "ProxyCommand=cloudflared access ssh --hostname %h" `'
echo "    adhiteknologi.tar.gz root@ssh.example.com:/opt/src/"
