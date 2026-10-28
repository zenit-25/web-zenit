import { Component, inject } from '@angular/core';
import { TIPOS_PROYECTO } from '../../../../core/data/configurador/catalogo.data';
import { TipoProyecto } from '../../../../core/models/solicitud.model';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';

@Component({
  selector: 'app-paso-tipo',
  imports: [CampoComentario],
  templateUrl: './paso-tipo.html',
})
export class PasoTipo {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly tipos = TIPOS_PROYECTO;

  protected elegir(tipo: TipoProyecto): void {
    this.s.proyecto.tipo = tipo.id;
    // Sugerimos secciones solo si el cliente todavía no ha escogido ninguna.
    if (this.s.secciones.seleccion.length === 0) {
      this.s.secciones.seleccion.push(...tipo.seccionesSugeridas);
    }
    this.store.guardar();
  }
}
