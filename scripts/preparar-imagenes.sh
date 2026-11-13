#!/bin/bash
# Convierte las ilustraciones de material/ilustraciones en cartas .webp
# todas con la misma proporción (5:7), listas para la app.
# Para sustituir las imágenes provisionales por las originales sin marca de agua:
#   1. Copia los nuevos archivos en material/ilustraciones (mismos nombres).
#   2. Ejecuta:  bash scripts/preparar-imagenes.sh
# Requiere: sips (macOS) y cwebp (brew install webp).
set -euo pipefail
cd "$(dirname "$0")/.."
ORIGEN="material/ilustraciones"
DESTINO="public/cartas"
ALTO_MAX=1400   # las originales grandes se reducen a 1000x1400 como máximo
TMP="$(mktemp -d)"
mkdir -p "$DESTINO"

procesar() { # $1 = patrón de archivo, $2 = id
  local src; src="$(find "$ORIGEN" -maxdepth 1 -name "$1" | head -1)"
  [ -n "$src" ] || { echo "✗ falta $1"; exit 1; }
  local w h nw nh
  w=$(sips -g pixelWidth "$src" | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$src" | awk '/pixelHeight/{print $2}')
  # recorte centrado a 5:7
  if [ $((w * 7)) -gt $((h * 5)) ]; then nh=$h; nw=$((h * 5 / 7)); else nw=$w; nh=$((w * 7 / 5)); fi
  sips -c "$nh" "$nw" "$src" --out "$TMP/$2.png" >/dev/null
  if [ "$nh" -gt "$ALTO_MAX" ]; then sips -z "$ALTO_MAX" $((ALTO_MAX * 5 / 7)) "$TMP/$2.png" >/dev/null; fi
  cwebp -quiet -q 86 "$TMP/$2.png" -o "$DESTINO/$2.webp"
  echo "✓ $2  (${w}x${h} → ${nw}x${nh})"
}

procesar "Arcangel Miguel*"   miguel
procesar "Arcangel Rafael*"   rafael
procesar "Arcangel Uriel*"    uriel
procesar "Arcangel Gabriel*"  gabriel
procesar "Arcangel Chamuel*"  chamuel
procesar "Arcangel Jofiel*"   jofiel
procesar "Arcangel Zadquiel*" zadquiel
procesar "Arcangel Raziel*"   raziel
procesar "Arcangel Metatr*"   metatron
procesar "Contracara*"        dorso
rm -rf "$TMP"
