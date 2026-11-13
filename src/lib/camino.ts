// «Mi camino»: lo que cuentan las tiradas guardadas en el dispositivo.
import { cartaPorId, type Carta } from "@/contenido";
import type { Tirada } from "@/store/estado";

export interface Compania { carta: Carta; veces: number; ultima: string }
export interface Camino {
  total: number;
  dias: number;
  /** Arcángeles que han salido, del que más acompaña al que menos. */
  ranking: Compania[];
  /** El Arcángel que más veces ha salido (si hay empate, el más reciente). */
  principal?: Compania;
  /** Tiradas de la más reciente a la más antigua, solo con cartas que existen. */
  historial: { tirada: Tirada; carta: Carta }[];
}

export function leerCamino(tiradas: Tirada[]): Camino {
  const porCarta = new Map<string, Compania>();
  const historial: Camino["historial"] = [];
  for (const tirada of tiradas) {
    const carta = cartaPorId(tirada.cartaId);
    if (!carta) continue;
    historial.push({ tirada, carta });
    const c = porCarta.get(carta.id) ?? { carta, veces: 0, ultima: "" };
    c.veces++;
    if (tirada.creada > c.ultima) c.ultima = tirada.creada;
    porCarta.set(carta.id, c);
  }
  const ranking = [...porCarta.values()].sort((a, b) => b.veces - a.veces || b.ultima.localeCompare(a.ultima));
  historial.sort((a, b) => b.tirada.creada.localeCompare(a.tirada.creada));
  return { total: historial.length, dias: new Set(historial.map((h) => h.tirada.fecha)).size, ranking, principal: ranking[0], historial };
}
