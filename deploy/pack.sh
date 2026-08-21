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
  echo "Ada perubahan yang belum di-commit." >&2
  echo "git archive mengemas isi commit terakhir, jadi perubahan itu TIDAK akan ikut." >&2
  echo >&2
  git status --short >&2
  echo >&2
  if [[ -t 0 ]]; then
    printf "Tetap lanjutkan? [y/N] "
    read -r answer
    [[ "$answer" == "y" || "$answer" == "Y" ]] || exit 1
  else
    # Tanpa terminal, jangan menggantung menunggu jawaban yang tidak akan datang.
    echo "Commit dulu, atau jalankan ulang dengan ALLOW_DIRTY=1 untuk mengabaikan." >&2
    [[ "${ALLOW_DIRTY:-0}" == "1" ]] || exit 1
    echo "ALLOW_DIRTY=1 — dilanjutkan." >&2
  fi
fi

step "Mengemas dari commit $(git rev-parse --short HEAD)"
git archive --format=tar.gz --prefix="$PREFIX" -o "$OUT" HEAD

step "Memeriksa isi paket"

# Daftar isi diambil SEKALI ke berkas sementara, lalu diperiksa dari sana.
# Menyalurkan `tar | grep -q` langsung akan membuat grep keluar lebih awal,
# tar kena SIGPIPE, dan `set -o pipefail` menganggap seluruh pipeline gagal.
LIST="$(mktemp)"
trap 'rm -f "$LIST"' EXIT
tar -tzf "$OUT" > "$LIST"
echo "Arsip utuh dan bisa dibaca."

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
  if ! grep -qxF "$required" "$LIST"; then
    echo "Berkas wajib tidak ada di paket: $required" >&2
    exit 1
  fi
done
echo "Seluruh berkas wajib ada."

if grep -qE "(^|/)(node_modules|\.next)/" "$LIST"; then
  echo "Paket ikut membawa node_modules atau .next — seharusnya tidak." >&2
  exit 1
fi
echo "Tidak ada node_modules / .next yang ikut terbawa."

# Skrip dieksekusi di Linux. Satu carriage return saja di baris shebang membuat
# kernel mencari interpreter bernama "bash" dan skrip gagal sebelum jalan.
# .gitattributes sudah memaksa LF, pemeriksaan ini memastikannya benar terjadi.
CRLF_FILES=""
while IFS= read -r entry; do
  case "$entry" in
    *.sh|*.template|*.conf)
      CR_COUNT="$(tar -xzOf "$OUT" "$entry" | tr -dc "" | wc -c)"
      [[ "$CR_COUNT" -gt 0 ]] && CRLF_FILES="${CRLF_FILES}
  ${entry} (${CR_COUNT} CR)"
      ;;
  esac
done < "$LIST"

if [[ -n "$CRLF_FILES" ]]; then
  echo "Berkas berikut memakai CRLF dan akan gagal jalan di Linux:" >&2
  printf "%b
" "$CRLF_FILES" >&2
  echo >&2
  echo "Perbaiki dengan: sed -i 's/\r\$//' deploy/*.sh && git add -A && git commit" >&2
  exit 1
fi
echo "Line ending skrip: LF (aman untuk Linux)."

step "Selesai"
ls -lh "$OUT" | awk '{print "Paket   : " $NF " (" $5 ")"}'
FILES=$(wc -l < "$LIST")
echo "Berkas  : $FILES"
echo
echo "Langkah berikutnya — dari PowerShell:"
echo
echo '  scp -o PreferredAuthentications=password -o PubkeyAuthentication=no `'
echo '    -o "ProxyCommand=cloudflared access ssh --hostname %h" `'
echo "    adhiteknologi.tar.gz root@ssh.example.com:/opt/src/"
