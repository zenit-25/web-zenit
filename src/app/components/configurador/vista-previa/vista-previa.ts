import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { SECCIONES } from '../../../core/data/configurador/catalogo.data';
import { paletaVista, variablesPaleta } from '../../../core/services/paleta-vista';
import { SolicitudStore } from '../../../core/services/solicitud.store';
import { PaginaWire } from '../wire/pagina-wire';

/** Ancho al que se dibuja la maqueta antes de escalarla al espacio disponible. */
const ANCHO = { escritorio: 680, movil: 360 } as const;

/** Vista previa esquemática que se arma en vivo con lo que escoge el cliente. */
@Component({
  selector: 'app-vista-previa',
  imports: [PaginaWire],
  templateUrl: './vista-previa.html',
  styleUrl: './vista-previa.scss',
})
export class VistaPrevia {
  private readonly store = inject(SolicitudStore);
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly dispositivo = signal<'escritorio' | 'movil'>('escritorio');
  private readonly anchoDisponible = signal(320);
  /** Oculta el encabezado con el título (cuando el contenedor ya tiene uno). */
  readonly sinTitulo = input(false);

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const observador = new ResizeObserver(([e]) => this.anchoDisponible.set(e.contentRect.width));
      observador.observe(this.host.nativeElement);
      destroy.onDestroy(() => observador.disconnect());
    });
  }

  protected get escala(): number {
    const margen = this.dispositivo() === 'movil' ? 0.62 : 1;
    return Math.min(1, (this.anchoDisponible() * margen) / ANCHO[this.dispositivo()]);
  }

  protected get ancho(): number {
    return ANCHO[this.dispositivo()];
  }

  /** Secciones elegidas en el orden en que aparecen en la página (+ panel y blog). */
  protected readonly secciones = computed(() => {
    this.store.cambios();
    const s = this.store.solicitud;
    const ids = SECCIONES.map((x) => x.id).filter((id) => s.secciones.seleccion.includes(id));
    if (s.proyecto.tipo === 'sistema' || s.hosting.panel) {
      ids.splice(ids[0] === 'inicio' ? 1 : 0, 0, 'panel');
    }
    if (s.extras.seleccion.includes('blog')) {
      const antes = ids.findIndex((id) => id === 'formulario' || id === 'mapa' || id === 'redes');
      ids.splice(antes < 0 ? ids.length : antes, 0, 'blog');
    }
    return ids;
  });

  protected readonly extras = computed(() => {
    this.store.cambios();
    const s = this.store.solicitud;
    const lista: string[] = [];
    if (s.extras.seleccion.includes('idiomas')) lista.push('idiomas');
    if (s.pagos.recibir === 'si' || s.proyecto.tipo === 'tienda') lista.push('carrito');
    if (s.extras.seleccion.includes('reservas') || s.proyecto.tipo === 'citas') {
      lista.push('reservas');
    }
    return lista;
  });

  protected readonly variables = computed(() => {
    this.store.cambios();
    return variablesPaleta(paletaVista(this.store.solicitud));
  });
}
