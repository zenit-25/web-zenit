import { Solicitud } from '../models/solicitud.model';

/** Colores planos con los que se dibuja la maqueta esquemática de la página. */
export interface PaletaVista {
  fondo: string;
  superficie: string;
  texto: string;
  suave: string;
  boton: string;
  detalle: string;
  principal: string;
  oscuro: boolean;
}

/** Color de acento cuando el cliente aún no define sus colores (o los propone Zenit). */
const ACENTO_ZENIT = '#7c5cff';

/** Luminancia relativa aproximada (0 = negro, 1 = blanco). */
function luminancia(hex: string): number {
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function paletaVista(s: Solicitud): PaletaVista {
  const propios = s.marca.paleta === 'propios' ? s.marca.colores : [];
  const color = (uso: string) => propios.find((c) => c.uso === uso)?.hex;

  const principal = color('principal') ?? propios[0]?.hex ?? ACENTO_ZENIT;
  const fondoCliente = color('fondo');
  // Si el cliente eligió un color de fondo, el tema sale de qué tan oscuro es.
  const oscuro = fondoCliente ? luminancia(fondoCliente) < 0.45 : s.marca.tema === 'oscuro';

  return {
    fondo: fondoCliente ?? (oscuro ? '#121219' : '#ffffff'),
    superficie: oscuro ? 'rgba(255,255,255,0.06)' : '#f3f4f7',
    texto: color('titulos') ?? (oscuro ? '#ececf3' : '#1f2a37'),
    suave: oscuro ? 'rgba(255,255,255,0.14)' : 'rgba(31,42,55,0.12)',
    boton: color('botones') ?? principal,
    detalle: color('detalles') ?? principal,
    principal,
    oscuro,
  };
}

/** Variables CSS que consumen los bloques esquemáticos. */
export function variablesPaleta(p: PaletaVista): Record<string, string> {
  return {
    '--wf-fondo': p.fondo,
    '--wf-sup': p.superficie,
    '--wf-texto': p.texto,
    '--wf-suave': p.suave,
    '--wf-boton': p.boton,
    '--wf-detalle': p.detalle,
    '--wf-principal': p.principal,
    '--wf-sombra': p.oscuro ? '0 6px 16px rgba(0,0,0,0.45)' : '0 6px 16px rgba(31,42,55,0.10)',
  };
}
