# Pendientes

Cosas aplazadas a propósito. Cada una indica qué falta y dónde retomarla.

## Notificaciones diarias (aplazado el 13-11-2026)

De momento no son necesarias. Estado actual:

- La interfaz está hecha pero **oculta**: `config.avisos = false` en `src/config.ts`.
  Al ponerlo en `true` reaparece el «Aviso diario» (interruptor + hora) en Ajustes y en el último paso del tutorial.
- Los ajustes ya se guardan en el dispositivo (`ajustes.notificaciones`: activa, hora, afirmacionTarde).
- **Falta el envío real.** Plan acordado: Web Push con un micro-servicio en Cloudflare Workers (la cuenta ya existe)
  que guarde solo la suscripción anónima, la hora y la zona horaria.
  - Mañana: «Los arcángeles tienen un mensaje para ti hoy». Al tocarla se abre el ritual.
  - Tarde (opcional): texto genérico, sin enviar al servidor qué carta salió.
  - iPhone: requiere iOS 16.4+ y la app añadida a la pantalla de inicio.
- Al activarlo, quitar la nota `avisos.pendiente` de `content/es/textos.json`.

## Regla de una tirada al día

En la versión de prueba las tiradas son libres (`config.modoPrueba = true`).
Para el diseño final: poner `modoPrueba` en `false` y diseñar bien la pantalla
«Este es el Arcángel que hoy te acompaña. Para una nueva tirada, vuelve mañana»
(hay una base sencilla en `src/pantallas/Hoy.tsx`). Decidir también si en «Mi camino»
cuenta solo una tirada por día.

## Resto de la V1

- README y guía de diseño.
- Imágenes definitivas sin marca de agua (`material/ilustraciones` + `scripts/preparar-imagenes.sh`).
- Icono definitivo de la app.
- Validar con el autor los colores de rayo y las frases de `content/es/revision-autor.json`.
- Probar en teléfonos reales (sonido, vibración, instalación como app).
