export function json(datos: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(datos), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

export function error(mensaje: string, status: number): Response {
  return json({ error: mensaje }, status);
}

/** Lee el cuerpo JSON con un límite de tamaño para evitar abusos. */
export async function leerJson<T>(request: Request, maxBytes = 200_000): Promise<T | null> {
  const texto = await request.text();
  if (texto.length > maxBytes) return null;
  try {
    return JSON.parse(texto) as T;
  } catch {
    return null;
  }
}

/** Último segmento de la ruta, p. ej. el código en /api/admin/solicitudes/ZD-... */
export function ultimoSegmento(request: Request): string {
  return decodeURIComponent(new URL(request.url).pathname.split('/').filter(Boolean).pop() ?? '');
}
