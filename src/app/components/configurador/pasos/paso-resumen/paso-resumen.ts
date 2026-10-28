import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  EXTRAS,
  SECCIONES,
  TIPOS_PROYECTO,
} from '../../../../core/data/configurador/catalogo.data';
import { buildWhatsappLink } from '../../../../core/data/site.config';
import { calcularHosting } from '../../../../core/services/hosting-score';
import {
  construirMensajeWhatsapp,
  construirTxt,
  descargarTxt,
  nombreArchivo,
} from '../../../../core/services/solicitud-export';
import { SolicitudStore } from '../../../../core/services/solicitud.store';

@Component({
  selector: 'app-paso-resumen',
  imports: [FormsModule],
  templateUrl: './paso-resumen.html',
  styleUrl: './paso-resumen.scss',
})
export class PasoResumen {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly verTexto = signal(false);
  protected readonly descargado = signal(false);

  protected get tipo(): string {
    return TIPOS_PROYECTO.find((t) => t.id === this.s.proyecto.tipo)?.nombre ?? 'Sin seleccionar';
  }

  protected get secciones(): string[] {
    return SECCIONES.filter((x) => this.s.secciones.seleccion.includes(x.id)).map((x) => x.nombre);
  }

  protected get extras(): string[] {
    return EXTRAS.filter((x) => this.s.extras.seleccion.includes(x.id)).map((x) => x.nombre);
  }

  protected get hosting() {
    return calcularHosting(this.s);
  }

  protected get texto(): string {
    return construirTxt(this.s);
  }

  protected get archivo(): string {
    return nombreArchivo(this.s);
  }

  protected descargar(): void {
    descargarTxt(this.s);
    this.descargado.set(true);
  }

  protected enviarWhatsapp(): void {
    if (!this.descargado()) this.descargar();
    window.open(buildWhatsappLink(construirMensajeWhatsapp(this.s)), '_blank', 'noopener');
  }

  protected reiniciar(): void {
    if (confirm('¿Seguro que quieres borrar todo y empezar de nuevo?')) this.store.reiniciar();
  }
}
