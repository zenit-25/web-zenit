import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SITE } from '../../../../core/data/site.config';
import { SolicitudStore, whatsappValido } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';

@Component({
  selector: 'app-paso-datos',
  imports: [FormsModule, RouterLink, CampoComentario],
  templateUrl: './paso-datos.html',
  styleUrl: './paso-datos.scss',
})
export class PasoDatos {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly marca = SITE.brand;
  protected readonly whatsappValido = whatsappValido;

  protected usarWhatsappPagina(): void {
    this.s.datos.whatsapp = this.s.contacto.whatsappBoton;
    this.store.guardar();
  }

  protected alternarAutorizacion(): void {
    this.s.datos.autorizacion = !this.s.datos.autorizacion;
    this.store.guardar();
  }
}
