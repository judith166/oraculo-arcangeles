import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cartas, dorso, t, type Carta } from "@/contenido";
import { elegirCarta } from "@/lib/azar";
import { diaLocal } from "@/lib/fecha";
import { actualizarAjustes, leerEstado, registrarTirada, useEstado } from "@/store/estado";
import { configurarSonido } from "@/lib/sonido";
import { CartaDelDia, type Origen } from "@/componentes/CartaDelDia";
import { IconoCerrar, IconoSilencio, IconoSonido } from "@/componentes/Iconos";
import { Respiracion } from "./Respiracion";
import { Elegir } from "./Elegir";

type Etapa = "entrada" | "respiracion" | "intencion" | "elegir" | "revelar";

const paso = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.5 } },
} as const;

/**
 * El ritual de la carta del día, de la calma a la revelación.
 * Con `rapida` va directo al abanico: una tirada sin pasos previos.
 */
export function Ritual({ onSalir, rapida = false }: { onSalir: () => void; rapida?: boolean }) {
  const { ajustes } = useEstado();
  const [etapa, setEtapa] = useState<Etapa>(rapida ? "elegir" : "entrada");
  const [intencion, setIntencion] = useState("");
  const [carta, setCarta] = useState<Carta | null>(null);
  const [origen, setOrigen] = useState<Origen | undefined>();

  const aIntencion = useCallback(() => setEtapa("intencion"), []);
  const revelar = useCallback((desde: Origen) => {
    const elegida = elegirCarta(cartas, leerEstado().tiradas);
    registrarTirada({ tipo: "diaria", fecha: diaLocal(), cartaId: elegida.id, intencion: intencion.trim() || undefined, modo: rapida ? "rapida" : "ritual" });
    setCarta(elegida);
    setOrigen(desde);
    setEtapa("revelar");
  }, [intencion, rapida]);

  function alternarSonido() {
    configurarSonido(!ajustes.sonido);
    actualizarAjustes({ sonido: !ajustes.sonido });
  }

  return (
    <main className="pantalla ritual">
      <header className="barra">
        <button className="icono-boton" onClick={onSalir} aria-label={t.ritual.salir}><IconoCerrar /></button>
        <button className="icono-boton" onClick={alternarSonido} aria-pressed={ajustes.sonido} aria-label={ajustes.sonido ? t.ritual.sonidoOff : t.ritual.sonidoOn}>
          {ajustes.sonido ? <IconoSonido /> : <IconoSilencio />}
        </button>
      </header>

      <AnimatePresence mode="wait">
        {/* elegir y revelar comparten clave: la carta elegida viaja sin corte de una a otra */}
        <motion.div key={etapa === "revelar" ? "elegir" : etapa} className="etapa-marco" {...paso}>
          {etapa === "entrada" && (
            <div className="etapa etapa-entrada">
              <h1 className="titulo">{t.ritual.entrada.titulo}</h1>
              <p className="guia">{t.ritual.entrada.texto}</p>
              <div className="mazo-reposo" aria-hidden="true">
                <span className="mazo-aura" />
                {[0, 1, 2, 3, 4].map((i) => <img key={i} src={dorso} alt="" style={{ "--i": i } as React.CSSProperties} />)}
              </div>
              <button className="boton boton-principal" onClick={() => setEtapa("respiracion")}>{t.ritual.entrada.boton}</button>
            </div>
          )}
          {etapa === "respiracion" && <Respiracion onFin={aIntencion} />}
          {etapa === "intencion" && (
            <form className="etapa etapa-intencion" onSubmit={(e) => { e.preventDefault(); setEtapa("elegir"); }}>
              <h1 className="titulo">{t.ritual.intencion.titulo}</h1>
              <p className="guia">{t.ritual.intencion.texto}</p>
              <label className="campo">
                <span className="solo-lectores">{t.ritual.intencion.etiqueta}</span>
                <textarea value={intencion} onChange={(e) => setIntencion(e.target.value)} placeholder={t.ritual.intencion.ejemplo} rows={3} maxLength={280} />
              </label>
              {/* El botón va pegado al campo para que el teclado del móvil no lo tape. */}
              <button className="boton boton-principal" type="submit">{intencion.trim() ? t.ritual.intencion.continuar : t.ritual.intencion.silencio}</button>
              <p className="nota">{t.ritual.intencion.privado}</p>
            </form>
          )}
          {etapa === "elegir" && <Elegir onElegida={revelar} />}
          {etapa === "revelar" && carta && (
            <CartaDelDia carta={carta} revelar origen={origen} pie={<button className="boton boton-texto" onClick={onSalir}>{t.carta.volver}</button>} />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
