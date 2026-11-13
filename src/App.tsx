import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cielo } from "@/componentes/Cielo";
import { diaLocal, msHastaMedianoche } from "@/lib/fecha";
import { configurarSonido } from "@/lib/sonido";
import { leerEstado, marcarVisto, tiradaDe, useEstado, type Ajustes } from "@/store/estado";
import { Bienvenida, Tutorial } from "@/pantallas/Introduccion";
import { Hoy } from "@/pantallas/Hoy";
import { Ritual } from "@/ritual/Ritual";
import { Camino } from "@/pantallas/Camino";

/** Aplica tema, modo calma y sonido al documento. */
function useAmbiente(ajustes: Ajustes) {
  useEffect(() => {
    const raiz = document.documentElement;
    const sistema = matchMedia("(prefers-color-scheme: light)");
    const aplicar = () => {
      const tema = ajustes.tema === "auto" ? (sistema.matches ? "claro" : "oscuro") : ajustes.tema;
      raiz.dataset.tema = tema;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", tema === "claro" ? "#FBF8F2" : "#0B0A24");
    };
    aplicar();
    sistema.addEventListener("change", aplicar);
    return () => sistema.removeEventListener("change", aplicar);
  }, [ajustes.tema]);
  useEffect(() => {
    const sistema = matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => {
      if (ajustes.reducirAnimaciones || sistema.matches) document.documentElement.dataset.calma = "1";
      else delete document.documentElement.dataset.calma;
    };
    aplicar();
    sistema.addEventListener("change", aplicar);
    return () => sistema.removeEventListener("change", aplicar);
  }, [ajustes.reducirAnimaciones]);
  useEffect(() => { configurarSonido(ajustes.sonido); }, [ajustes.sonido]);
}

export function App() {
  const estado = useEstado();
  useAmbiente(estado.ajustes);
  const [modo, setModo] = useState<"bienvenida" | "tutorial" | "hoy" | "ritual" | "rapida" | "camino">(() => {
    const e = leerEstado();
    return !e.bienvenidaVista ? "bienvenida" : !e.tutorialVisto ? "tutorial" : "hoy";
  });
  const [hoy, setHoy] = useState(diaLocal);

  // A medianoche (o al volver a la app otro día) se libera una tirada nueva.
  useEffect(() => {
    const revisar = () => setHoy(diaLocal());
    const id = setTimeout(revisar, msHastaMedianoche());
    document.addEventListener("visibilitychange", revisar);
    return () => { clearTimeout(id); document.removeEventListener("visibilitychange", revisar); };
  }, [hoy]);

  const tirada = tiradaDe(estado, hoy);

  return (
    <>
      <Cielo />
      <AnimatePresence mode="wait">
        <motion.div
          key={modo === "rapida" ? "ritual" : modo} className="vista"
          initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.8 } }} exit={{ opacity: 0, transition: { duration: 0.45 } }}
        >
          {modo === "bienvenida" && <Bienvenida onFin={() => { marcarVisto("bienvenidaVista"); setModo("tutorial"); }} />}
          {modo === "tutorial" && (
            <Tutorial
              onRitual={() => { marcarVisto("tutorialVisto"); setModo("ritual"); }}
              onSaltar={() => { marcarVisto("tutorialVisto"); setModo("hoy"); }}
            />
          )}
          {modo === "hoy" && <Hoy tirada={tirada} onRitual={() => setModo("ritual")} onRapida={() => setModo("rapida")} onRepaso={() => setModo("bienvenida")} onCamino={() => setModo("camino")} />}
          {modo === "camino" && <Camino onVolver={() => setModo("hoy")} />}
          {(modo === "ritual" || modo === "rapida") && <Ritual rapida={modo === "rapida"} onSalir={() => setModo("hoy")} />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
