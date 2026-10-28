import { sesionValida } from '../../_lib/auth';
import { query } from '../../_lib/db';
import { error, json } from '../../_lib/http';
import { ESTADOS } from '../../_lib/validacion';

/** Lista de solicitudes para el panel, con filtro por estado y búsqueda. */
export async function GET(request: Request): Promise<Response> {
  if (!sesionValida(request)) return error('No autorizado', 401);

  const url = new URL(request.url);
  const estado = url.searchParams.get('estado') ?? '';
  const buscar = (url.searchParams.get('q') ?? '').trim().slice(0, 100);

  const condiciones: string[] = [];
  const parametros: unknown[] = [];
  if ((ESTADOS as readonly string[]).includes(estado)) {
    parametros.push(estado);
    condiciones.push(`estado = $${parametros.length}`);
  }
  if (buscar) {
    parametros.push(`%${buscar}%`);
    const p = `$${parametros.length}`;
    condiciones.push(
      `(nombre ILIKE ${p} OR negocio ILIKE ${p} OR ciudad ILIKE ${p} OR whatsapp ILIKE ${p} OR codigo ILIKE ${p})`,
    );
  }

  const filas = await query(
    `SELECT codigo, creada, actualizada, estado, nombre, negocio, ciudad, whatsapp, correo,
            tipo_proyecto, hosting_nivel, hosting_puntos
       FROM solicitudes
       ${condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''}
      ORDER BY creada DESC
      LIMIT 200`,
    parametros,
  );
  const conteo = await query(
    `SELECT estado, count(*)::int AS total FROM solicitudes GROUP BY estado`,
  );
  return json({ solicitudes: filas, conteo });
}
