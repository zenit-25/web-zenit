import { EXTRAS, TIPOS_PROYECTO } from '../data/configurador/catalogo.data';
import {
  NIVELES_HOSTING,
  NOMBRE_RASGO,
  NivelHosting,
  PUNTOS_RASGO,
  PUNTOS_TRAFICO,
} from '../data/configurador/hosting.config';
import { RasgoHosting, Solicitud } from '../models/solicitud.model';

export interface ResultadoHosting {
  puntos: number;
  detalle: { motivo: string; puntos: number }[];
  nivel: NivelHosting;
}

/** Reúne los rasgos técnicos del proyecto y calcula la recomendación de hosting. */
export function calcularHosting(s: Solicitud): ResultadoHosting {
  const rasgos = new Set<RasgoHosting>();

  TIPOS_PROYECTO.find((t) => t.id === s.proyecto.tipo)?.rasgos.forEach((r) => rasgos.add(r));
  if (s.secciones.seleccion.includes('formulario')) rasgos.add('formulario');
  if (s.pagos.recibir === 'si') rasgos.add('pagos');
  for (const extra of EXTRAS) {
    if (extra.rasgo && s.extras.seleccion.includes(extra.id)) rasgos.add(extra.rasgo);
  }
  if (s.hosting.usuarios) rasgos.add('usuarios');
  if (s.hosting.baseDatos) rasgos.add('baseDatos');
  if (s.hosting.panel) rasgos.add('panel');
  if (s.hosting.archivos) rasgos.add('archivos');

  const detalle = [...rasgos].map((r) => ({ motivo: NOMBRE_RASGO[r], puntos: PUNTOS_RASGO[r] }));
  if (s.hosting.trafico && PUNTOS_TRAFICO[s.hosting.trafico] > 0) {
    detalle.push({
      motivo: `Tráfico ${s.hosting.trafico}`,
      puntos: PUNTOS_TRAFICO[s.hosting.trafico],
    });
  }

  const puntos = detalle.reduce((total, d) => total + d.puntos, 0);
  const nivel =
    NIVELES_HOSTING.find((n) => puntos <= n.max) ?? NIVELES_HOSTING[NIVELES_HOSTING.length - 1];

  return { puntos, detalle, nivel };
}
