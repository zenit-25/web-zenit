export const ESTADOS = [
  'nueva',
  'contactado',
  'reunion',
  'cotizada',
  'cerrada',
  'descartada',
] as const;
export type Estado = (typeof ESTADOS)[number];

const MAX_TEXTO = 3000;

/** Recorta textos largos y elimina valores no esperados en todo el objeto. */
export function limpiar(valor: unknown, profundidad = 0): unknown {
  if (profundidad > 6) return null;
  if (typeof valor === 'string') return valor.trim().slice(0, MAX_TEXTO);
  if (typeof valor === 'number' || typeof valor === 'boolean' || valor === null) return valor;
  if (Array.isArray(valor)) return valor.slice(0, 50).map((v) => limpiar(v, profundidad + 1));
  if (typeof valor === 'object') {
    const salida: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(valor as Record<string, unknown>).slice(0, 60)) {
      salida[k.slice(0, 60)] = limpiar(v, profundidad + 1);
    }
    return salida;
  }
  return null;
}

function texto(obj: unknown, ...ruta: string[]): string {
  let actual: unknown = obj;
  for (const parte of ruta) actual = (actual as Record<string, unknown> | undefined)?.[parte];
  return typeof actual === 'string' ? actual.trim() : '';
}

export interface SolicitudValida {
  codigo: string;
  token: string;
  nombre: string;
  negocio: string;
  ciudad: string;
  whatsapp: string;
  correo: string;
  tipo: string;
  datos: Record<string, unknown>;
}

/** Valida los campos obligatorios. Devuelve la lista de errores o la solicitud lista para guardar. */
export function validarSolicitud(
  cuerpo: unknown,
): { errores: string[] } | { solicitud: SolicitudValida } {
  const datos = limpiar((cuerpo as Record<string, unknown> | null)?.['solicitud']) as Record<
    string,
    unknown
  > | null;
  if (!datos || typeof datos !== 'object') return { errores: ['Solicitud vacía'] };

  const s: SolicitudValida = {
    codigo: texto(datos, 'codigo'),
    token: texto(datos, 'token'),
    nombre: texto(datos, 'datos', 'nombre'),
    negocio: texto(datos, 'datos', 'negocio'),
    ciudad: texto(datos, 'datos', 'ciudad'),
    whatsapp: texto(datos, 'datos', 'whatsapp'),
    correo: texto(datos, 'datos', 'correo'),
    tipo: texto(datos, 'proyecto', 'tipo'),
    datos,
  };

  const errores: string[] = [];
  if (!/^ZD-\d{8}-[A-Z0-9]{4,8}$/.test(s.codigo)) errores.push('Código de solicitud inválido');
  if (s.token.length < 16) errores.push('Token de edición inválido');
  if (s.nombre.length < 2) errores.push('El nombre es obligatorio');
  if (s.ciudad.length < 2) errores.push('La ciudad es obligatoria');
  if (s.whatsapp.replace(/\D/g, '').length < 7) errores.push('El WhatsApp es obligatorio');
  if (s.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.correo))
    errores.push('El correo no es válido');
  if (!s.tipo) errores.push('Falta el tipo de proyecto');
  if ((datos['datos'] as Record<string, unknown> | undefined)?.['autorizacion'] !== true) {
    errores.push('Falta la autorización de tratamiento de datos');
  }
  return errores.length ? { errores } : { solicitud: s };
}
