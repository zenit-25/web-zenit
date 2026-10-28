import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';
import { HorarioSemanal } from '../../horario-semanal/horario-semanal';
import { InfoTip } from '../../info-tip/info-tip';

@Component({
  selector: 'app-paso-contacto',
  imports: [FormsModule, CampoComentario, InfoTip, HorarioSemanal],
  templateUrl: './paso-contacto.html',
})
export class PasoContacto {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;

  protected mostrarHorario(valor: boolean): void {
    this.s.contacto.mostrarHorario = valor;
    this.store.guardar();
  }
}
