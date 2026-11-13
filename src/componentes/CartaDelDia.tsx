import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { con, t, type Carta } from "@/contenido";
import { luz } from "@/lib/luz";
import { calma, hexARgb } from "@/lib/movimiento";
import { cuenco, vibrar } from "@/lib/sonido";
import { CartaVista } from "./CartaVista";
import { HojaCarta } from "./HojaCarta";

/** Dónde estaba la carta elegida en el abanico (centro, ancho y giro), en pantalla. */
export interface Origen { cx: number; cy: number; ancho: number; angulo: number }

/**
 * La carta del día con su mensaje. Con `revelar` reproduce el momento de la
 * revelación (giro, destello del rayo, cuenco); sin él la muestra ya revelada.
 * Con `origen`, la carta viaja desde el abanico hasta su sitio mientras gira.
 */
export function CartaDelDia({ carta, revelar = false, origen, pie }: { carta: Carta; revelar?: boolean; origen?: Origen; pie?: ReactNode }) {
  const [girada, setGirada] = useState(!revelar);
  const [textos, setTextos] = useState(!revelar);
  const [destello, setDestello] = useState(false);
  const [completo, setCompleto] = useState(false);
  const marco = useRef<HTMLDivElement>(null);
  const volado = useRef(false);
  const rgb = hexARgb(carta.rayo.color);

  // El color del rayo tiñe toda la app mientras la carta está revelada.
  useEffect(() => {
    if (!girada) return;
    const raiz = document.documentElement;
    raiz.style.setProperty("--rayo", carta.rayo.color);
    raiz.style.setProperty("--rayo-rgb", rgb);
    raiz.style.setProperty("--rayo-tinta", carta.rayo.tinta);
    raiz.dataset.rayo = "1";
    return () => {
      delete raiz.dataset.rayo;
      for (const p of ["--rayo", "--rayo-rgb", "--rayo-tinta"]) raiz.style.removeProperty(p);
    };
  }, [girada, carta, rgb]);

  // Vuelo desde el abanico: la carta arranca donde la tocaste y se posa en su sitio.
  useLayoutEffect(() => {
    const el = marco.current;
    if (!el || !origen || volado.current || calma()) return;
    volado.current = true;
    const r = el.getBoundingClientRect();
    const dx = origen.cx - (r.left + r.width / 2), dy = origen.cy - (r.top + r.height / 2);
    el.style.transition = "none";
    el.style.transform = `translate(${dx}px, ${dy}px) rotate(${origen.angulo}deg) scale(${origen.ancho / r.width})`;
    el.getBoundingClientRect();
    requestAnimationFrame(() => {
      el.style.transition = "transform 1.4s cubic-bezier(0.3, 0.7, 0.15, 1)";
      el.style.transform = "";
    });
  }, [origen]);

  useEffect(() => {
    if (!revelar) return;
    const inicio = origen ? 140 : 1100;
    const esperas = [
      setTimeout(() => { setGirada(true); setDestello(true); cuenco(); vibrar([14, 70, 24]); }, inicio),
      setTimeout(() => {
        const r = marco.current?.getBoundingClientRect();
        if (!r) return;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        luz.emitir(cx, cy, 70, rgb, 2.6);
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * Math.PI * 2;
          luz.emitir(cx + Math.cos(a) * r.width * 0.55, cy + Math.sin(a) * r.height * 0.55, 2, rgb, 1.2);
        }
      }, inicio + (calma() ? 0 : origen ? 1150 : 550)),
      setTimeout(() => setTextos(true), inicio + (calma() ? 400 : 1400)),
      setTimeout(() => setDestello(false), inicio + 3200),
    ];
    return () => esperas.forEach(clearTimeout);
  }, [revelar, origen, rgb]);

  return (
    <div className={`carta-dia ${textos ? "con-textos" : ""}`}>
      {destello && <div className="destello" aria-hidden="true" />}
      <div className={`carta-marco ${revelar && !origen ? "entra" : ""} ${girada ? "revelada" : ""}`} ref={marco}>
        <div className="carta-halo" aria-hidden="true" />
        <CartaVista carta={carta} bocaArriba={girada} />
      </div>

      <div className="carta-textos" aria-live="polite">
        {textos && (
          <>
            <p className="carta-rayo aparece" style={{ "--n": 0 } as React.CSSProperties}>{con(t.carta.rayo, { nombre: carta.rayo.nombre })}</p>
            <h1 className="carta-nombre aparece" style={{ "--n": 1 } as React.CSSProperties}>{carta.nombre}</h1>
            <p className="carta-atributos aparece" style={{ "--n": 2 } as React.CSSProperties}>{carta.atributos.join(" · ")}</p>
            <div className="carta-regla aparece" style={{ "--n": 3 } as React.CSSProperties} aria-hidden="true" />
            <div className="carta-mensaje aparece" style={{ "--n": 4 } as React.CSSProperties}>
              {carta.mensajePrincipal.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="carta-acciones aparece" style={{ "--n": 6 } as React.CSSProperties}>
              <button className="boton boton-principal" onClick={() => setCompleto(true)}>{t.carta.completo}</button>
              {pie}
            </div>
          </>
        )}
      </div>

      <HojaCarta carta={carta} abierta={completo} onCerrar={() => setCompleto(false)} />
    </div>
  );
}
