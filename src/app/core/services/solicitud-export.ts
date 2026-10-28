import {
  ESTILOS_VISUALES,
  EXTRAS,
  SECCIONES,
  TEMAS,
  TIPOS_PROYECTO,
  USOS_COLOR,
} from '../data/configurador/catalogo.data';
import { SITE } from '../data/site.config';
import { ColorMarca, OpcionCatalogo, Solicitud } from '../models/solicitud.model';
import { calcularHosting } from './hosting-score';
import { resumirHorario } from './horario';

const ETIQUETAS = {
  logo: {
    tengo: 'Ya tiene logo (lo enviará por WhatsApp)',
    crear: 'Solicita creación de logo',
    no: 'No necesita logo',
  },
  recibir: { si: 'Sí', no: 'No', despues: 'Más adelante' },
  cuentaWompi: {
    tengo: 'Ya tiene cuenta',
    crear: 'La creará por su cuenta',
    ayuda: 'Necesita ayuda para crearla',
  },
  titular: { natural: 'Persona natural', empresa: 'Empresa' },
  dominio: { tengo: 'Ya tiene dominio', necesito: 'Necesita comprar uno', nose: 'No está seguro' },
  trafico: {
    bajo: 'Bajo (hasta 1.000 visitas al mes)',
    medio: 'Medio (1.000 a 10.000 visitas al mes)',
    alto: 'Alto (más de 10.000 visitas al mes)',
  },
  modalidad: {
    presencial: 'Presencial',
    virtual: 'Videollamada',
    whatsapp: 'Acordar por WhatsApp',
  },
  franja: { manana: 'Mañana', tarde: 'Tarde', noche: 'Noche' },
} as const;

function etiqueta<T extends Record<string, string>>(mapa: T, valor: string): string {
  return (mapa as Record<string, string>)[valor] ?? 'Sin responder';
}

function nombre(catalogo: OpcionCatalogo[], id: string): string {
  return catalogo.find((o) => o.id === id)?.nombre ?? '';
}

function nombres(catalogo: OpcionCatalogo[], ids: string[]): string[] {
  return catalogo.filter((o) => ids.includes(o.id)).map((o) => o.nombre);
}

