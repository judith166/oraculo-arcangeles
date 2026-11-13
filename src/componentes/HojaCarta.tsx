import type { ReactNode } from "react";
import { con, t, type Carta } from "@/contenido";
import { Hoja } from "./Hoja";

/** El mensaje completo de una carta en un panel. `cabecera` va antes del nombre. */
export function HojaCarta({ carta, abierta, onCerrar, cabecera }: { carta: Carta; abierta: boolean; onCerrar: () => void; cabecera?: ReactNode }) {
  return (
    <Hoja abierta={abierta} titulo={carta.nombre} onCerrar={onCerrar}>
      <div className="hoja-carta" style={{ "--rayo": carta.rayo.color, "--rayo-tinta": carta.rayo.tinta } as React.CSSProperties}>
        {cabecera}
        <p className="carta-rayo">{con(t.carta.rayo, { nombre: carta.rayo.nombre })}</p>
        <h2 className="carta-nombre">{carta.nombre}</h2>
        <p className="carta-atributos">{carta.atributos.join(" · ")}</p>
        <div className="carta-regla" aria-hidden="true" />
        <div className="contexto-cita">
          {carta.mensajePrincipal.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="contexto">
          {carta.contexto.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </Hoja>
  );
}
