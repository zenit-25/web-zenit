import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { resumirHorario } from '../../../core/services/horario';
import { SolicitudStore } from '../../../core/services/solicitud.store';

/** Horario de atención día por día, con opción de jornada partida (cierre al mediodía). */
@Component({
  selector: 'app-horario-semanal',
  imports: [FormsModule],
  templateUrl: './horario-semanal.html',
  styleUrl: './horario-semanal.scss',
})
export class HorarioSemanal {
  protected readonly store = inject(SolicitudStore);
  protected readonly dias = this.store.solicitud.contacto.horario;

  protected get resumen(): string[] {
    return resumirHorario(this.dias);
  }

  protected alternar(i: number, campo: 'abierto' | 'partida'): void {
    const dia = this.dias[i];
    dia[campo] = !dia[campo];
    // Al partir la jornada, la mañana debe cerrar antes de que abra la tarde.
    if (campo === 'partida' && dia.partida && dia.hasta >= dia.desde2) {
      dia.hasta2 = dia.hasta > dia.desde2 ? dia.hasta : dia.hasta2;
      dia.hasta = '12:00';
    }
    this.store.guardar();
  }

  /** Copia el horario del lunes a martes–viernes. */
  protected copiarLunes(): void {
    const { abierto, desde, hasta, partida, desde2, hasta2 } = this.dias[0];
    for (const d of this.dias.slice(1, 5))
      Object.assign(d, { abierto, desde, hasta, partida, desde2, hasta2 });
    this.store.guardar();
  }
}
