import { RasgoHosting } from '../../models/solicitud.model';

/**
 * Parámetro para decidir el hosting. Cada rasgo que tenga el proyecto suma
 * puntos; el total se compara con los niveles. Ajusta los valores aquí.
 */
export const PUNTOS_RASGO: Record<RasgoHosting, number> = {
  formulario: 1,
  blog: 1,
  pagos: 2,
  reservas: 3,
  archivos: 3,
  usuarios: 4,
  baseDatos: 4,
  panel: 4,
};

export const NOMBRE_RASGO: Record<RasgoHosting, string> = {
  formulario: 'Formulario de contacto',
  blog: 'Blog o noticias',
  pagos: 'Pagos en línea',
  reservas: 'Reservas o citas',
  archivos: 'Subida de archivos',
  usuarios: 'Usuarios con inicio de sesión',
  baseDatos: 'Base de datos',
  panel: 'Panel administrativo',
};

export const PUNTOS_TRAFICO = { bajo: 0, medio: 2, alto: 5 } as const;

export interface NivelHosting {
  id: 'vercel' | 'nube' | 'servidor';
  /** Puntaje máximo (inclusive) de este nivel. */
  max: number;
  nombre: string;
  explicacion: string;
  costo: string;
}

export const NIVELES_HOSTING: NivelHosting[] = [
  {
    id: 'vercel',
    max: 4,
    nombre: 'Hosting en la nube (Vercel)',
    explicacion:
      'Tu página se publica en una plataforma rápida y segura, ideal para sitios informativos. No necesitas un servidor propio.',
    costo: 'Generalmente sin costo mensual de hosting.',
  },
  {
    id: 'nube',
    max: 9,
    nombre: 'Nube con servicios adicionales',
    explicacion:
      'Tu página va en la nube y se conecta a servicios para guardar datos, procesar pagos o enviar correos.',
    costo: 'Costo mensual bajo según el uso.',
  },
  {
    id: 'servidor',
    max: Number.POSITIVE_INFINITY,
    nombre: 'Servidor dedicado (VPS)',
    explicacion:
      'Tu sistema maneja usuarios, datos y procesos propios, así que necesita un servidor exclusivo con más capacidad y control.',
    costo: 'Tiene un costo mensual de servidor que se define en la cotización.',
  },
];
