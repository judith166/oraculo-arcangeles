// Sonidos sintetizados con Web Audio: sin archivos, sin licencias, funcionan
// sin conexión. Para usar grabaciones reales, sustituye el cuerpo de cada función.
let ctx: AudioContext | null = null;
let activo = false;

function audio(): AudioContext | null {
  if (!activo) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch { return null; }
}

/** Llamar desde un gesto del usuario al activar el sonido. */
export function configurarSonido(encendido: boolean) {
  activo = encendido;
  if (encendido) audio();
}

/** Cuenco tibetano: parciales inarmónicos con batido lento y cola larga. */
export function cuenco() {
  const c = audio();
  if (!c) return;
  const ahora = c.currentTime;
  const salida = c.createGain();
  salida.gain.value = 0.42;
  salida.connect(c.destination);
  const parciales: [number, number, number][] = [[1, 0.5, 8], [2.71, 0.26, 6], [5.15, 0.1, 3.6], [8.2, 0.04, 2]];
  for (const [mult, volumen, cola] of parciales) {
    for (const batido of [0, 0.9]) {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = 196 * mult + batido;
      g.gain.setValueAtTime(0.0001, ahora);
      g.gain.exponentialRampToValueAtTime(volumen / 2, ahora + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, ahora + cola);
      o.connect(g).connect(salida);
      o.start(ahora);
      o.stop(ahora + cola + 0.1);
    }
  }
}

/** Campanita de luz: al abrir el abanico y al elegir. */
export function campanita(nota = 880) {
  const c = audio();
  if (!c) return;
  const ahora = c.currentTime;
  for (const [f, v] of [[nota, 0.12], [nota * 1.5, 0.05]] as const) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, ahora);
    g.gain.exponentialRampToValueAtTime(v, ahora + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ahora + 1.6);
    o.connect(g).connect(c.destination);
    o.start(ahora);
    o.stop(ahora + 1.7);
  }
}

export function vibrar(patron: number | number[]) {
  try { navigator.vibrate?.(patron); } catch { /* iOS no vibra desde la web */ }
}
