import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'zenit_admin';
const DURACION_SEGUNDOS = 12 * 60 * 60;

function secreto(): string {
  const s = process.env['ADMIN_SECRET'];
  if (!s || s.length < 32) throw new Error('ADMIN_SECRET debe tener al menos 32 caracteres');
  return s;
}

function firmar(datos: string): string {
  return createHmac('sha256', secreto()).update(datos).digest('base64url');
}

function iguales(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Compara la contraseña en tiempo constante (sin revelar cuántos caracteres coinciden). */
export function claveCorrecta(clave: string): boolean {
  const esperada = process.env['ADMIN_PASSWORD'];
  if (!esperada) throw new Error('Falta la variable de entorno ADMIN_PASSWORD');
  return iguales(firmar(clave), firmar(esperada));
}

export function cookieSesion(): string {
  const vence = Math.floor(Date.now() / 1000) + DURACION_SEGUNDOS;
  const datos = Buffer.from(JSON.stringify({ vence })).toString('base64url');
  const token = `${datos}.${firmar(datos)}`;
  return `${COOKIE}=${token}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${DURACION_SEGUNDOS}`;
}

export function cookieCierre(): string {
  return `${COOKIE}=; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function sesionValida(request: Request): boolean {
  const cookies = request.headers.get('cookie') ?? '';
  const token = cookies
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!token) return false;

  const [datos, firma] = token.split('.');
  if (!datos || !firma || !iguales(firma, firmar(datos))) return false;
  try {
    const { vence } = JSON.parse(Buffer.from(datos, 'base64url').toString());
    return typeof vence === 'number' && vence > Date.now() / 1000;
  } catch {
    return false;
  }
}
