import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';
import { InfoTip } from '../../info-tip/info-tip';

type Reunion = Solicitud['reunion'];

@Component({
  selector: 'app-paso-reunion',
  imports: [FormsModule, CampoComentario, InfoTip],
  templateUrl: './paso-reunion.html',
})
export class PasoReunion {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly hoy = new Date().toISOString().slice(0, 10);

  protected readonly modalidades: { id: Reunion['modalidad']; nombre: string; info: string }[] = [
    {
      id: 'presencial',
      nombre: 'Presencial',
      info: 'Te visitamos y te mostramos el boceto en persona.',
    },
    {
      id: 'virtual',
      nombre: 'Videollamada',
      info: 'Por Google Meet o WhatsApp, compartiendo pantalla.',
    },
    {
      id: 'whatsapp',
      nombre: 'Acordar por WhatsApp',
      info: 'Definimos juntos el mejor momento por chat.',
    },
  ];

  protected readonly franjas: { id: Reunion['franja']; nombre: string }[] = [
    { id: 'manana', nombre: 'Mañana' },
    { id: 'tarde', nombre: 'Tarde' },
    { id: 'noche', nombre: 'Noche' },
  ];

  protected elegirModalidad(id: Reunion['modalidad']): void {
    this.s.reunion.modalidad = id;
    this.store.guardar();
  }

  protected elegirFranja(id: Reunion['franja']): void {
    this.s.reunion.franja = id;
    this.store.guardar();
  }
}
