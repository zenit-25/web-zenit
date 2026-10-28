import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ESTADOS_SOLICITUD,
  EstadoSolicitud,
  SinSesion,
  SolicitudDetalle,
  adminApi,
} from '../../../core/services/admin-api';
import {
  BloqueSolicitud,
  contenidoSolicitud,
  pendientes,
} from '../../../core/services/solicitud-export';
import { verPdf } from '../../../core/services/solicitud-pdf';
import { completarSolicitud } from '../../../core/services/solicitud.store';
import { fechaCorta } from '../fecha';
import { sinIndexar } from '../sin-indexar';

@Component({
  selector: 'app-admin-detalle',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-detalle.html',
})
export class AdminDetalle {
  private readonly router = inject(Router);
  private readonly codigo = inject(ActivatedRoute).snapshot.paramMap.get('codigo') ?? '';
  protected readonly estados = ESTADOS_SOLICITUD;
  protected readonly fecha = fechaCorta;
  protected readonly solicitud = signal<SolicitudDetalle | null>(null);
  protected readonly bloques = signal<BloqueSolicitud[]>([]);
  protected readonly tareas = signal<string[]>([]);
  protected readonly error = signal('');
  protected readonly guardando = signal(false);
  protected readonly notasGuardadas = signal(true);
  protected notas = '';

  constructor() {
    sinIndexar();
    this.cargar();
  }

  private mostrar(d: SolicitudDetalle): void {
    d.datos = completarSolicitud(d.datos);
    this.solicitud.set(d);
    this.bloques.set(contenidoSolicitud(d.datos));
    this.tareas.set(pendientes(d.datos));
    this.notas = d.notas;
    this.notasGuardadas.set(true);
  }

  private manejarError(e: unknown): void {
    if (e instanceof SinSesion) this.router.navigateByUrl('/admin/entrar');
    else this.error.set('No se pudo completar la acción. Intenta de nuevo.');
  }

  private async cargar(): Promise<void> {
    try {
      this.mostrar(await adminApi.detalle(this.codigo));
    } catch (e) {
      this.manejarError(e);
    }
  }

  protected async cambiarEstado(estado: EstadoSolicitud): Promise<void> {
    if (this.solicitud()?.estado === estado) return;
    this.guardando.set(true);
    try {
      const d = await adminApi.actualizar(this.codigo, { estado });
      this.mostrar({ ...d, notas: this.notasGuardadas() ? d.notas : this.notas });
    } catch (e) {
      this.manejarError(e);
    } finally {
      this.guardando.set(false);
    }
  }

  protected async guardarNotas(): Promise<void> {
    this.guardando.set(true);
    try {
      this.mostrar(await adminApi.actualizar(this.codigo, { notas: this.notas }));
    } catch (e) {
      this.manejarError(e);
    } finally {
      this.guardando.set(false);
    }
  }

  /** Enlace de WhatsApp al cliente; agrega el indicativo de Colombia a celulares de 10 dígitos. */
  protected whatsappCliente(d: SolicitudDetalle): string {
    let numero = d.whatsapp.replace(/\D/g, '');
    if (numero.length === 10 && numero.startsWith('3')) numero = `57${numero}`;
    const texto = `Hola ${d.nombre}, te escribimos de Zenit Digital por tu solicitud ${d.codigo}.`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  }

  protected pdf(d: SolicitudDetalle): void {
    verPdf(d.datos);
  }
}
