// Importación inicial: lee material/arcangeles.md y genera content/es/cartas.json.
// Los textos se copian TAL CUAL (erratas incluidas). A partir de aquí la fuente
// de verdad es content/es/cartas.json: corrige ahí, no vuelvas a ejecutar esto
// salvo que quieras regenerar desde el libro (sobrescribe el archivo).
//   node scripts/importar-libro.mjs      (o: deno run -A scripts/importar-libro.mjs)
import { readFileSync, writeFileSync } from "node:fs";

const RAYOS = {
  miguel:   { nombre: "azul",               color: "#3D7BFF", tinta: "#1F4FC4" },
  rafael:   { nombre: "verde",              color: "#2FCB7A", tinta: "#14804A" },
  uriel:    { nombre: "rojo rubí",          color: "#E0304F", tinta: "#B01535" },
  gabriel:  { nombre: "blanco cristalino",  color: "#CFEFF5", tinta: "#2F7F94" },
  chamuel:  { nombre: "rosa",               color: "#FF86B8", tinta: "#BF3B76" },
  jofiel:   { nombre: "amarillo dorado",    color: "#F6C544", tinta: "#8A6508" },
  zadquiel: { nombre: "violeta",            color: "#9B6BFF", tinta: "#6A3FD0" },
  raziel:   { nombre: "añil arcoíris",      color: "#6F7DFF", tinta: "#3F49C9" },
  metatron: { nombre: "magenta púrpura",    color: "#D05CF0", tinta: "#9328B5" },
};
const PAGINAS = { miguel: "74-75" };

const md = readFileSync(new URL("../material/arcangeles.md", import.meta.url), "utf8");
const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const cartas = [];
for (const bloque of md.split(/\n---\n/)) {
  const m = bloque.match(/^\s*# (Arcángel (\S+))\s*\n+## (.+)\n+### Mensaje principal\n+([\s\S]+?)\n+### Contexto\n+([\s\S]+?)\s*$/);
  if (!m) continue;
  const id = slug(m[2]);
  cartas.push({
    id,
    nombre: m[1],
    atributos: m[3].split(".").map((a) => a.trim()).filter(Boolean),
    mensajePrincipal: m[4].trim(),
    contexto: m[5].trim().split(/\n\s*\n/).map((p) => p.trim()),
    rayo: RAYOS[id],
    imagen: `cartas/${id}.webp`,
    paginaLibro: PAGINAS[id] ?? null,
  });
}
const salida = { idioma: "es", dorso: "cartas/dorso.webp", cartas };
writeFileSync(new URL("../content/es/cartas.json", import.meta.url), JSON.stringify(salida, null, 2) + "\n");
console.log(`✓ ${cartas.length} cartas → content/es/cartas.json`);
