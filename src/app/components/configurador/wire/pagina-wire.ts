import { Component, input } from '@angular/core';
import { WireBloque } from './wire-bloque';

/** Página completa en maqueta: encabezado, secciones elegidas, pie y botón de WhatsApp. */
@Component({
  selector: 'app-pagina-wire',
  imports: [WireBloque],
  template: `
    <div class="pagina" [style]="variables()" [class.is-movil]="movil()">
      <app-wire-bloque id="header" [movil]="movil()" [extras]="extras()" />
      @for (id of secciones(); track id) {
        <app-wire-bloque [id]="id" [movil]="movil()" />
      } @empty {
        <div class="vacia">Escoge secciones para ver tu página</div>
      }
      <app-wire-bloque id="footer" [movil]="movil()" />
      @if (whatsapp()) {
        <span class="wa" aria-hidden="true"></span>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .pagina {
      position: relative;
      overflow: hidden;
      background: var(--wf-fondo);
    }

    .vacia {
      padding: 40px 16px;
      background: var(--wf-fondo);
      color: var(--wf-texto);
      font-size: 0.8rem;
      text-align: center;
      opacity: 0.6;
    }

    /* Botón flotante de WhatsApp fijo abajo a la derecha de la maqueta */
    .wa {
      position: sticky;
      bottom: 10px;
      display: block;
      width: 26px;
      height: 26px;
      margin: -36px 10px 10px auto;
      border-radius: 50%;
      background: #25d366;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    }
  `,
})
export class PaginaWire {
  readonly secciones = input<string[]>([]);
  readonly movil = input(false);
  readonly extras = input<string[]>([]);
  readonly whatsapp = input(false);
  /** Variables --wf-* de la paleta (ver paletaVista). */
  readonly variables = input<Record<string, string>>({});
}
