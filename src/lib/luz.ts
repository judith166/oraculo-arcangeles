// Motor de partículas de luz: un solo canvas para toda la app.
// - Estrellas/motas de fondo que parpadean y reaccionan al dedo.
// - Chispas que se emiten desde el ritual (barajar, elegir, revelar).
// Versión ligera automática: menos partículas en pantallas grandes de poca
// potencia, pausa con la pestaña oculta y nada de movimiento en modo calma.
import { calma, temaActual } from "./movimiento";

interface Estrella { x: number; y: number; r: number; fase: number; vel: number; tono: string; brillo: number }
interface Chispa { x: number; y: number; vx: number; vy: number; vida: number; max: number; r: number; tono: string }

const TONOS = {
  oscuro: ["255,255,255", "255,255,255", "233,196,106", "185,179,214"],
  claro: ["226,184,79", "226,184,79", "155,107,255", "236,140,180"],
};
const MAX_CHISPAS = 240;

class Luz {
  private canvas: HTMLCanvasElement | null = null;
  private g: CanvasRenderingContext2D | null = null;
  private w = 0; private h = 0;
  private estrellas: Estrella[] = [];
  private chispas: Chispa[] = [];
  private puntero = { x: -999, y: -999 };
  private raf = 0; private ultimo = 0; private tema = "";

  montar(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.g = canvas.getContext("2d");
    this.medir();
    addEventListener("resize", this.medir);
    addEventListener("pointermove", this.mover, { passive: true });
    addEventListener("pointerdown", this.mover, { passive: true });
    document.addEventListener("visibilitychange", this.visibilidad);
    this.raf = requestAnimationFrame(this.cuadro);
  }
  desmontar() {
    cancelAnimationFrame(this.raf);
    removeEventListener("resize", this.medir);
    removeEventListener("pointermove", this.mover);
    removeEventListener("pointerdown", this.mover);
    document.removeEventListener("visibilitychange", this.visibilidad);
    this.canvas = null; this.g = null;
  }

  /** Emite n chispas desde (x, y) en coordenadas de pantalla. tono = "r,g,b". */
  emitir(x: number, y: number, n: number, tono = "233,196,106", fuerza = 1) {
    if (calma()) return;
    for (let i = 0; i < n && this.chispas.length < MAX_CHISPAS; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = (0.02 + Math.random() * 0.09) * fuerza;
      const max = 700 + Math.random() * 1100;
      this.chispas.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.015,
        vida: max, max, r: 0.8 + Math.random() * 1.8,
        tono: Math.random() < 0.3 ? "255,255,255" : tono,
      });
    }
  }

  private medir = () => {
    if (!this.canvas || !this.g) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = innerWidth; this.h = innerHeight;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.sembrar();
  };
  private sembrar() {
    const tema = temaActual();
    this.tema = tema;
    const n = Math.min(110, Math.round((this.w * this.h) / 7500));
    const tonos = TONOS[tema];
    this.estrellas = Array.from({ length: n }, () => ({
      x: Math.random() * this.w, y: Math.random() * this.h,
      r: (tema === "claro" ? 0.9 : 0.5) + Math.random() ** 2 * 1.5,
      fase: Math.random() * 6.28, vel: 0.0006 + Math.random() * 0.0016,
      tono: tonos[Math.floor(Math.random() * tonos.length)], brillo: 0,
    }));
  }
  private mover = (e: PointerEvent) => { this.puntero.x = e.clientX; this.puntero.y = e.clientY; };
  private visibilidad = () => {
    cancelAnimationFrame(this.raf);
    if (!document.hidden) { this.ultimo = 0; this.raf = requestAnimationFrame(this.cuadro); }
  };

  private cuadro = (ahora: number) => {
    const g = this.g;
    if (!g) return;
    const dt = this.ultimo ? Math.min(ahora - this.ultimo, 50) : 16;
    this.ultimo = ahora;
    const tema = temaActual();
    if (tema !== this.tema) this.sembrar();
    const quieto = calma();
    const claro = tema === "claro";
    g.clearRect(0, 0, this.w, this.h);
    g.globalCompositeOperation = claro ? "source-over" : "lighter";

    for (const e of this.estrellas) {
      if (!quieto) {
        e.fase += e.vel * dt;
        e.y -= 0.004 * dt * e.r;
        if (e.y < -4) { e.y = this.h + 4; e.x = Math.random() * this.w; }
        const dx = e.x - this.puntero.x, dy = e.y - this.puntero.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400 && d2 > 1) {
          const d = Math.sqrt(d2), f = (1 - d / 120) * 0.05 * dt;
          e.x += (dx / d) * f; e.y += (dy / d) * f;
          e.brillo = Math.min(1, e.brillo + 0.08);
        }
        e.brillo *= 0.97;
      }
      const base = claro ? 0.5 : 0.75;
      const alfa = Math.min(1, base * (0.45 + 0.55 * Math.sin(e.fase)) + e.brillo * 0.6);
      if (alfa <= 0.02) continue;
      g.fillStyle = `rgba(${e.tono},${alfa.toFixed(3)})`;
      g.beginPath();
      g.arc(e.x, e.y, e.r + e.brillo * 1.2, 0, 6.2832);
      g.fill();
    }

    for (let i = this.chispas.length - 1; i >= 0; i--) {
      const c = this.chispas[i];
      c.vida -= dt;
      if (c.vida <= 0) { this.chispas.splice(i, 1); continue; }
      c.vx *= 0.985; c.vy = c.vy * 0.985 - 0.00003 * dt;
      c.x += c.vx * dt; c.y += c.vy * dt;
      const k = c.vida / c.max;
      g.fillStyle = `rgba(${c.tono},${(k * (claro ? 0.85 : 1)).toFixed(3)})`;
      g.beginPath();
      g.arc(c.x, c.y, c.r * (0.4 + k), 0, 6.2832);
      g.fill();
      if (!claro && c.r > 1.6) {
        g.fillStyle = `rgba(${c.tono},${(k * 0.18).toFixed(3)})`;
        g.beginPath();
        g.arc(c.x, c.y, c.r * 4 * k, 0, 6.2832);
        g.fill();
      }
    }
    this.raf = requestAnimationFrame(this.cuadro);
  };
}

export const luz = new Luz();
