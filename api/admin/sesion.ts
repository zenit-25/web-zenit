import { sesionValida } from '../_lib/auth.js';
import { error, json } from '../_lib/http.js';

export function GET(request: Request): Response {
  return sesionValida(request) ? json({ ok: true }) : error('No autorizado', 401);
}
