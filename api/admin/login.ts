import { claveCorrecta, cookieSesion } from '../_lib/auth.js';
import { error, json, leerJson } from '../_lib/http.js';

export async function POST(request: Request): Promise<Response> {
  const cuerpo = await leerJson<{ clave?: unknown }>(request, 2_000);
  const clave = typeof cuerpo?.clave === 'string' ? cuerpo.clave : '';

  if (!clave || !claveCorrecta(clave)) {
    // Pequeña espera para frenar intentos repetidos de adivinar la clave.
    await new Promise((r) => setTimeout(r, 800));
    return error('Contraseña incorrecta', 401);
  }
  return json({ ok: true }, 200, { 'Set-Cookie': cookieSesion() });
}
