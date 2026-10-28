import { Solicitud } from '../models/solicitud.model';

export const ESTADOS_SOLICITUD = [
  { id: 'nueva', nombre: 'Nueva', color: '#7c5cff' },
  { id: 'contactado', nombre: 'Contactado', color: '#5b8dff' },
  { id: 'reunion', nombre: 'Reunión agendada', color: '#35e3c4' },
  { id: 'cotizada', nombre: 'Cotizada', color: '#f2a541' },
  { id: 'cerrada', nombre: 'Cerrada', color: '#3ddc84' },
  { id: 'descartada', nombre: 'Descartada', color: '#5f5f75' },
] as const;

export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number]['id'];

export interface SolicitudResumen {
  codigo: string;
  creada: string;
  actualizada: string;
  estado: EstadoSolicitud;
  nombre: string;
  negocio: string;
  ciudad: string;
  whatsapp: string;
  correo: string;
  tipo_proyecto: string;
  hosting_nivel: string;
  hosting_puntos: number;
}

export interface SolicitudDetalle extends SolicitudResumen {
  autorizacion_datos: string;
  notas: string;
  datos: Solicitud;
}

/** Error de sesión: el panel vuelve a la pantalla de inicio de sesión. */
export class SinSesion extends Error {}

async function pedir<T>(url: string, init: RequestInit = {}): Promise<T> {
  const respuesta = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
  if (respuesta.status === 401) throw new SinSesion();
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
  return respuesta.json() as Promise<T>;
}

export const adminApi = {
  async sesionActiva(): Promise<boolean> {
    try {
      await pedir('/api/admin/sesion');
      return true;
    } catch {
      return false;
    }
  },

  async entrar(clave: string): Promise<boolean> {
    try {
      await pedir('/api/admin/login', { method: 'POST', body: JSON.stringify({ clave }) });
      return true;
    } catch {
      return false;
    }
  },

  salir(): Promise<unknown> {
    return pedir('/api/admin/logout', { method: 'POST' });
  },

  listar(estado = '', q = '') {
    const params = new URLSearchParams();
    if (estado) params.set('estado', estado);
    if (q) params.set('q', q);
    return pedir<{ solicitudes: SolicitudResumen[]; conteo: { estado: string; total: number }[] }>(
      `/api/admin/solicitudes?${params}`,
    );
  },

  detalle(codigo: string) {
    return pedir<SolicitudDetalle>(`/api/admin/solicitudes/${encodeURIComponent(codigo)}`);
  },

  actualizar(codigo: string, cambios: { estado?: EstadoSolicitud; notas?: string }) {
    return pedir<SolicitudDetalle>(`/api/admin/solicitudes/${encodeURIComponent(codigo)}`, {
      method: 'PATCH',
      body: JSON.stringify(cambios),
    });
  },
};
