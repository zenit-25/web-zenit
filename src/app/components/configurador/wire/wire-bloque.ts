import { Component, input } from '@angular/core';

/**
 * Una sección de la página dibujada como maqueta esquemática: solo recuadros
 * planos, sombras y los colores del cliente (variables --wf-*), sin contenido.
 */
@Component({
  selector: 'app-wire-bloque',
  templateUrl: './wire-bloque.html',
  styleUrl: './wire-bloque.scss',
  host: { '[class]': "'wb wb-' + id()", '[class.is-movil]': 'movil()' },
})
export class WireBloque {
  readonly id = input.required<string>();
  /** En celular las cuadrículas pasan a una o dos columnas. */
  readonly movil = input(false);
  /** Extras que se notan en el encabezado: 'idiomas', 'carrito', 'reservas'. */
  readonly extras = input<string[]>([]);

  protected readonly tres = [0, 1, 2];
  protected readonly cuatro = [0, 1, 2, 3];
  protected readonly seis = [0, 1, 2, 3, 4, 5];
}
