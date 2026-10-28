import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';

@Component({
  selector: 'app-paso-datos',
  imports: [FormsModule, CampoComentario],
  templateUrl: './paso-datos.html',
})
export class PasoDatos {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;

  protected usarWhatsappPagina(): void {
    this.s.datos.whatsapp = this.s.contacto.whatsappBoton;
    this.store.guardar();
  }
}
