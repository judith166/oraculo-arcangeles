/** Fecha local AAAA-MM-DD (el día cambia a medianoche del dispositivo). */
export function diaLocal(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function ayerLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return diaLocal(d);
}
/** Milisegundos que faltan para la próxima medianoche local. */
export function msHastaMedianoche(): number {
  const d = new Date();
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 2);
  return m.getTime() - d.getTime();
}
