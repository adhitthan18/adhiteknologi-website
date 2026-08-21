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
CR=$'\r'

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

step "Memeriksa line ending"

# Skrip dieksekusi di Linux. Satu carriage return di baris shebang saja sudah
# membuat kernel mencari interpreter bernama bash-CR, dan skrip gagal sebelum
# sempat jalan:  /usr/bin/env: 'bash^M': No such file or directory
# .gitattributes sudah memaksa LF; pemeriksaan ini memastikannya benar terjadi.
#
# Daftar dikumpulkan lebih dulu lalu di-loop dengan `for`. Pola `while read`
# dengan redirect dari $LIST rawan terhenti di tengah karena perintah di dalam
# badan loop ikut mewarisi stdin yang sama.
SCRIPT_ENTRIES="$(grep -E '\.(sh|conf|template|service)$' "$LIST" || true)"
BAD_EOL=0
CHECKED=0

for entry in $SCRIPT_ENTRIES; do
  CHECKED=$((CHECKED + 1))
  CR_COUNT="$(tar -xzOf "$OUT" "$entry" | tr -cd "$CR" | wc -c | tr -d ' ')"
  if [[ "$CR_COUNT" -gt 0 ]]; then
    echo "  CRLF terdeteksi: ${entry} (${CR_COUNT} CR)" >&2
    BAD_EOL=1
  fi
done

if [[ "$BAD_EOL" -eq 1 ]]; then
  echo >&2
  echo "Berkas di atas memakai CRLF dan akan gagal dieksekusi di Linux." >&2
  echo "Perbaiki dengan:" >&2
  echo "  sed -i 's/\\r\$//' deploy/*.sh deploy/*.template" >&2
  echo "  git add -A && git commit -m 'fix: line ending LF'" >&2
  exit 1
fi
echo "LF bersih di ${CHECKED} berkas skrip/konfigurasi."

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
