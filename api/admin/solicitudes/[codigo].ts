import { sesionValida } from '../../_lib/auth';
import { query } from '../../_lib/db';
import { error, json, leerJson, ultimoSegmento } from '../../_lib/http';
import { ESTADOS } from '../../_lib/validacion';

const COLUMNAS = `codigo, creada, actualizada, estado, nombre, negocio, ciudad, whatsapp, correo,
  tipo_proyecto, hosting_nivel, hosting_puntos, autorizacion_datos, notas, datos`;

/** Detalle completo de una solicitud. */
export async function GET(request: Request): Promise<Response> {
  if (!sesionValida(request)) return error('No autorizado', 401);
  const filas = await query(`SELECT ${COLUMNAS} FROM solicitudes WHERE codigo = $1`, [
    ultimoSegmento(request),
  ]);
  return filas.length ? json(filas[0]) : error('No encontrada', 404);
}

/** Cambia el estado o las notas internas. */
export async function PATCH(request: Request): Promise<Response> {
  if (!sesionValida(request)) return error('No autorizado', 401);
  const cuerpo = await leerJson<{ estado?: unknown; notas?: unknown }>(request, 20_000);
  if (!cuerpo) return error('Solicitud inválida', 400);

  const estado = typeof cuerpo.estado === 'string' ? cuerpo.estado : null;
  if (estado !== null && !(ESTADOS as readonly string[]).includes(estado)) {
    return error('Estado inválido', 400);
  }
  const notas = typeof cuerpo.notas === 'string' ? cuerpo.notas.slice(0, 5000) : null;

  const filas = await query(
    `UPDATE solicitudes
        SET estado = COALESCE($2, estado), notas = COALESCE($3, notas), actualizada = now()
      WHERE codigo = $1
      RETURNING ${COLUMNAS}`,
    [ultimoSegmento(request), estado, notas],
  );
  return filas.length ? json(filas[0]) : error('No encontrada', 404);
}
