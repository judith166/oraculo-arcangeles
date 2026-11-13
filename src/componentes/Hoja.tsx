import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { t } from "@/contenido";
import { IconoCerrar } from "./Iconos";

/** Panel que sube desde abajo (mensaje completo, ajustes). */
export function Hoja({ abierta, titulo, onCerrar, children }: { abierta: boolean; titulo: string; onCerrar: () => void; children: ReactNode }) {
  const cerrar = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!abierta) return;
    const previo = document.activeElement as HTMLElement | null;
    cerrar.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    addEventListener("keydown", tecla);
    return () => { removeEventListener("keydown", tecla); previo?.focus?.(); };
  }, [abierta, onCerrar]);

  return (
    <AnimatePresence>
      {abierta && (
        <motion.div className="hoja-velo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={onCerrar}>
          <motion.div
            className="hoja" role="dialog" aria-modal="true" aria-label={titulo}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hoja-asa" aria-hidden="true" />
            <button ref={cerrar} className="icono-boton hoja-cerrar" onClick={onCerrar} aria-label={t.carta.cerrar}><IconoCerrar /></button>
            <div className="hoja-cuerpo">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
