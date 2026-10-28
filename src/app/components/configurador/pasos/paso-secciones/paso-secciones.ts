import { Component, inject } from '@angular/core';
import { SECCIONES } from '../../../../core/data/configurador/catalogo.data';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';
import { InfoTip } from '../../info-tip/info-tip';

@Component({
  selector: 'app-paso-secciones',
  imports: [CampoComentario, InfoTip],
  templateUrl: './paso-secciones.html',
})
export class PasoSecciones {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly secciones = SECCIONES;
}