function fecha(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Tareas que Zenit debe preparar según lo que pidió el cliente. */
export function pendientes(s: Solicitud): string[] {
  const lista: string[] = [];
  if (s.marca.logo === 'tengo') lista.push('Recibir el archivo del logo por WhatsApp');
  if (s.marca.logo === 'crear') lista.push('Diseñar una propuesta de logo');
  if (s.pagos.recibir !== 'no' && s.pagos.cuentaWompi === 'ayuda')
    lista.push('Acompañar la creación de la cuenta Wompi');
  if (s.pagos.recibir !== 'no' && s.pagos.cuentaWompi === 'crear')
    lista.push('Confirmar que la cuenta Wompi esté aprobada');
  if (s.dominio.estado === 'necesito') lista.push('Verificar la disponibilidad del dominio');
  if (s.extras.seleccion.includes('redaccion')) lista.push('Redactar los textos de la página');
  if (s.reunion.modalidad) lista.push('Confirmar la fecha de la reunión y preparar el boceto');
  return lista;
}

/** Un bloque del documento: título, filas "etiqueta: valor" y piezas opcionales. */
export interface BloqueSolicitud {
  titulo: string;
  filas: [string, string][];
  lista?: string[];
  /** Etiqueta que va encima de la lista (si no es la lista principal del bloque). */
  listaTitulo?: string;
  colores?: { hex: string; uso: string }[];
  comentario?: string;
}

/** Quita filas sin valor para que el documento solo muestre lo que el cliente llenó. */
function filas(...pares: [string, string | undefined][]): [string, string][] {
  return pares.filter((p): p is [string, string] => !!p[1]?.trim());
}

function colores(lista: ColorMarca[]) {
  return lista.map((c) => ({ hex: c.hex.toUpperCase(), uso: nombre(USOS_COLOR, c.uso) }));
}

/** Contenido completo de la solicitud, organizado para el PDF. */
export function contenidoSolicitud(s: Solicitud): BloqueSolicitud[] {
  const hosting = calcularHosting(s);
  const pagosActivos = s.pagos.recibir === 'si' || s.pagos.recibir === 'despues';

  return [
    {
      titulo: 'Datos del cliente',
      filas: filas(
        ['Nombre', s.datos.nombre],
        ['Negocio o marca', s.datos.negocio],
        ['WhatsApp', s.datos.whatsapp],
        ['Correo', s.datos.correo],
        ['Ciudad', s.datos.ciudad],
      ),
      comentario: s.datos.comentario,
    },
    {
      titulo: 'Tipo de proyecto',
      filas: filas(['Proyecto', nombre(TIPOS_PROYECTO, s.proyecto.tipo) || 'Sin seleccionar']),
      comentario: s.proyecto.comentario,
    },
    {
      titulo: 'Secciones de la página',
      filas: [],
      lista: nombres(SECCIONES, s.secciones.seleccion),
      comentario: s.secciones.comentario,
    },
    {
      titulo: 'Marca y estilo',
      filas: filas(
        ['Logo', etiqueta(ETIQUETAS.logo, s.marca.logo)],
        ['Idea para el logo', s.marca.logo === 'crear' ? s.marca.estiloLogo : ''],
        ['Tema', nombre(TEMAS, s.marca.tema) || 'Sin definir'],
        [
          'Colores',
          s.marca.paleta === 'propios'
            ? `${s.marca.colores.length} definidos por el cliente`
            : s.marca.paleta === 'zenit'
              ? 'Los propone Zenit'
              : 'Sin definir',
        ],
        ['Estilo visual', nombre(ESTILOS_VISUALES, s.marca.estilo) || 'Sin definir'],
      ),
      colores: s.marca.paleta === 'propios' ? colores(s.marca.colores) : undefined,
      comentario: s.marca.comentario,
    },
    {
      titulo: 'Contacto y redes (se muestran en la página)',
      filas: filas(
        ['WhatsApp del botón', s.contacto.whatsappBoton],
        ['Correo de contacto', s.contacto.correoContacto],
        ['Instagram', s.contacto.instagram],
        ['Facebook', s.contacto.facebook],
        ['TikTok', s.contacto.tiktok],
        ['Otra red', s.contacto.otraRed],
        ['Dirección', s.contacto.direccion],
        ['Notas del horario', s.contacto.mostrarHorario ? s.contacto.horarioNota : ''],
      ),
      lista: s.contacto.mostrarHorario ? resumirHorario(s.contacto.horario) : undefined,
      listaTitulo: 'Horario de atención',
      comentario: s.contacto.comentario,
    },
    {
      titulo: 'Pagos en línea (Wompi)',
      filas: filas(
        ['Recibir pagos', etiqueta(ETIQUETAS.recibir, s.pagos.recibir)],
        ['Cuenta Wompi', pagosActivos ? etiqueta(ETIQUETAS.cuentaWompi, s.pagos.cuentaWompi) : ''],
        ['Titular', pagosActivos ? etiqueta(ETIQUETAS.titular, s.pagos.titular) : ''],
      ),
      comentario: s.pagos.comentario,
    },
    {
      titulo: 'Dominio y hosting',
      filas: filas(
        ['Dominio', etiqueta(ETIQUETAS.dominio, s.dominio.estado)],
        ['Dominio actual', s.dominio.estado === 'tengo' ? s.dominio.dominioActual : ''],
        ['Comprado en', s.dominio.estado === 'tengo' ? s.dominio.proveedor : ''],
        ['Dominio deseado', s.dominio.estado === 'necesito' ? s.dominio.deseado : ''],
        ['Alternativas', s.dominio.estado === 'necesito' ? s.dominio.alternativas : ''],
        ['Tráfico esperado', etiqueta(ETIQUETAS.trafico, s.hosting.trafico)],
        ['Hosting sugerido', `${hosting.nivel.nombre} (puntaje ${hosting.puntos})`],
        ['Motivos', hosting.detalle.map((d) => `${d.motivo} +${d.puntos}`).join(', ')],
      ),
      comentario: s.dominio.comentario,
    },
    {
      titulo: 'Extras',
      filas: [],
      lista: nombres(EXTRAS, s.extras.seleccion),
      comentario: s.extras.comentario,
    },
    {
      titulo: 'Reunión para presentar el boceto',
      filas: filas(
        ['Modalidad', etiqueta(ETIQUETAS.modalidad, s.reunion.modalidad)],
        ['Fechas posibles', s.reunion.fechas.filter(Boolean).map(fecha).join('  /  ')],
        ['Franja horaria', s.reunion.franja ? ETIQUETAS.franja[s.reunion.franja] : ''],
        ['Lugar', s.reunion.modalidad === 'presencial' ? s.reunion.lugar : ''],
      ),
      comentario: s.reunion.comentario,
    },
  ];
}

/** Mensaje corto para WhatsApp; el detalle completo va en el PDF. */
export function construirMensajeWhatsapp(s: Solicitud, conPdfAdjunto: boolean): string {
  const tipo = nombre(TIPOS_PROYECTO, s.proyecto.tipo) || 'Por definir';
  const modalidad = s.reunion.modalidad ? ETIQUETAS.modalidad[s.reunion.modalidad] : 'Por definir';
  const extras = nombres(EXTRAS, s.extras.seleccion);
  return [
    `Hola ${SITE.brand}, armé mi solicitud de página web.`,
    '',
    `Código: ${s.codigo}`,
    `Nombre: ${s.datos.nombre}${s.datos.negocio ? ` (${s.datos.negocio})` : ''}`,
    `Proyecto: ${tipo}`,
    `Secciones: ${s.secciones.seleccion.length} seleccionadas`,
    `Pagos en línea: ${etiqueta(ETIQUETAS.recibir, s.pagos.recibir)}`,
    `Extras: ${extras.length ? extras.join(', ') : 'Ninguno'}`,
    `Reunión: ${modalidad}`,
    '',
    conPdfAdjunto
      ? 'Te envío el PDF con todos los detalles.'
      : 'Ya descargué el PDF con todos los detalles y te lo adjunto en este chat.',
  ].join('\n');
}

export function nombreArchivo(s: Solicitud): string {
  const base = (s.datos.negocio || s.datos.nombre || 'cliente')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `solicitud-${s.codigo}-${base}.pdf`;
}
