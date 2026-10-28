import { Component, input, signal } from '@angular/core';

/** Botón "ⓘ" que despliega una explicación para que el cliente entienda qué está pidiendo. */
@Component({
  selector: 'app-info-tip',
  template: `
    <button
      type="button"
      class="info-toggle"
      [class.is-open]="abierto()"
      [attr.aria-expanded]="abierto()"
      (click)="abierto.set(!abierto())"
    >
      <span class="info-icon" aria-hidden="true">i</span>
      {{ titulo() }}
    </button>
    @if (abierto()) {
      <div class="info-body">
        <ng-content />
      </div>
    }
  `,
  styleUrl: './info-tip.scss',
})
export class InfoTip {
  readonly titulo = input('¿Qué es esto?');
  protected readonly abierto = signal(false);
}
