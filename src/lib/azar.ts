import { config } from "@/config";
import type { Carta } from "@/contenido";
import type { Tirada } from "@/store/estado";
import { ayerLocal } from "./fecha";

/** Entero uniforme en [0, n) sin sesgo (muestreo con rechazo). */
function enteroJusto(n: number): number {
  const limite = Math.floor(0x100000000 / n) * n;
  const b = new Uint32Array(1);
  do crypto.getRandomValues(b); while (b[0] >= limite);
  return b[0] % n;
}

/** «La carta te elige a ti»: todas con la misma probabilidad. */
export function elegirCarta(cartas: Carta[], tiradas: Tirada[]): Carta {
  let mazo = cartas;
  if (config.evitarRepetirAyer && cartas.length > 1) {
    const ayer = tiradas.find((x) => x.fecha === ayerLocal())?.cartaId;
    mazo = cartas.filter((c) => c.id !== ayer);
  }
  return mazo[enteroJusto(mazo.length)];
}
