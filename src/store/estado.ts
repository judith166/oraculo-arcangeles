// Datos del dispositivo. Todo pasa por la interfaz Almacen: en la V2 se añade
// un AlmacenRemoto (cuenta de usuario) sin tocar las pantallas.
import { useSyncExternalStore } from "react";

export type Tema = "auto" | "claro" | "oscuro";
export interface Tirada {
  id: string;
  tipo: "diaria"; // V2: "pregunta" | "tres-cartas" | "conexion"
  fecha: string; // AAAA-MM-DD en hora local
  cartaId: string;
  intencion?: string;
  modo?: "ritual" | "rapida";
  creada: string; // ISO
}
export interface Ajustes {
  tema: Tema;
  sonido: boolean;
  reducirAnimaciones: boolean;
  notificaciones: { activa: boolean; hora: string; afirmacionTarde: boolean };
}
export interface Estado {
  version: 1;
  ajustes: Ajustes;
  bienvenidaVista: boolean;
  tutorialVisto: boolean;
  tiradas: Tirada[];
}

const inicial: Estado = {
  version: 1,
  ajustes: {
    tema: "auto",
    sonido: false,
    reducirAnimaciones: false,
    notificaciones: { activa: false, hora: "08:00", afirmacionTarde: false },
  },
  bienvenidaVista: false,
  tutorialVisto: false,
  tiradas: [],
};

interface Almacen { cargar(): Estado | null; guardar(e: Estado): void }

const CLAVE = "oraculo:v1";
const almacenLocal: Almacen = {
  cargar() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      return crudo ? (JSON.parse(crudo) as Estado) : null;
    } catch { return null; }
  },
  guardar(e) {
    try { localStorage.setItem(CLAVE, JSON.stringify(e)); } catch { /* modo privado: seguimos en memoria */ }
  },
};

const almacen: Almacen = almacenLocal;
const guardado = almacen.cargar();
let estado: Estado = guardado
  ? { ...inicial, ...guardado, ajustes: { ...inicial.ajustes, ...guardado.ajustes } }
  : inicial;
const oyentes = new Set<() => void>();

function cambiar(nuevo: Estado) {
  estado = nuevo;
  almacen.guardar(estado);
  oyentes.forEach((f) => f());
}

export const leerEstado = () => estado;
export function useEstado(): Estado {
  return useSyncExternalStore((f) => { oyentes.add(f); return () => oyentes.delete(f); }, leerEstado);
}

export function actualizarAjustes(parcial: Partial<Ajustes>) {
  cambiar({ ...estado, ajustes: { ...estado.ajustes, ...parcial } });
}
export function actualizarAvisos(parcial: Partial<Ajustes["notificaciones"]>) {
  actualizarAjustes({ notificaciones: { ...estado.ajustes.notificaciones, ...parcial } });
}
export function marcarVisto(que: "bienvenidaVista" | "tutorialVisto") {
  if (!estado[que]) cambiar({ ...estado, [que]: true });
}
export function registrarTirada(tirada: Omit<Tirada, "id" | "creada">): Tirada {
  const completa: Tirada = { ...tirada, id: crypto.randomUUID(), creada: new Date().toISOString() };
  cambiar({ ...estado, tiradas: [...estado.tiradas, completa] });
  return completa;
}
export const tiradaDe = (e: Estado, fecha: string) =>
  [...e.tiradas].reverse().find((x) => x.tipo === "diaria" && x.fecha === fecha);
