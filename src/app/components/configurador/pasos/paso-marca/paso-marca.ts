import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ESTILOS_VISUALES,
  MAX_COLORES,
  TEMAS,
  USOS_COLOR,
} from '../../../../core/data/configurador/catalogo.data';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { paletaVista } from '../../../../core/services/paleta-vista';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';
import { InfoTip } from '../../info-tip/info-tip';

type Marca = Solicitud['marca'];

/** Colores sugeridos al agregar uno nuevo, para no repetir siempre el mismo. */
const SUGERIDOS = ['#35e3c4', '#f2a541', '#ff5c7a', '#1f2a37', '#ffffff'];

@Component({
  selector: 'app-paso-marca',
  imports: [FormsModule, CampoComentario, InfoTip],
  templateUrl: './paso-marca.html',
  styleUrl: './paso-marca.scss',
})
export class PasoMarca {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly estilos = ESTILOS_VISUALES;
  protected readonly temas = TEMAS;
  protected readonly usos = USOS_COLOR;
  protected readonly maxColores = MAX_COLORES;

  protected readonly opcionesLogo: { id: Marca['logo']; nombre: string; info: string }[] = [
    {
      id: 'tengo',
      nombre: 'Ya tengo logo',
      info: 'Al final nos lo envías por WhatsApp, idealmente en PNG o PDF.',
    },
    {
      id: 'crear',
      nombre: 'Quiero que me creen uno',
      info: 'Diseñamos un logo para tu marca; cuéntanos tu idea abajo.',
    },
    {
      id: 'no',
      nombre: 'No necesito logo',
      info: 'Usaremos el nombre de tu negocio con una tipografía cuidada.',
    },
  ];

  protected readonly opcionesPaleta: { id: Marca['paleta']; nombre: string; info: string }[] = [
    {
      id: 'propios',
      nombre: 'Tengo mis colores',
      info: 'Los escojo yo o son los de mi logo, y digo dónde van.',
    },
    {
      id: 'zenit',
      nombre: 'Que Zenit los proponga',
      info: 'Te sugerimos una paleta acorde a tu negocio.',
    },
  ];

  protected elegir<K extends keyof Marca>(campo: K, valor: Marca[K]): void {
    this.s.marca[campo] = valor;
    this.store.guardar();
  }

  protected agregarColor(): void {
    const colores = this.s.marca.colores;
    if (colores.length >= MAX_COLORES) return;
    const usados = new Set(colores.map((c) => c.uso));
    const uso = USOS_COLOR.find((u) => !usados.has(u.id))?.id ?? 'libre';
    colores.push({ hex: SUGERIDOS[colores.length % SUGERIDOS.length], uso });
    this.store.guardar();
  }

  protected quitarColor(i: number): void {
    this.s.marca.colores.splice(i, 1);
    this.store.guardar();
  }

  /** Colores de la mini vista previa (los mismos de la vista previa general). */
  protected get preview() {
    return paletaVista(this.s);
  }
}
