import { cookieCierre } from '../_lib/auth.js';
import { json } from '../_lib/http.js';

export function POST(): Response {
  return json({ ok: true }, 200, { 'Set-Cookie': cookieCierre() });
}
