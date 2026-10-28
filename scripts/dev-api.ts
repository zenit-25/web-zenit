/**
 * Servidor local para probar las funciones de /api sin Vercel.
 *
 *   npm run api:dev          (en otra terminal: npm start)
 *
 * Sin DATABASE_URL usa PGlite (Postgres en memoria, guardado en .pglite-dev/).
 * Con DATABASE_URL en el entorno usa esa base de datos (por ejemplo Neon).
 */
import { readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const PUERTO = Number(process.env['API_PORT'] ?? 3001);
const RAIZ_API = join(process.cwd(), 'api');

// Valores solo para desarrollo local; en Vercel se configuran en el panel.
process.env['ADMIN_PASSWORD'] ??= 'admin-local';
process.env['ADMIN_SECRET'] ??= 'secreto-solo-para-desarrollo-local-0123456789';

type Handler = (request: Request) => Response | Promise<Response>;
interface Ruta {
  patron: RegExp;
  archivo: string;
}

/** Convierte api/admin/solicitudes/[codigo].ts en /api/admin/solicitudes/:codigo, como Vercel. */
function rutas(dir = RAIZ_API): Ruta[] {
  const lista: Ruta[] = [];
  for (const nombre of readdirSync(dir)) {
    const completo = join(dir, nombre);
    if (nombre.startsWith('_') || nombre === 'tsconfig.json') continue;
    if (statSync(completo).isDirectory()) {
      lista.push(...rutas(completo));
      continue;
    }
    if (!nombre.endsWith('.ts')) continue;
    const ruta = relative(RAIZ_API, completo)
      .split(sep)
      .join('/')
      .replace(/\.ts$/, '')
      .replace(/(^|\/)index$/, '');
    const patron = ruta.replace(/\[[^\]]+\]/g, '[^/]+');
    lista.push({ patron: new RegExp(`^/api${patron ? `/${patron}` : ''}/?$`), archivo: completo });
  }
  // Las rutas fijas antes que las dinámicas.
  return lista.sort((a, b) => Number(a.archivo.includes('[')) - Number(b.archivo.includes('[')));
}

async function prepararBaseDeDatos(): Promise<void> {
  if (process.env['DATABASE_URL']) {
    console.log('Usando DATABASE_URL del entorno');
    return;
  }
  const { PGlite } = await import('@electric-sql/pglite');
  const db = new PGlite('./.pglite-dev');
  const { usarConsulta } = await import('../api/_lib/db');
  usarConsulta(async (texto, parametros = []) => (await db.query(texto, parametros)).rows as never);
  console.log('Usando PGlite local (.pglite-dev/)');
}

async function main(): Promise<void> {
  await prepararBaseDeDatos();
  const tabla = rutas();

  createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', `http://localhost:${PUERTO}`);
    const ruta = tabla.find((r) => r.patron.test(url.pathname));
    if (!ruta) {
      res.writeHead(404).end();
      return;
    }
    const modulo = (await import(pathToFileURL(ruta.archivo).href)) as Record<string, Handler>;
    const handler = modulo[req.method ?? 'GET'];
    if (!handler) {
      res.writeHead(405).end();
      return;
    }

    const partes: Buffer[] = [];
    for await (const parte of req) partes.push(parte as Buffer);
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
    const request = new Request(url, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method ?? '') ? undefined : Buffer.concat(partes),
    });

    try {
      const respuesta = await handler(request);
      res.writeHead(respuesta.status, Object.fromEntries(respuesta.headers));
      res.end(Buffer.from(await respuesta.arrayBuffer()));
    } catch (e) {
      console.error(e);
      res.writeHead(500).end();
    }
    console.log(`${req.method} ${url.pathname} -> ${res.statusCode}`);
  }).listen(PUERTO, () => console.log(`API local en http://localhost:${PUERTO}`));
}

main();
