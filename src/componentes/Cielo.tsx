import { useEffect, useRef } from "react";
import { luz } from "@/lib/luz";

/** Fondo de toda la app: gradiente de cielo, auroras teñidas del rayo y partículas. */
export function Cielo() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) luz.montar(ref.current);
    return () => luz.desmontar();
  }, []);
  return (
    <div className="cielo" aria-hidden="true">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <canvas ref={ref} className="cielo-lienzo" />
    </div>
  );
}
