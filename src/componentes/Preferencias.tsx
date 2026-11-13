// Controles compartidos entre Ajustes y el último paso del tutorial.
import { useState } from "react";
import { t } from "@/contenido";
import { actualizarAjustes, actualizarAvisos, useEstado, type Tema } from "@/store/estado";

export function Interruptor({ titulo, sub, valor, onCambio }: { titulo: string; sub: string; valor: boolean; onCambio: (v: boolean) => void }) {
  return (
    <button className="ajuste" role="switch" aria-checked={valor} onClick={() => onCambio(!valor)}>
      <span><b>{titulo}</b><small>{sub}</small></span>
      <i className="interruptor" aria-hidden="true" />
    </button>
  );
}

export function SelectorModo() {
  const { ajustes } = useEstado();
  const modos: [Tema, string][] = [["auto", t.ajustes.modoAuto], ["claro", t.ajustes.modoClaro], ["oscuro", t.ajustes.modoOscuro]];
  return (
    <div className="ajuste-grupo" role="radiogroup" aria-label={t.ajustes.modo}>
      <b>{t.ajustes.modo}</b>
      <div className="segmentos">
        {modos.map(([valor, nombre]) => (
          <button key={valor} role="radio" aria-checked={ajustes.tema === valor} onClick={() => actualizarAjustes({ tema: valor })}>{nombre}</button>
        ))}
      </div>
    </div>
  );
}

/** true en iPhone/iPad cuando la app aún no está en la pantalla de inicio. */
export function faltaInstalarEnIos(): boolean {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const instalada = matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
  return ios && !instalada;
}

export function GuiaIos() {
  return (
    <div className="guia-ios">
      <b>{t.avisos.iosTitulo}</b>
      <ol>
        <li>{t.avisos.iosPaso1}</li>
        <li>{t.avisos.iosPaso2}</li>
        <li>{t.avisos.iosPaso3}</li>
      </ol>
    </div>
  );
}

export function AvisoDiario() {
  const { notificaciones } = useEstado().ajustes;
  const [nota, setNota] = useState("");

  async function cambiar(activar: boolean) {
    setNota("");
    if (!activar) return actualizarAvisos({ activa: false });
    if (!("Notification" in window)) return setNota(t.avisos.noDisponible);
    const permiso = await Notification.requestPermission();
    if (permiso === "granted") actualizarAvisos({ activa: true });
    else setNota(t.avisos.denegado);
  }

  return (
    <>
      <Interruptor titulo={t.avisos.titulo} sub={t.avisos.sub} valor={notificaciones.activa} onCambio={cambiar} />
      {notificaciones.activa && (
        <label className="ajuste">
          <b>{t.avisos.hora}</b>
          <input type="time" className="campo-hora" value={notificaciones.hora} onChange={(e) => e.target.value && actualizarAvisos({ hora: e.target.value })} />
        </label>
      )}
      {(nota || notificaciones.activa) && <p className="nota nota-izq" role="status">{nota || t.avisos.pendiente}</p>}
    </>
  );
}
