import { useState } from "react";
import { config } from "@/config";
import { cartaPorId, dorso, t } from "@/contenido";
import { actualizarAjustes, useEstado, type Tirada } from "@/store/estado";
import { CartaDelDia } from "@/componentes/CartaDelDia";
import { IconoAjustes, IconoCamino, IconoLuna, IconoSol } from "@/componentes/Iconos";
import { Ajustes } from "./Ajustes";

export function Hoy({ tirada, onRitual, onRapida, onRepaso, onCamino }: { tirada?: Tirada; onRitual: () => void; onRapida: () => void; onRepaso: () => void; onCamino: () => void }) {
  const [ajustes, setAjustes] = useState(false);
  const [viendo, setViendo] = useState(false);
  const carta = tirada && cartaPorId(tirada.cartaId);
  // Con la regla de una tirada al día, si ya hay carta solo se puede volver a verla.
  const puedeTirar = !carta || !config.unaTiradaPorDia || config.modoPrueba;
  const { tema } = useEstado().ajustes;
  const claro = tema === "claro" || (tema === "auto" && matchMedia("(prefers-color-scheme: light)").matches);

  return (
    <main className="pantalla hoy">
      <header className="barra">
        <button className="boton boton-pastilla" onClick={onCamino}><IconoCamino />{t.hoy.camino}</button>
        <div className="barra-botones">
          <button className="icono-boton" onClick={() => actualizarAjustes({ tema: claro ? "oscuro" : "claro" })} aria-label={claro ? t.ajustes.cambiarAOscuro : t.ajustes.cambiarAClaro}>
            {claro ? <IconoLuna /> : <IconoSol />}
          </button>
          <button className="icono-boton" onClick={() => setAjustes(true)} aria-label={t.ajustes.abrir}><IconoAjustes /></button>
        </div>
      </header>

      {carta && viendo ? (
        <CartaDelDia
          key={tirada!.id} carta={carta}
          pie={
            <>
              <p className="nota">{t.hoy.acompana}</p>
              <button className="boton boton-texto" onClick={() => setViendo(false)}>{t.carta.volver}</button>
            </>
          }
        />
      ) : (
        <div className="espera">
          <div className="espera-mazo" aria-hidden="true">
            <span className="mazo-aura" />
            {[0, 1, 2].map((i) => <img key={i} src={dorso} alt="" style={{ "--i": i } as React.CSSProperties} />)}
          </div>
          {puedeTirar ? (
            <>
              <h1 className="titulo">{t.hoy.espera}</h1>
              <p className="guia">{t.hoy.esperaSub}</p>
              <button className="boton boton-principal" onClick={onRitual}>{t.hoy.comenzar}</button>
              <button className="boton boton-suave boton-ancho" onClick={onRapida}>{t.hoy.rapida}</button>
              <p className="nota">{t.hoy.rapidaSub}</p>
              {carta && <button className="boton boton-texto" onClick={() => setViendo(true)}>{t.hoy.verCarta} · {carta.nombre}</button>}
            </>
          ) : (
            <>
              <h1 className="titulo">{t.hoy.yaTienes}</h1>
              <p className="guia">{t.hoy.acompana}</p>
              <button className="boton boton-principal" onClick={() => setViendo(true)}>{t.hoy.verCarta}</button>
            </>
          )}
        </div>
      )}
      <Ajustes abierta={ajustes} onCerrar={() => setAjustes(false)} onRepaso={onRepaso} />
    </main>
  );
}
