import { Component, inject } from '@angular/core';
import { TIPOS_PROYECTO } from '../../../../core/data/configurador/catalogo.data';
import { TipoProyecto } from '../../../../core/models/solicitud.model';
import { paletaVista, variablesPaleta } from '../../../../core/services/paleta-vista';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';
import { PaginaWire } from '../../wire/pagina-wire';

@Component({
  selector: 'app-paso-tipo',
  imports: [CampoComentario, PaginaWire],
  templateUrl: './paso-tipo.html',
})
export class PasoTipo {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly tipos = TIPOS_PROYECTO;

  /** Las secciones que distinguen a cada tipo (la portada es igual en todos). */
  protected miniatura(tipo: TipoProyecto): string[] {
    if (tipo.id === 'sistema') return ['panel'];
    const propias = tipo.seccionesSugeridas.filter((id) => id !== 'inicio' && id !== 'nosotros');
    return propias.length ? propias.slice(0, 2) : ['inicio'];
  }

  protected get variables(): Record<string, string> {
    return variablesPaleta(paletaVista(this.s));
  }

  protected elegir(tipo: TipoProyecto): void {
    this.s.proyecto.tipo = tipo.id;
    // Sugerimos secciones solo si el cliente todavía no ha escogido ninguna.
    if (this.s.secciones.seleccion.length === 0) {
      this.s.secciones.seleccion.push(...tipo.seccionesSugeridas);
    }
    this.store.guardar();
  }
}
