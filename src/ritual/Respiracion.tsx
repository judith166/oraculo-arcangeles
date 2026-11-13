import { useEffect, useState } from "react";
import { config } from "@/config";
import { t } from "@/contenido";

const PLUMAS = 7;
const TONOS = ["#FFFFFF", "#FFD9EC", "#E4D4FF", "#CFE8FF", "#FFF1C2", "#FFD0C2", "#F3D9FF"];

/** Un halo de luz del que se despliegan alas al inspirar y se recogen al espirar. */
export function Respiracion({ onFin }: { onFin: () => void }) {
  const { ciclos, inspiraMs, espiraMs } = config.respiracion;
  const [fase, setFase] = useState<"reposo" | "inspira" | "espira">("reposo");
  const [ciclo, setCiclo] = useState(0);

  useEffect(() => {
    const esperas: ReturnType<typeof setTimeout>[] = [];
    let cuando = 700;
    for (let i = 0; i < ciclos; i++) {
      esperas.push(setTimeout(() => { setCiclo(i); setFase("inspira"); }, cuando));
      cuando += inspiraMs;
      esperas.push(setTimeout(() => setFase("espira"), cuando));
      cuando += espiraMs;
    }
    esperas.push(setTimeout(onFin, cuando + 300));
    return () => esperas.forEach(clearTimeout);
  }, [ciclos, inspiraMs, espiraMs, onFin]);

  const ala = (lado: "izq" | "der") => (
    <div className={`ala ala-${lado}`}>
      {Array.from({ length: PLUMAS }, (_, i) => (
        <span key={i} className="pluma" style={{ "--i": i - (PLUMAS - 1) / 2, "--tono": TONOS[i] } as React.CSSProperties} />
      ))}
    </div>
  );

  return (
    <div className="etapa etapa-respiracion">
      <p className="guia">{t.ritual.respiracion.guia}</p>
      <div
        className="respira" data-fase={fase} aria-hidden="true"
        style={{ "--inspira": `${inspiraMs}ms`, "--espira": `${espiraMs}ms` } as React.CSSProperties}
      >
        {ala("izq")}{ala("der")}
        <div className="respira-aura" />
        <div className="respira-aro" />
      </div>
      <p className="respira-texto" aria-live="assertive">
        <span key={fase}>{fase === "espira" ? t.ritual.respiracion.espira : fase === "inspira" ? t.ritual.respiracion.inspira : " "}</span>
      </p>
      <div className="puntos" aria-hidden="true">
        {Array.from({ length: ciclos }, (_, i) => <i key={i} className={i <= ciclo && fase !== "reposo" ? "hecho" : ""} />)}
      </div>
      <button className="boton boton-texto" onClick={onFin}>{t.ritual.respiracion.saltar}</button>
    </div>
  );
}
