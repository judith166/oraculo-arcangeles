import { config } from "@/config";
import { t } from "@/contenido";
import { Hoja } from "@/componentes/Hoja";
import { AvisoDiario, GuiaIos, Interruptor, SelectorModo, faltaInstalarEnIos } from "@/componentes/Preferencias";
import { configurarSonido } from "@/lib/sonido";
import { actualizarAjustes, useEstado } from "@/store/estado";

export function Ajustes({ abierta, onCerrar, onRepaso }: { abierta: boolean; onCerrar: () => void; onRepaso: () => void }) {
  const { ajustes } = useEstado();
  return (
    <Hoja abierta={abierta} titulo={t.ajustes.titulo} onCerrar={onCerrar}>
      <h2 className="carta-nombre">{t.ajustes.titulo}</h2>
      <div className="ajustes">
        <SelectorModo />
        {config.avisos && <AvisoDiario />}
        {faltaInstalarEnIos() && <GuiaIos />}
        <Interruptor titulo={t.ajustes.sonido} sub={t.ajustes.sonidoSub} valor={ajustes.sonido}
          onCambio={(v) => { configurarSonido(v); actualizarAjustes({ sonido: v }); }} />
        <Interruptor titulo={t.ajustes.calma} sub={t.ajustes.calmaSub} valor={ajustes.reducirAnimaciones}
          onCambio={(v) => actualizarAjustes({ reducirAnimaciones: v })} />
        <button className="boton boton-texto" onClick={() => { onCerrar(); onRepaso(); }}>{t.ajustes.repaso}</button>
      </div>
    </Hoja>
  );
}
