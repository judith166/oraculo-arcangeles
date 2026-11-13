// Pequeñas animaciones con el estilo de las cartas para la bienvenida y el tutorial.
import { useEffect, useState } from "react";
import { dorso, type Carta } from "@/contenido";
import { CartaVista } from "./CartaVista";

export function EmblemaMazo() {
  return (
    <div className="espera-mazo emblema-mazo">
      <span className="mazo-aura" />
      {[0, 1, 2].map((i) => <img key={i} src={dorso} alt="" style={{ "--i": i } as React.CSSProperties} />)}
    </div>
  );
}

const TONOS = ["#FFFFFF", "#FFD9EC", "#E4D4FF", "#CFE8FF", "#FFF1C2", "#FFD0C2", "#F3D9FF"];
/** El halo con alas de la respiración, latiendo solo. */
export function EmblemaHalo() {
  const [fase, setFase] = useState<"inspira" | "espira">("espira");
  useEffect(() => {
    const primero = setTimeout(() => setFase("inspira"), 200);
    const id = setInterval(() => setFase((f) => (f === "inspira" ? "espira" : "inspira")), 3600);
    return () => { clearTimeout(primero); clearInterval(id); };
  }, []);
  const ala = (lado: string) => (
    <div className={`ala ala-${lado}`}>
      {TONOS.map((tono, i) => <span key={i} className="pluma" style={{ "--i": i - 3, "--tono": tono } as React.CSSProperties} />)}
    </div>
  );
  return (
    <div className="respira emblema-halo" data-fase={fase} style={{ "--inspira": "3400ms", "--espira": "3400ms" } as React.CSSProperties}>
      {ala("izq")}{ala("der")}
      <div className="respira-aura" />
      <div className="respira-aro" />
    </div>
  );
}

export function EmblemaAbanico() {
  return (
    <div className="emblema-abanico">
      {[0, 1, 2, 3, 4].map((i) => <img key={i} src={dorso} alt="" style={{ "--i": i - 2 } as React.CSSProperties} />)}
    </div>
  );
}

/** Una carta con su halo. Con `gira`, se voltea sola una y otra vez. */
export function EmblemaCarta({ carta, gira = false }: { carta: Carta; gira?: boolean }) {
  const [arriba, setArriba] = useState(!gira);
  useEffect(() => {
    if (!gira) return;
    const primero = setTimeout(() => setArriba(true), 900);
    const id = setInterval(() => setArriba((v) => !v), 3800);
    return () => { clearTimeout(primero); clearInterval(id); };
  }, [gira]);
  return (
    <div className={`carta-marco emblema-carta ${arriba ? "revelada" : ""}`} style={{ "--rayo": carta.rayo.color } as React.CSSProperties}>
      <div className="carta-halo" />
      <CartaVista carta={carta} bocaArriba={arriba} />
    </div>
  );
}
