// Única puerta de entrada al contenido. Para añadir un idioma: crea
// content/<idioma>/ con los mismos archivos y elige aquí cuál cargar.
import datos from "@content/es/cartas.json";
import textos from "@content/es/textos.json";

export interface Rayo { nombre: string; color: string; tinta: string }
export interface Carta {
  id: string;
  nombre: string;
  atributos: string[];
  mensajePrincipal: string;
  contexto: string[];
  rayo: Rayo;
  imagen: string;
  paginaLibro: string | null;
}

const base = import.meta.env.BASE_URL;
export const cartas: Carta[] = (datos.cartas as Carta[]).map((c) => ({ ...c, imagen: base + c.imagen }));
export const dorso: string = base + datos.dorso;
export const t = textos;
export const cartaPorId = (id: string) => cartas.find((c) => c.id === id);

/** Sustituye {claves} en un texto. */
export const con = (texto: string, valores: Record<string, string | number>) =>
  texto.replace(/\{(\w+)\}/g, (_, k) => String(valores[k] ?? ""));
