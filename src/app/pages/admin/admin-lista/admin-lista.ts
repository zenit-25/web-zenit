import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TIPOS_PROYECTO } from '../../../core/data/configurador/catalogo.data';
import {
  ESTADOS_SOLICITUD,
  SinSesion,
  SolicitudResumen,
  adminApi,
} from '../../../core/services/admin-api';
import { fechaCorta } from '../fecha';
import { sinIndexar } from '../sin-indexar';

@Component({
  selector: 'app-admin-lista',
  imports: [RouterLink],
  templateUrl: './admin-lista.html',
})
export class AdminLista {
  private readonly router = inject(Router);
  protected readonly estados = ESTADOS_SOLICITUD;
  protected readonly fecha = fechaCorta;
  protected readonly solicitudes = signal<SolicitudResumen[]>([]);
  protected readonly conteo = signal<Record<string, number>>({});
  protected readonly filtro = signal('');
  protected readonly busqueda = signal('');
  protected readonly cargando = signal(true);
  protected readonly error = signal(false);
  protected readonly total = computed(() =>
    Object.values(this.conteo()).reduce((t, n) => t + n, 0),
  );
  private espera?: ReturnType<typeof setTimeout>;

  constructor() {
    sinIndexar();
    this.cargar();
  }

  protected async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set(false);
    try {
      const r = await adminApi.listar(this.filtro(), this.busqueda());
      this.solicitudes.set(r.solicitudes);
      this.conteo.set(Object.fromEntries(r.conteo.map((c) => [c.estado, c.total])));
    } catch (e) {
      if (e instanceof SinSesion) this.router.navigateByUrl('/admin/entrar');
      else this.error.set(true);
    } finally {
      this.cargando.set(false);
    }
  }

  protected filtrar(estado: string): void {
    this.filtro.set(estado);
    this.cargar();
  }

  protected buscar(texto: string): void {
    this.busqueda.set(texto);
    clearTimeout(this.espera);
    this.espera = setTimeout(() => this.cargar(), 350);
  }

  protected tipo(id: string): string {
    return TIPOS_PROYECTO.find((t) => t.id === id)?.nombre ?? id;
  }

  protected estado(id: string) {
    return ESTADOS_SOLICITUD.find((e) => e.id === id) ?? ESTADOS_SOLICITUD[0];
  }

  protected async salir(): Promise<void> {
    await adminApi.salir().catch(() => undefined);
    this.router.navigateByUrl('/admin/entrar');
  }
}
