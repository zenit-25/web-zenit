import { Solicitud } from '../models/solicitud.model';
import { calcularHosting } from './hosting-score';
import { generarCodigo } from './solicitud.store';

export type ResultadoGuardado = 'ok' | 'error';

async function enviar(s: Solicitud, trampa: string): Promise<Response> {
  const hosting = calcularHosting(s);
  return fetch('/api/solicitudes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      solicitud: s,
      website: trampa,
      hosting: { nivel: hosting.nivel.nombre, puntos: hosting.puntos },
    }),
    signal: AbortSignal.timeout(10_000),
  });
}

/**
 * Guarda la solicitud en la base de datos. Si el código ya lo usa otra
 * persona (muy poco probable), genera uno nuevo y reintenta una vez.
 */
export async function guardarSolicitud(s: Solicitud, trampa = ''): Promise<ResultadoGuardado> {
  try {
    let respuesta = await enviar(s, trampa);
    if (respuesta.status === 409) {
      s.codigo = generarCodigo();
      respuesta = await enviar(s, trampa);
    }
    return respuesta.ok ? 'ok' : 'error';
  } catch {
    return 'error';
  }
}
