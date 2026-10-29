import { Component, inject } from '@angular/core';
import { SECCIONES } from '../../../../core/data/configurador/catalogo.data';
import { paletaVista, variablesPaleta } from '../../../../core/services/paleta-vista';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';
import { InfoTip } from '../../info-tip/info-tip';
import { WireBloque } from '../../wire/wire-bloque';

@Component({
  selector: 'app-paso-secciones',
  imports: [CampoComentario, InfoTip, WireBloque],
  templateUrl: './paso-secciones.html',
})
export class PasoSecciones {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly secciones = SECCIONES;

  /** Las miniaturas usan los colores que el cliente ya haya escogido. */
  protected get variables(): Record<string, string> {
    return variablesPaleta(paletaVista(this.s));
  }
}
