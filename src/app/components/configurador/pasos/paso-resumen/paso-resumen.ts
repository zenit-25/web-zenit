import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  EXTRAS,
  SECCIONES,
  TEMAS,
  TIPOS_PROYECTO,
} from '../../../../core/data/configurador/catalogo.data';
import { calcularHosting } from '../../../../core/services/hosting-score';
import { nombreArchivo } from '../../../../core/services/solicitud-export';
import {
  descargarPdf,
  enviarPorWhatsapp,
  precargarPdf,
  verPdf,
} from '../../../../core/services/solicitud-pdf';
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
  protected readonly ocupado = signal(false);
  protected readonly estado = signal<'' | 'compartido' | 'descargado' | 'error'>('');

  constructor() {
    // Así el PDF se genera al instante cuando el cliente toca un botón.
    precargarPdf();
  }

  protected get tipo(): string {
    return TIPOS_PROYECTO.find((t) => t.id === this.s.proyecto.tipo)?.nombre ?? 'Sin seleccionar';
  }

  protected get secciones(): string[] {
    return SECCIONES.filter((x) => this.s.secciones.seleccion.includes(x.id)).map((x) => x.nombre);
  }

  protected get extras(): string[] {
    return EXTRAS.filter((x) => this.s.extras.seleccion.includes(x.id)).map((x) => x.nombre);
  }

  protected get tema(): string {
    return TEMAS.find((t) => t.id === this.s.marca.tema)?.nombre ?? 'Tema sin definir';
  }

  protected get hosting() {
    return calcularHosting(this.s);
  }

  protected get archivo(): string {
    return nombreArchivo(this.s);
  }

  private async ejecutar(accion: () => Promise<unknown>): Promise<void> {
    if (this.ocupado()) return;
    this.ocupado.set(true);
    try {
      await accion();
    } catch {
      this.estado.set('error');
    } finally {
      this.ocupado.set(false);
    }
  }

  protected enviar(forzarDescarga = false): void {
    this.ejecutar(async () => {
      const resultado = await enviarPorWhatsapp(this.s, forzarDescarga);
      if (resultado !== 'cancelado') this.estado.set(resultado);
    });
  }

  protected descargar(): void {
    this.ejecutar(() => descargarPdf(this.s));
  }

  protected ver(): void {
    this.ejecutar(() => verPdf(this.s));
  }

  protected reiniciar(): void {
    if (confirm('¿Seguro que quieres borrar todo y empezar de nuevo?')) this.store.reiniciar();
  }
}
