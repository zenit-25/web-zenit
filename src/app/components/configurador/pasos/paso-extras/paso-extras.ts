import { Component, inject } from '@angular/core';
import { EXTRAS } from '../../../../core/data/configurador/catalogo.data';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';

@Component({
  selector: 'app-paso-extras',
  imports: [CampoComentario],
  templateUrl: './paso-extras.html',
})
export class PasoExtras {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly extras = EXTRAS;
}
