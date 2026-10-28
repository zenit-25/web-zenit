import { neon } from '@neondatabase/serverless';

export type Fila = Record<string, unknown>;
export type Consulta = (texto: string, parametros?: unknown[]) => Promise<Fila[]>;

let consulta: Consulta | null = null;
let esquemaListo: Promise<void> | null = null;

/** Permite usar otra base de datos (PGlite) en el servidor local de pruebas. */
export function usarConsulta(c: Consulta): void {
  consulta = c;
  esquemaListo = null;
}

function conexion(): Consulta {
  if (!consulta) {
    // La integración de Neon en Vercel crea DATABASE_URL (y POSTGRES_URL como alias).
    const url = process.env['DATABASE_URL'] ?? process.env['POSTGRES_URL'];
    if (!url) throw new Error('Falta la variable de entorno DATABASE_URL');
    const sql = neon(url);
    consulta = (texto, parametros = []) => sql.query(texto, parametros) as Promise<Fila[]>;
  }
  return consulta;
}

/** Crea la tabla la primera vez; las sentencias son idempotentes. */
const ESQUEMA = [
  `CREATE TABLE IF NOT EXISTS solicitudes (
    id BIGSERIAL PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    token_edicion TEXT NOT NULL,
    creada TIMESTAMPTZ NOT NULL DEFAULT now(),
    actualizada TIMESTAMPTZ NOT NULL DEFAULT now(),
    estado TEXT NOT NULL DEFAULT 'nueva',
    nombre TEXT NOT NULL,
    negocio TEXT NOT NULL DEFAULT '',
    ciudad TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    correo TEXT NOT NULL DEFAULT '',
    tipo_proyecto TEXT NOT NULL DEFAULT '',
    hosting_nivel TEXT NOT NULL DEFAULT '',
    hosting_puntos INTEGER NOT NULL DEFAULT 0,
    autorizacion_datos TIMESTAMPTZ NOT NULL,
    notas TEXT NOT NULL DEFAULT '',
    datos JSONB NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS solicitudes_creada_idx ON solicitudes (creada DESC)`,
  `CREATE INDEX IF NOT EXISTS solicitudes_estado_idx ON solicitudes (estado)`,
];

export async function query(texto: string, parametros: unknown[] = []): Promise<Fila[]> {
  const q = conexion();
  esquemaListo ??= (async () => {
    for (const sentencia of ESQUEMA) await q(sentencia);
  })();
  await esquemaListo;
  return q(texto, parametros);
}
