import { sesionValida } from '../_lib/auth';
import { error, json } from '../_lib/http';

export function GET(request: Request): Response {
  return sesionValida(request) ? json({ ok: true }) : error('No autorizado', 401);
}
