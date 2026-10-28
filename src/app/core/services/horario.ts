import { DiaHorario } from '../models/solicitud.model';

/** "14:30" -> "2:30 p.m." */
export function hora12(hhmm: string): string {
  if (!hhmm) return '--';
  const [h, m] = hhmm.split(':').map(Number);
  const sufijo = h < 12 ? 'a.m.' : 'p.m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`;
}

function franjasDia(d: DiaHorario): string {
  if (!d.abierto) return 'Cerrado';
  const primera = `${hora12(d.desde)} – ${hora12(d.hasta)}`;
  return d.partida ? `${primera} y ${hora12(d.desde2)} – ${hora12(d.hasta2)}` : primera;
}

/**
 * Agrupa días consecutivos con el mismo horario:
 * "Lunes a viernes: 8:00 a.m. – 12:00 p.m. y 2:00 p.m. – 6:00 p.m."
 */
export function resumirHorario(dias: DiaHorario[]): string[] {
  const lineas: string[] = [];
  let i = 0;
  while (i < dias.length) {
    const texto = franjasDia(dias[i]);
    let j = i;
    while (j + 1 < dias.length && franjasDia(dias[j + 1]) === texto) j++;
    const rango = i === j ? dias[i].dia : `${dias[i].dia} a ${dias[j].dia.toLowerCase()}`;
    lineas.push(`${rango}: ${texto}`);
    i = j + 1;
  }
  return lineas;
}
