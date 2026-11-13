import { con, dorso, t, type Carta } from "@/contenido";

/** Carta con dos caras y giro 3D. Sin `carta` solo muestra el dorso. */
export function CartaVista({ carta, bocaArriba = false, className = "" }: { carta?: Carta; bocaArriba?: boolean; className?: string }) {
  return (
    <div className={`carta ${bocaArriba ? "boca-arriba" : ""} ${className}`}>
      <div className="carta-giro">
        <img className="carta-cara carta-dorso" src={dorso} alt={bocaArriba ? "" : t.carta.dorso} draggable={false} />
        {carta && (
          <img className="carta-cara carta-frente" src={carta.imagen} alt={bocaArriba ? con(t.carta.ilustracion, { nombre: carta.nombre }) : ""} draggable={false} />
        )}
      </div>
    </div>
  );
}
