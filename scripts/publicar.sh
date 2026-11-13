#!/bin/bash
# Compila la app y la publica en GitHub Pages (rama gh-pages del repositorio).
#   bash scripts/publicar.sh
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTO="$(git remote get-url origin)"
REPO="$(basename -s .git "$REMOTO")"

export BASE_PATH="/$REPO/"
if command -v npm >/dev/null; then npm run build; else deno task build; fi

cd dist
touch .nojekyll
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -q -m "Publicar $(date +%Y-%m-%d\ %H:%M)"
git push -q -f "$REMOTO" gh-pages
rm -rf .git
echo "✓ Publicado. En uno o dos minutos estará en GitHub Pages."
