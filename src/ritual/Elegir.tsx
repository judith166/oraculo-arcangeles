import { useEffect, useState } from "react";
import { config } from "@/config";
import { con, dorso, t } from "@/contenido";
import { luz } from "@/lib/luz";
import { campanita, vibrar } from "@/lib/sonido";
import type { Origen } from "@/componentes/CartaDelDia";

/** El mazo abierto en abanico. Toques la que toques, la carta te elige a ti. */
export function Elegir({ onElegida }: { onElegida: (desde: Origen) => void }) {
  const n = config.cartasEnAbanico;
  const [abierto, setAbierto] = useState(false);
  const [elegida, setElegida] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setAbierto(true), 120);
    return () => clearTimeout(id);
  }, []);

  function elegir(i: number, el: HTMLElement) {
    if (elegida !== null) return;
    setElegida(i);
    campanita(988);
    vibrar(16);
    const r = el.getBoundingClientRect();
    luz.emitir(r.left + r.width / 2, r.top + r.height / 2, 46, undefined, 1.8);
    // Cuando la carta ha terminado de elevarse, anotamos dónde está para que
    // la pantalla siguiente la recoja exactamente desde ahí.
    setTimeout(() => {
      const f = el.getBoundingClientRect();
      onElegida({ cx: f.left + f.width / 2, cy: f.top + f.height / 2, ancho: el.offsetWidth, angulo: (i - (n - 1) / 2) * 7 });
    }, 750);
  }

  return (
    <div className={`etapa etapa-elegir ${elegida !== null ? "eligiendo" : ""}`}>
      <h1 className="titulo">{t.ritual.elegir.titulo}</h1>
      <p className="guia">{t.ritual.elegir.texto}</p>
      <div className={`abanico ${abierto ? "abierto" : ""} ${elegida !== null ? "hay-elegida" : ""}`}>
        {Array.from({ length: n }, (_, i) => (
          <button
            key={i} className={`abanico-carta ${elegida === i ? "elegida" : ""}`}
            style={{ "--a": `${(i - (n - 1) / 2) * 7}deg`, "--i": i } as React.CSSProperties}
            aria-label={con(t.ritual.elegir.carta, { n: i + 1, total: n })}
            onClick={(e) => elegir(i, e.currentTarget)}
          >
            <img src={dorso} alt="" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
}
