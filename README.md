# Oráculo de los Arcángeles

PWA (web instalable) del oráculo de cartas de los Arcángeles, con ilustraciones de David Mateu.
Versión de prueba de la V1.

> Las ilustraciones y los textos tienen derechos de autor. No se pueden reutilizar fuera de esta app.

## Arrancar en local

Con Node 20 o superior:

```bash
npm install
npm run dev
```

O con Deno 2: `deno install` y `deno task dev`. La app queda en http://localhost:5173.

## Publicar

La app está en GitHub Pages. Para publicar los últimos cambios:

```bash
bash scripts/publicar.sh
```

Compila la app y sube la carpeta `dist/` a la rama `gh-pages`. En uno o dos minutos está online.

Para otro alojamiento (por ejemplo Cloudflare Pages): `npm run build` y subir `dist/`.

## Dónde está cada cosa

| Qué | Dónde |
| --- | --- |
| Textos de las cartas (tal cual el libro) | `content/es/cartas.json` |
| Textos de la interfaz | `content/es/textos.json` |
| Frases adaptadas o nuevas, para revisión del autor | `content/es/revision-autor.json` |
| Reglas configurables (tiradas al día, modo prueba, avisos) | `src/config.ts` |
| Ilustraciones originales | `material/ilustraciones/` |
| Convertir ilustraciones a cartas de la app | `npm run imagenes` (macOS, requiere `cwebp`) |
| Lo que falta por hacer | `PENDIENTES.md` |

Para añadir cartas: una ficha nueva en `cartas.json` y su imagen en `public/cartas/`.
