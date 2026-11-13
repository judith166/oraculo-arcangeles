/** true si el usuario (ajuste de la app o del sistema) pide menos movimiento. */
export function calma(): boolean {
  return (
    document.documentElement.dataset.calma === "1" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
export function hexARgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
export const temaActual = () => (document.documentElement.dataset.tema === "claro" ? "claro" : "oscuro");
