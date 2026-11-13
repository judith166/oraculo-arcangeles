import { config } from "@/config";
import { cartaPorId, cartas, con, t } from "@/contenido";
import { Recorrido, type Pagina } from "@/componentes/Recorrido";
import { EmblemaAbanico, EmblemaCarta, EmblemaHalo, EmblemaMazo } from "@/componentes/Emblemas";
import { AvisoDiario, GuiaIos, SelectorModo, faltaInstalarEnIos } from "@/componentes/Preferencias";

/** Bienvenida: tres pantallas con el espíritu del libro, adaptado a la app. */
export function Bienvenida({ onFin }: { onFin: () => void }) {
  const emblemas = [<EmblemaMazo />, <EmblemaHalo />, <EmblemaAbanico />];
  const paginas: Pagina[] = t.bienvenida.paginas.map((p, i) => ({ clave: `b${i}`, emblema: emblemas[i], titulo: p.titulo, texto: p.texto }));
  return <Recorrido paginas={paginas} textoFinal={t.bienvenida.continuar} onFin={onFin} onSaltar={onFin} />;
}

/** Tutorial: cómo funciona la app, en cinco pasos. Termina en el primer ritual. */
export function Tutorial({ onRitual, onSaltar }: { onRitual: () => void; onSaltar: () => void }) {
  const miguel = cartaPorId("miguel") ?? cartas[0];
  const jofiel = cartaPorId("jofiel") ?? cartas[0];
  const emblemas = [<EmblemaMazo />, <EmblemaHalo />, <EmblemaCarta carta={miguel} gira />, <EmblemaCarta carta={jofiel} />, null];
  const total = t.tutorial.pasos.length;
  const paginas: Pagina[] = t.tutorial.pasos.map((p, i) => ({
    clave: `t${i}`, emblema: emblemas[i], titulo: p.titulo, texto: p.texto,
    antetitulo: con(t.tutorial.paso, { n: i + 1, total }),
    extra: i === total - 1 ? (
      <div className="ajustes ajustes-tutorial">
        <SelectorModo />
        {config.avisos && <AvisoDiario />}
        {faltaInstalarEnIos() && <GuiaIos />}
      </div>
    ) : undefined,
  }));
  return <Recorrido paginas={paginas} textoFinal={t.tutorial.empezar} onFin={onRitual} onSaltar={onSaltar} />;
}
