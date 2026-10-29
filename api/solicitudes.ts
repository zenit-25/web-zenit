import { query } from './_lib/db.js';
import { error, json, leerJson } from './_lib/http.js';
import { validarSolicitud } from './_lib/validacion.js';

interface Cuerpo {
  solicitud?: unknown;
  /** Campo trampa: los humanos no lo ven, los robots suelen llenarlo. */
  website?: string;
  hosting?: { nivel?: unknown; puntos?: unknown };
}

/**
 * Guarda o actualiza la solicitud del configurador. El cliente envía un token
 * propio: solo quien creó la solicitud puede volver a actualizarla.
 */
export async function POST(request: Request): Promise<Response> {
  const cuerpo = await leerJson<Cuerpo>(request);
  if (!cuerpo) return error('Solicitud inválida', 400);
  if (cuerpo.website) return json({ ok: true }); // robot: respondemos normal y no guardamos

  const resultado = validarSolicitud(cuerpo);
  if ('errores' in resultado)
    return json({ error: 'Datos incompletos', detalles: resultado.errores }, 422);
  const s = resultado.solicitud;

  const { token: _token, ...datosSinToken } = s.datos;
  const nivel = typeof cuerpo.hosting?.nivel === 'string' ? cuerpo.hosting.nivel.slice(0, 80) : '';
  const puntos = Number.isInteger(cuerpo.hosting?.puntos) ? Number(cuerpo.hosting?.puntos) : 0;

  try {
    const filas = await query(
      `INSERT INTO solicitudes
         (codigo, token_edicion, nombre, negocio, ciudad, whatsapp, correo, tipo_proyecto,
          hosting_nivel, hosting_puntos, autorizacion_datos, datos)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now(), $11)
       ON CONFLICT (codigo) DO UPDATE SET
         nombre = EXCLUDED.nombre, negocio = EXCLUDED.negocio, ciudad = EXCLUDED.ciudad,
         whatsapp = EXCLUDED.whatsapp, correo = EXCLUDED.correo,
         tipo_proyecto = EXCLUDED.tipo_proyecto, hosting_nivel = EXCLUDED.hosting_nivel,
         hosting_puntos = EXCLUDED.hosting_puntos, datos = EXCLUDED.datos, actualizada = now()
       WHERE solicitudes.token_edicion = EXCLUDED.token_edicion
       RETURNING codigo`,
      [
        s.codigo,
        s.token,
        s.nombre,
        s.negocio,
        s.ciudad,
        s.whatsapp,
        s.correo,
        s.tipo,
        nivel,
        puntos,
        JSON.stringify(datosSinToken),
      ],
    );
    // Sin filas: el código ya existe y pertenece a otra persona.
    if (!filas.length) return error('Código en uso', 409);
    return json({ ok: true, codigo: s.codigo });
  } catch (e) {
    console.error('Error guardando solicitud', e);
    return error('No pudimos guardar la solicitud', 500);
  }
}
