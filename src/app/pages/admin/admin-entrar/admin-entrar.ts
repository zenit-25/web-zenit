import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { adminApi } from '../../../core/services/admin-api';
import { sinIndexar } from '../sin-indexar';

@Component({
  selector: 'app-admin-entrar',
  imports: [FormsModule],
  template: `
    <section class="adm adm-entrar">
      <form class="card adm-login" (ngSubmit)="entrar()">
        <div class="eyebrow">Panel privado</div>
        <h1>Solicitudes de clientes</h1>
        <label class="adm-field">
          <span>Contraseña</span>
          <input
            type="password"
            name="clave"
            autocomplete="current-password"
            required
            [(ngModel)]="clave"
            [disabled]="cargando()"
          />
        </label>
        @if (error()) {
          <p class="adm-error" role="alert">Contraseña incorrecta.</p>
        }
        <button type="submit" class="btn btn-primary" [disabled]="cargando() || !clave">
          {{ cargando() ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </section>
  `,
})
export class AdminEntrar {
  private readonly router = inject(Router);
  protected clave = '';
  protected readonly cargando = signal(false);
  protected readonly error = signal(false);

  constructor() {
    sinIndexar();
  }

  protected async entrar(): Promise<void> {
    this.cargando.set(true);
    this.error.set(false);
    const ok = await adminApi.entrar(this.clave);
    this.cargando.set(false);
    if (ok) {
      this.clave = '';
      this.router.navigateByUrl('/admin');
    } else {
      this.error.set(true);
    }
  }
}
