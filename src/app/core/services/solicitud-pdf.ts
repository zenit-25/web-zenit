import type { jsPDF } from 'jspdf';
import { SITE } from '../data/site.config';
import { Solicitud } from '../models/solicitud.model';
import { calcularHosting } from './hosting-score';
import {
  BloqueSolicitud,
  construirMensajeWhatsapp,
  contenidoSolicitud,
  nombreArchivo,
  pendientes,
} from './solicitud-export';

// Paleta del PDF (marca Zenit sobre fondo claro para que se pueda imprimir).
const C = {
  oscuro: [8, 8, 12],
  violeta: [124, 92, 255],
  azul: [91, 141, 255],
  turquesa: [53, 227, 196],
  texto: [31, 31, 46],
  gris: [105, 105, 125],
  linea: [225, 225, 235],
  suave: [245, 244, 255],
} as const;

const MARGEN = 18;
const ANCHO_ETIQUETA = 46;

type RGB = readonly [number, number, number];

/** Carga jsPDF solo cuando se necesita (no pesa en el resto del sitio). */
let jsPdfModulo: Promise<typeof import('jspdf')> | null = null;
export function precargarPdf(): Promise<typeof import('jspdf')> {
  jsPdfModulo ??= import('jspdf');
  return jsPdfModulo;
}

