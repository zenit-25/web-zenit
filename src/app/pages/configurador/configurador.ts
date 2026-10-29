import {
  Component,
  ElementRef,
  HostListener,
  afterRenderEffect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { PasoContacto } from '../../components/configurador/pasos/paso-contacto/paso-contacto';
import { PasoDatos } from '../../components/configurador/pasos/paso-datos/paso-datos';
import { PasoDominio } from '../../components/configurador/pasos/paso-dominio/paso-dominio';
import { PasoExtras } from '../../components/configurador/pasos/paso-extras/paso-extras';
import { PasoMarca } from '../../components/configurador/pasos/paso-marca/paso-marca';
import { PasoPagos } from '../../components/configurador/pasos/paso-pagos/paso-pagos';
import { PasoResumen } from '../../components/configurador/pasos/paso-resumen/paso-resumen';
import { PasoReunion } from '../../components/configurador/pasos/paso-reunion/paso-reunion';
import { PasoSecciones } from '../../components/configurador/pasos/paso-secciones/paso-secciones';
import { PasoTipo } from '../../components/configurador/pasos/paso-tipo/paso-tipo';
import { VistaPrevia } from '../../components/configurador/vista-previa/vista-previa';
import { PASOS, SolicitudStore } from '../../core/services/solicitud.store';

@Component({
  selector: 'app-configurador',
  imports: [
    PasoDatos,
    PasoTipo,
    PasoSecciones,
    PasoMarca,
    PasoContacto,
    PasoPagos,
    PasoDominio,
    PasoExtras,
    PasoReunion,
    PasoResumen,
    VistaPrevia,
  ],
  templateUrl: './configurador.html',
  styleUrl: './configurador.scss',
})
export class Configurador {
  protected readonly store = inject(SolicitudStore);
  protected readonly pasos = PASOS;
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private primerRender = true;
  /** Cajón con la vista previa en pantallas sin espacio para el panel lateral. */
  protected readonly vistaAbierta = signal(false);

  constructor() {
    // Al cambiar de paso, lleva al cliente al inicio del panel.
    afterRenderEffect(() => {
      this.store.paso();
      if (this.primerRender) {
        this.primerRender = false;
        return;
      }
      const top = this.panel().nativeElement.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  /** En el resumen la maqueta va dentro del paso, así que el panel lateral sobra. */
  protected get mostrarVista(): boolean {
    return this.pasos[this.store.paso()].id !== 'resumen';
  }

  @HostListener('document:keydown.escape')
  protected cerrarVista(): void {
    this.vistaAbierta.set(false);
  }

  protected get progreso(): number {
    return Math.round(((this.store.paso() + 1) / this.store.totalPasos) * 100);
  }

  protected siguiente(): void {
    const actual = this.store.paso();
    if (!this.store.pasoValido(actual)) {
      this.store.mostrarErrores.set(true);
      return;
    }
    this.store.irA(actual + 1);
  }

  protected anterior(): void {
    this.store.irA(this.store.paso() - 1);
  }

  /** Permite saltar entre pasos, pero no dejar atrás datos obligatorios. */
  protected irA(paso: number): void {
    const incompleto = this.store.primerPasoIncompleto(paso);
    if (incompleto >= 0) {
      this.store.irA(incompleto);
      this.store.mostrarErrores.set(true);
      return;
    }
    this.store.irA(paso);
  }
}
