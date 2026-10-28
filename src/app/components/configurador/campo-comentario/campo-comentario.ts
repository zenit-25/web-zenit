import { Component, input, model, signal } from '@angular/core';

/** Comentario opcional que el cliente puede agregar al final de cada paso. */
@Component({
  selector: 'app-campo-comentario',
  template: `
    @if (abierto() || valor()) {
      <label class="comentario">
        <span class="comentario-label">¿Algo específico? <em>(opcional)</em></span>
        <textarea
          rows="3"
          [placeholder]="placeholder()"
          [value]="valor()"
          (input)="valor.set($any($event.target).value)"
        ></textarea>
      </label>
    } @else {
      <button type="button" class="comentario-add" (click)="abierto.set(true)">
        + Agregar un comentario (opcional)
      </button>
    }
  `,
  styleUrl: './campo-comentario.scss',
})
export class CampoComentario {
  readonly valor = model('');
  readonly placeholder = input('Cuéntanos cualquier detalle que quieras para esta parte.');
  protected readonly abierto = signal(false);
}