function hexARgb(hex: string): RGB {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

class Documento {
  readonly ancho: number;
  readonly alto: number;
  y = 0;

  constructor(readonly pdf: jsPDF) {
    this.ancho = pdf.internal.pageSize.getWidth();
    this.alto = pdf.internal.pageSize.getHeight();
  }

  get anchoUtil(): number {
    return this.ancho - MARGEN * 2;
  }

  color(rgb: RGB, tipo: 'texto' | 'relleno' | 'linea' = 'texto'): void {
    if (tipo === 'texto') this.pdf.setTextColor(...rgb);
    if (tipo === 'relleno') this.pdf.setFillColor(...rgb);
    if (tipo === 'linea') this.pdf.setDrawColor(...rgb);
  }

  /** Salta de página si no cabe un bloque de la altura dada. */
  espacio(alto: number): void {
    if (this.y + alto > this.alto - 20) {
      this.pdf.addPage();
      this.y = 22;
    }
  }

  /** Franja con degradado aproximado (violeta → azul → turquesa). */
  degradado(x: number, y: number, ancho: number, alto: number): void {
    const pasos = 40;
    for (let i = 0; i < pasos; i++) {
      const t = i / (pasos - 1);
      const [a, b, u] = t < 0.5 ? [C.violeta, C.azul, t * 2] : [C.azul, C.turquesa, (t - 0.5) * 2];
      const rgb = a.map((v, k) => Math.round(v + (b[k] - v) * u)) as unknown as RGB;
      this.color(rgb, 'relleno');
      this.pdf.rect(x + (ancho / pasos) * i, y, ancho / pasos + 0.3, alto, 'F');
    }
  }

  encabezado(s: Solicitud): void {
    const { pdf } = this;
    this.color(C.oscuro, 'relleno');
    pdf.rect(0, 0, this.ancho, 38, 'F');
    this.degradado(0, 38, this.ancho, 1.6);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    this.color(C.turquesa);
    pdf.text(SITE.brand.toUpperCase(), MARGEN, 15);

    pdf.setFontSize(19);
    this.color([255, 255, 255]);
    pdf.text('Solicitud de proyecto web', MARGEN, 25);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    this.color([190, 190, 210]);
    pdf.text(`Código: ${s.codigo}`, this.ancho - MARGEN, 15, { align: 'right' });
    pdf.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, this.ancho - MARGEN, 21, {
      align: 'right',
    });
    pdf.text(`${SITE.whatsappDisplay}  ·  ${SITE.email}`, this.ancho - MARGEN, 27, {
      align: 'right',
    });

    this.y = 50;
  }

  tituloBloque(numero: number, titulo: string): void {
    const { pdf } = this;
    this.espacio(18);
    this.color(C.violeta, 'relleno');
    pdf.roundedRect(MARGEN, this.y - 4.6, 7, 7, 1.5, 1.5, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    this.color([255, 255, 255]);
    pdf.text(String(numero), MARGEN + 3.5, this.y + 0.3, { align: 'center' });

    pdf.setFontSize(12);
    this.color(C.texto);
    pdf.text(titulo, MARGEN + 10, this.y + 0.4);
    this.y += 4;
    this.color(C.linea, 'linea');
    pdf.setLineWidth(0.3);
    pdf.line(MARGEN, this.y, this.ancho - MARGEN, this.y);
    this.y += 6;
  }

  fila(etiqueta: string, valor: string): void {
    const { pdf } = this;
    pdf.setFontSize(9.5);
    const lineas = pdf.splitTextToSize(valor, this.anchoUtil - ANCHO_ETIQUETA);
    this.espacio(lineas.length * 4.6 + 1.5);
    pdf.setFont('helvetica', 'bold');
    this.color(C.gris);
    pdf.text(etiqueta, MARGEN, this.y);
    pdf.setFont('helvetica', 'normal');
    this.color(C.texto);
    pdf.text(lineas, MARGEN + ANCHO_ETIQUETA, this.y);
    this.y += lineas.length * 4.6 + 1.5;
  }

  subtitulo(texto: string): void {
    this.espacio(10);
    this.y += 1.5;
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(9.5);
    this.color(C.gris);
    this.pdf.text(texto, MARGEN, this.y);
    this.y += 5.5;
  }

  lista(items: string[]): void {
    const { pdf } = this;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    for (const item of items) {
      const lineas = pdf.splitTextToSize(item, this.anchoUtil - 6);
      this.espacio(lineas.length * 4.6 + 1);
      this.color(C.turquesa, 'relleno');
      pdf.circle(MARGEN + 1.4, this.y - 1.2, 0.9, 'F');
      this.color(C.texto);
      pdf.text(lineas, MARGEN + 5, this.y);
      this.y += lineas.length * 4.6 + 1;
    }
    this.y += 1;
  }

  colores(colores: { hex: string; uso: string }[]): void {
    const { pdf } = this;
    this.espacio(16);
    const ancho = Math.min(34, (this.anchoUtil - 4 * 4) / Math.max(colores.length, 1));
    colores.forEach((c, i) => {
      const x = MARGEN + i * (ancho + 4);
      this.color(hexARgb(c.hex), 'relleno');
      this.color(C.linea, 'linea');
      pdf.roundedRect(x, this.y - 3, ancho, 9, 1.5, 1.5, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      this.color(C.texto);
      pdf.text(c.hex, x, this.y + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      this.color(C.gris);
      pdf.text(pdf.splitTextToSize(c.uso, ancho), x, this.y + 14);
    });
    this.y += 24;
  }

  comentario(texto: string): void {
    const { pdf } = this;
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9);
    const lineas = pdf.splitTextToSize(`"${texto.trim()}"`, this.anchoUtil - 10);
    const alto = lineas.length * 4.4 + 7;
    this.espacio(alto + 2);
    this.color(C.suave, 'relleno');
    pdf.roundedRect(MARGEN, this.y - 3, this.anchoUtil, alto, 2, 2, 'F');
    this.color(C.violeta, 'relleno');
    pdf.rect(MARGEN, this.y - 3, 1.2, alto, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    this.color(C.violeta);
    pdf.text('COMENTARIO DEL CLIENTE', MARGEN + 5, this.y + 0.8);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9);
    this.color(C.texto);
    pdf.text(lineas, MARGEN + 5, this.y + 5.4);
    this.y += alto + 2;
  }

  bloque(numero: number, b: BloqueSolicitud): void {
    this.tituloBloque(numero, b.titulo);
    for (const [etiqueta, valor] of b.filas) this.fila(etiqueta, valor);
    if (b.lista && b.listaTitulo) this.subtitulo(b.listaTitulo);
    if (b.lista) b.lista.length ? this.lista(b.lista) : this.fila('Selección', 'Ninguno');
    if (b.colores?.length) {
      this.y += 2;
      this.colores(b.colores);
    }
    if (b.comentario?.trim()) this.comentario(b.comentario);
    this.y += 6;
  }

  recuadro(titulo: string, lineas: string[], acento: RGB): void {
    const { pdf } = this;
    pdf.setFontSize(9.5);
    const partes = lineas.map((l) => pdf.splitTextToSize(l, this.anchoUtil - 12) as string[]);
    const alto = 12 + partes.reduce((t, p) => t + p.length * 4.6 + 1, 0);
    this.espacio(alto + 4);
    this.color(acento, 'linea');
    pdf.setLineWidth(0.5);
    pdf.roundedRect(MARGEN, this.y, this.anchoUtil, alto, 2.5, 2.5, 'S');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    this.color(C.texto);
    pdf.text(titulo, MARGEN + 6, this.y + 7.5);
    let y = this.y + 13.5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    for (const p of partes) {
      this.color(acento, 'relleno');
      pdf.circle(MARGEN + 7.4, y - 1.2, 0.9, 'F');
      this.color(C.texto);
      pdf.text(p, MARGEN + 11, y);
      y += p.length * 4.6 + 1;
    }
    this.y += alto + 8;
  }

  piePaginas(): void {
    const { pdf } = this;
    const total = pdf.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      pdf.setPage(i);
      this.color(C.linea, 'linea');
      pdf.setLineWidth(0.3);
      pdf.line(MARGEN, this.alto - 13, this.ancho - MARGEN, this.alto - 13);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      this.color(C.gris);
      pdf.text(`${SITE.brand} · Diseña tu página`, MARGEN, this.alto - 8);
      pdf.text(`Página ${i} de ${total}`, this.ancho - MARGEN, this.alto - 8, { align: 'right' });
    }
  }
}

/** Genera el PDF con toda la solicitud. */
export async function generarPdf(s: Solicitud): Promise<Blob> {
  const { jsPDF } = await precargarPdf();
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  pdf.setProperties({
    title: `Solicitud ${s.codigo}`,
    author: s.datos.nombre,
    creator: SITE.brand,
  });
  const doc = new Documento(pdf);

  doc.encabezado(s);

  const hosting = calcularHosting(s);
  doc.recuadro(
    `Hosting recomendado: ${hosting.nivel.nombre}`,
    [
      hosting.nivel.explicacion,
      `${hosting.nivel.costo} La decisión final se confirma en la cotización.`,
    ],
    C.turquesa,
  );

  const tareas = pendientes(s);
  if (tareas.length) doc.recuadro('Próximos pasos', tareas, C.violeta);

  contenidoSolicitud(s).forEach((b, i) => doc.bloque(i + 1, b));

  if (s.comentarioGeneral.trim()) {
    doc.tituloBloque(10, 'Comentario general');
    doc.comentario(s.comentarioGeneral);
  }

  doc.piePaginas();
  return pdf.output('blob');
}

export async function descargarPdf(s: Solicitud): Promise<void> {
  const blob = await generarPdf(s);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo(s);
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function verPdf(s: Solicitud): Promise<void> {
  const blob = await generarPdf(s);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Envía el PDF por WhatsApp. Si el dispositivo permite compartir archivos
 * (celulares y Windows con WhatsApp instalado), abre el menú "Compartir" con
 * el PDF adjunto. Si no, descarga el PDF y abre WhatsApp con el mensaje.
 */
export async function enviarPorWhatsapp(
  s: Solicitud,
  forzarDescarga = false,
): Promise<'compartido' | 'descargado' | 'cancelado'> {
  const blob = await generarPdf(s);
  const archivo = new File([blob], nombreArchivo(s), { type: 'application/pdf' });

  if (!forzarDescarga && navigator.canShare?.({ files: [archivo] })) {
    try {
      await navigator.share({
        files: [archivo],
        title: `Solicitud ${s.codigo}`,
        text: construirMensajeWhatsapp(s, true),
      });
      return 'compartido';
    } catch (e) {
      if ((e as DOMException).name === 'AbortError') return 'cancelado';
      // Si compartir falla por otro motivo, seguimos con la descarga.
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = archivo.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  const texto = encodeURIComponent(construirMensajeWhatsapp(s, false));
  window.open(`https://wa.me/${SITE.whatsappNumber}?text=${texto}`, '_blank', 'noopener');
  return 'descargado';
}
