import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ESTILOS_VISUALES } from '../../../../core/data/configurador/catalogo.data';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';
import { InfoTip } from '../../info-tip/info-tip';

@Component({
  selector: 'app-paso-marca',
  imports: [FormsModule, CampoComentario, InfoTip],
  templateUrl: './paso-marca.html',
})
export class PasoMarca {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly estilos = ESTILOS_VISUALES;

  protected readonly opcionesLogo: {
    id: Solicitud['marca']['logo'];
    nombre: string;
    info: string;
  }[] = [
    {
      id: 'tengo',
      nombre: 'Ya tengo logo',
      info: 'Al final nos lo envías por WhatsApp, idealmente en PNG o PDF.',
    },
    {
      id: 'crear',
      nombre: 'Quiero que me creen uno',
      info: 'Diseñamos un logo para tu marca; cuéntanos tu idea abajo.',
    },
    {
      id: 'no',
      nombre: 'No necesito logo',
      info: 'Usaremos el nombre de tu negocio con una tipografía cuidada.',
    },
  ];

  protected elegirLogo(id: Solicitud['marca']['logo']): void {
    this.s.marca.logo = id;
    this.store.guardar();
  }

  protected elegirEstilo(id: string): void {
    this.s.marca.estilo = id;
    this.store.guardar();
  }

  protected usarColores(valor: boolean): void {
    this.s.marca.usarColores = valor;
    this.store.guardar();
  }
}
