// Reglas de la app que el autor puede querer cambiar. Nada de esto está
// repartido por el código: se cambia aquí y ya.
export const config = {
  /** Una sola tirada al día; a medianoche (hora local) se libera otra. */
  unaTiradaPorDia: true,
  /** Si es true, nunca sale la misma carta que ayer. Decidido: false (azar puro). */
  evitarRepetirAyer: false,
  /** Permite hacer más tiradas el mismo día aunque unaTiradaPorDia sea true. Poner en false antes de lanzar. */
  modoPrueba: true,
  /** Aviso diario. Oculto hasta que exista el envío real (ver PENDIENTES.md). */
  avisos: false,
  respiracion: { ciclos: 3, inspiraMs: 4000, espiraMs: 6000 },
  cartasEnAbanico: 9,
} as const;
