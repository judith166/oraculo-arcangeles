import { useRef, useState, type ReactNode } from "react";
import { con, t } from "@/contenido";
import { calma } from "@/lib/movimiento";

export interface Pagina { clave: string; emblema: ReactNode; antetitulo?: string; titulo: string; texto: string; extra?: ReactNode }

/** Pantallas deslizables (bienvenida y tutorial): desliza con el dedo o usa «Siguiente». */
export function Recorrido({ paginas, textoFinal, onFin, onSaltar }: { paginas: Pagina[]; textoFinal: string; onFin: () => void; onSaltar: () => void }) {
  const pista = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);
  const ultima = actual === paginas.length - 1;

  function ir(i: number) {
    const el = pista.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: calma() ? "auto" : "smooth" });
  }

  return (
    <main className="pantalla recorrido">
      <header className="barra barra-derecha">
        <button className="boton boton-texto" onClick={onSaltar}>{t.recorrido.saltar}</button>
      </header>
      <div
        className="recorrido-pista" ref={pista}
        onScroll={(e) => setActual(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
      >
        {paginas.map((p, i) => (
          <section key={p.clave} className={`diapositiva ${i === actual ? "activa" : ""}`} aria-roledescription="slide" aria-label={con(t.recorrido.pagina, { n: i + 1, total: paginas.length })}>
            <div className="emblema" aria-hidden="true">{p.emblema}</div>
            {p.antetitulo && <p className="carta-rayo">{p.antetitulo}</p>}
            <h1 className="titulo">{p.titulo}</h1>
            <p className="lectura">{p.texto}</p>
            {p.extra}
          </section>
        ))}
      </div>
      <div className="recorrido-pie">
        <div className="puntos" aria-hidden="true">
          {paginas.map((p, i) => <i key={p.clave} className={i === actual ? "hecho" : ""} />)}
        </div>
        <button className="boton boton-principal" onClick={() => (ultima ? onFin() : ir(actual + 1))}>
          {ultima ? textoFinal : t.recorrido.siguiente}
        </button>
      </div>
    </main>
  );
}
