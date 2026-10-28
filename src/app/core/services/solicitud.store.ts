import { Injectable, computed, signal } from '@angular/core';
import { Solicitud } from '../models/solicitud.model';

const STORAGE_KEY = 'zenit-configurador-v1';

export const PASOS = [
  { id: 'datos', titulo: 'Tus datos' },
  { id: 'tipo', titulo: 'Tipo de proyecto' },
  { id: 'secciones', titulo: 'Secciones' },
  { id: 'marca', titulo: 'Marca y estilo' },
  { id: 'contacto', titulo: 'Contacto y redes' },
  { id: 'pagos', titulo: 'Pagos en línea' },
  { id: 'dominio', titulo: 'Dominio y hosting' },
  { id: 'extras', titulo: 'Extras' },
  { id: 'reunion', titulo: 'Reunión' },
  { id: 'resumen', titulo: 'Resumen y envío' },
] as const;

function generarCodigo(): string {
  const fecha = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ZD-${fecha}-${aleatorio}`;
}

function solicitudVacia(): Solicitud {
  return {
    codigo: generarCodigo(),
    creada: new Date().toISOString(),
    datos: {
      nombre: '',
      negocio: '',
      ciudad: '',
      whatsapp: '',
      correo: '',
      sitioActual: '',
      comentario: '',
    },
    proyecto: { tipo: '', comentario: '' },
    secciones: { seleccion: [], comentario: '' },
    marca: {
      logo: '',
      estiloLogo: '',
      usarColores: false,
      colorPrincipal: '#7c5cff',
      colorSecundario: '#35e3c4',
      estilo: '',
      comentario: '',
    },
    contacto: {
      whatsappBoton: '',
      instagram: '',
      facebook: '',
      tiktok: '',
      otraRed: '',
      direccion: '',
      horario: '',
      correoContacto: '',
      comentario: '',
    },
    pagos: { recibir: '', cuentaWompi: '', titular: '', comentario: '' },
    dominio: {
      estado: '',
      dominioActual: '',
      proveedor: '',
      deseado: '',
      alternativas: '',
      comentario: '',
    },
    hosting: {
      trafico: '',
      usuarios: false,
      baseDatos: false,
      panel: false,
      archivos: false,
      comentario: '',
    },
    extras: { seleccion: [], comentario: '' },
    reunion: { modalidad: '', fechas: ['', '', ''], franja: '', lugar: '', comentario: '' },
    comentarioGeneral: '',
  };
}

/**
 * Estado del configurador. La solicitud es un objeto mutable (se edita con
 * ngModel) y se guarda en localStorage para no perder el avance.
 */
@Injectable({ providedIn: 'root' })
export class SolicitudStore {
  readonly solicitud: Solicitud;
  readonly paso = signal(0);
  readonly totalPasos = PASOS.length;
  readonly esUltimo = computed(() => this.paso() === this.totalPasos - 1);
  /** Se activa cuando el cliente intenta avanzar con datos obligatorios vacíos. */
  readonly mostrarErrores = signal(false);

  constructor() {
    const guardado = this.leer();
    this.solicitud = guardado?.solicitud ?? solicitudVacia();
    this.paso.set(guardado?.paso ?? 0);
  }

  irA(paso: number): void {
    this.paso.set(Math.min(Math.max(paso, 0), this.totalPasos - 1));
    this.mostrarErrores.set(false);
    this.guardar();
  }

  /** Solo los datos de contacto y el tipo de proyecto son obligatorios. */
  pasoValido(paso: number): boolean {
    const s = this.solicitud;
    if (paso === 0) return !!s.datos.nombre.trim() && !!s.datos.whatsapp.trim();
    if (paso === 1) return !!s.proyecto.tipo;
    return true;
  }

  /** Primer paso obligatorio sin completar antes de `hasta`, o -1 si todo está bien. */
  primerPasoIncompleto(hasta: number): number {
    for (let i = 0; i < hasta; i++) if (!this.pasoValido(i)) return i;
    return -1;
  }

  /** Agrega o quita un id de una lista de selección múltiple. */
  alternar(lista: string[], id: string): void {
    const i = lista.indexOf(id);
    if (i >= 0) lista.splice(i, 1);
    else lista.push(id);
    this.guardar();
  }

  guardar(): void {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ solicitud: this.solicitud, paso: this.paso() }),
      );
    } catch {
      // Sin almacenamiento disponible (modo privado): el configurador sigue funcionando.
    }
  }

  reiniciar(): void {
    Object.assign(this.solicitud, solicitudVacia());
    this.irA(0);
  }

  private leer(): { solicitud: Solicitud; paso: number } | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      // Completa campos nuevos si la estructura cambió desde que se guardó.
      const base = solicitudVacia();
      for (const key of Object.keys(base) as (keyof Solicitud)[]) {
        const valor = data.solicitud?.[key];
        if (valor === undefined) continue;
        (base as unknown as Record<string, unknown>)[key] =
          typeof valor === 'object' && !Array.isArray(valor)
            ? { ...(base[key] as object), ...valor }
            : valor;
      }
      return { solicitud: base, paso: Number(data.paso) || 0 };
    } catch {
      return null;
    }
  }
}
