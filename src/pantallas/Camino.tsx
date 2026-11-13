import { useMemo, useState } from "react";
import { con, t } from "@/contenido";
import { leerCamino } from "@/lib/camino";
import { ayerLocal, diaLocal } from "@/lib/fecha";
import { useEstado, type Tirada } from "@/store/estado";
import { EmblemaCarta } from "@/componentes/Emblemas";
import { HojaCarta } from "@/componentes/HojaCarta";
import { IconoAtras } from "@/componentes/Iconos";

const veces = (n: number) => (n === 1 ? t.camino.contadorUna : con(t.camino.contador, { n }));

function etiquetaDia(fecha: string): string {
  if (fecha === diaLocal()) return t.camino.hoy;
  if (fecha === ayerLocal()) return t.camino.ayer;
  const [a, m, d] = fecha.split("-").map(Number);
  const s = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(new Date(a, m - 1, d));
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const hora = (iso: string) => new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

/** Mi camino: el Arcángel que más te acompaña y el historial de tiradas. */
export function Camino({ onVolver }: { onVolver: () => void }) {
  const { tiradas } = useEstado();
  const camino = useMemo(() => leerCamino(tiradas), [tiradas]);
  const [abierta, setAbierta] = useState<Tirada | null>(null);
  const [visible, setVisible] = useState(false);
  const seleccion = abierta && camino.historial.find((h) => h.tirada.id === abierta.id);
  const p = camino.principal;
  const maximo = p?.veces ?? 1;

  let diaPrevio = "";
  return (
    <main className="pantalla camino">
      <header className="barra">
        <button className="icono-boton" onClick={onVolver} aria-label={t.camino.volver}><IconoAtras /></button>
        <h1 className="camino-titulo">{t.camino.titulo}</h1>
        <span className="barra-hueco" aria-hidden="true" />
      </header>

      {!p ? (
        <div className="espera">
          <h2 className="titulo">{t.camino.vacioTitulo}</h2>
          <p className="guia">{t.camino.vacioTexto}</p>
        </div>
      ) : (
        <>
          <section className="camino-principal" style={{ "--rayo": p.carta.rayo.color, "--rayo-tinta": p.carta.rayo.tinta } as React.CSSProperties}>
            <div className="emblema"><EmblemaCarta carta={p.carta} /></div>
            <p className="carta-rayo">{t.camino.principal}</p>
            <h2 className="carta-nombre">{p.carta.nombre}</h2>
            <p className="camino-veces">{p.veces === 1 ? t.camino.vez : con(t.camino.veces, { n: p.veces })}</p>
            <p className="carta-atributos">{p.carta.atributos.join(" · ")}</p>
            <div className="carta-regla" aria-hidden="true" />
            <p className="nota">{camino.total === 1 ? t.camino.tirada : con(t.camino.tiradas, { n: camino.total })} · {camino.dias === 1 ? t.camino.dia : con(t.camino.dias, { n: camino.dias })}</p>
          </section>

          <section className="camino-seccion">
            <h2 className="camino-subtitulo">{t.camino.arcangeles}</h2>
            <ul className="ranking">
              {camino.ranking.map((c) => (
                <li key={c.carta.id} style={{ "--rayo": c.carta.rayo.color, "--parte": c.veces / maximo } as React.CSSProperties}>
                  <span className="ranking-nombre">{c.carta.nombre}</span>
                  <span className="ranking-veces">{veces(c.veces)}</span>
                  <span className="ranking-barra" aria-hidden="true"><i /></span>
                </li>
              ))}
            </ul>
          </section>

          <section className="camino-seccion">
            <h2 className="camino-subtitulo">{t.camino.historial}</h2>
            <ul className="historial">
              {camino.historial.map(({ tirada, carta }) => {
                const nuevoDia = tirada.fecha !== diaPrevio;
                diaPrevio = tirada.fecha;
                return (
                  <li key={tirada.id}>
                    {nuevoDia && <p className="historial-dia">{etiquetaDia(tirada.fecha)}</p>}
                    <button className="historial-fila" style={{ "--rayo": carta.rayo.color } as React.CSSProperties} onClick={() => { setAbierta(tirada); setVisible(true); }}>
                      <img src={carta.imagen} alt="" draggable={false} />
                      <span>
                        <b>{carta.nombre}</b>
                        <small>{hora(tirada.creada)} · {tirada.modo === "rapida" ? t.camino.rapida : t.camino.ritual}</small>
                        {tirada.intencion && <em>«{tirada.intencion}»</em>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      {seleccion && (
        <HojaCarta
          carta={seleccion.carta} abierta={visible} onCerrar={() => setVisible(false)}
          cabecera={
            <>
              <img className="hoja-miniatura" src={seleccion.carta.imagen} alt="" draggable={false} />
              <p className="nota">{etiquetaDia(seleccion.tirada.fecha)} · {hora(seleccion.tirada.creada)}</p>
              {seleccion.tirada.intencion && <p className="hoja-intencion"><small>{t.camino.intencion}</small>«{seleccion.tirada.intencion}»</p>}
            </>
          }
        />
      )}
    </main>
  );
}
