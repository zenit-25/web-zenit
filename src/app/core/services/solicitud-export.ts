import {
  ESTILOS_VISUALES,
  EXTRAS,
  SECCIONES,
  TIPOS_PROYECTO,
} from '../data/configurador/catalogo.data';
import { SITE } from '../data/site.config';
import { OpcionCatalogo, Solicitud } from '../models/solicitud.model';
import { calcularHosting } from './hosting-score';

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
    medio: 'Medio (1.000 a 10.000)',
    alto: 'Alto (más de 10.000)',
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

function nombres(catalogo: OpcionCatalogo[], ids: string[]): string {
  const lista = catalogo.filter((o) => ids.includes(o.id)).map((o) => o.nombre);
  return lista.length ? lista.join(', ') : 'Ninguno';
}

function fecha(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Tareas que Zenit debe preparar según lo que pidió el cliente. */
export function pendientes(s: Solicitud): string[] {
  const lista: string[] = [];
  if (s.marca.logo === 'tengo') lista.push('Pedir el archivo del logo por WhatsApp');
  if (s.marca.logo === 'crear') lista.push('Diseñar propuesta de logo');
  if (s.pagos.recibir !== 'no' && s.pagos.cuentaWompi === 'ayuda')
    lista.push('Acompañar la creación de la cuenta Wompi');
  if (s.pagos.recibir !== 'no' && s.pagos.cuentaWompi === 'crear')
    lista.push('Confirmar que la cuenta Wompi esté aprobada');
  if (s.dominio.estado === 'necesito') lista.push('Verificar disponibilidad del dominio');
  if (s.extras.seleccion.includes('redaccion')) lista.push('Redactar los textos de la página');
  if (s.reunion.modalidad) lista.push('Confirmar fecha de la reunión y preparar el boceto');
  return lista;
}

function linea(etiquetaTexto: string, valor: string | undefined): string {
  return valor ? `${etiquetaTexto}: ${valor}\n` : '';
}

function comentario(texto: string): string {
  return texto.trim() ? `Comentario: ${texto.trim()}\n` : '';
}

/** Archivo .txt completo con toda la solicitud. */
export function construirTxt(s: Solicitud): string {
  const tipo = TIPOS_PROYECTO.find((t) => t.id === s.proyecto.tipo);
  const hosting = calcularHosting(s);
  const estilo = ESTILOS_VISUALES.find((e) => e.id === s.marca.estilo);
  const sep = '='.repeat(56);
  const fechas = s.reunion.fechas.filter(Boolean).map(fecha).join(' / ');
  const tareas = pendientes(s);

  let txt = `${sep}\n  SOLICITUD DE PROYECTO WEB — ${SITE.brand.toUpperCase()}\n`;
  txt += `  Código: ${s.codigo}    Fecha: ${new Date().toLocaleDateString('es-CO')}\n${sep}\n\n`;

  txt += '[1] DATOS DEL CLIENTE\n';
  txt += linea('Nombre', s.datos.nombre);
  txt += linea('Negocio', s.datos.negocio);
  txt += linea('Ciudad', s.datos.ciudad);
  txt += linea('WhatsApp', s.datos.whatsapp);
  txt += linea('Correo', s.datos.correo);
  txt += linea('Sitio actual', s.datos.sitioActual);
  txt += comentario(s.datos.comentario) + '\n';

  txt += '[2] TIPO DE PROYECTO\n';
  txt += `${tipo?.nombre ?? 'Sin seleccionar'}\n`;
  txt += comentario(s.proyecto.comentario) + '\n';

  txt += '[3] SECCIONES\n';
  txt += `${nombres(SECCIONES, s.secciones.seleccion)}\n`;
  txt += comentario(s.secciones.comentario) + '\n';

  txt += '[4] MARCA Y ESTILO\n';
  txt += `Logo: ${etiqueta(ETIQUETAS.logo, s.marca.logo)}\n`;
  if (s.marca.logo === 'crear') txt += linea('Idea para el logo', s.marca.estiloLogo);
  txt += s.marca.usarColores
    ? `Colores: principal ${s.marca.colorPrincipal}, secundario ${s.marca.colorSecundario}\n`
    : 'Colores: los propone Zenit\n';
  txt += linea('Estilo', estilo?.nombre);
  txt += comentario(s.marca.comentario) + '\n';

  txt += '[5] CONTACTO Y REDES (para mostrar en la página)\n';
  txt += linea('WhatsApp del botón', s.contacto.whatsappBoton);
  txt += linea('Correo de contacto', s.contacto.correoContacto);
  txt += linea('Instagram', s.contacto.instagram);
  txt += linea('Facebook', s.contacto.facebook);
  txt += linea('TikTok', s.contacto.tiktok);
  txt += linea('Otra red', s.contacto.otraRed);
  txt += linea('Dirección', s.contacto.direccion);
  txt += linea('Horario', s.contacto.horario);
  txt += comentario(s.contacto.comentario) + '\n';

  txt += '[6] PAGOS EN LÍNEA\n';
  txt += `Recibir pagos: ${etiqueta(ETIQUETAS.recibir, s.pagos.recibir)}\n`;
  if (s.pagos.recibir === 'si' || s.pagos.recibir === 'despues') {
    txt += `Cuenta Wompi: ${etiqueta(ETIQUETAS.cuentaWompi, s.pagos.cuentaWompi)}\n`;
    txt += `Titular: ${etiqueta(ETIQUETAS.titular, s.pagos.titular)}\n`;
  }
  txt += comentario(s.pagos.comentario) + '\n';

  txt += '[7] DOMINIO Y HOSTING\n';
  txt += `Dominio: ${etiqueta(ETIQUETAS.dominio, s.dominio.estado)}\n`;
  if (s.dominio.estado === 'tengo') {
    txt += linea('Dominio actual', s.dominio.dominioActual);
    txt += linea('Comprado en', s.dominio.proveedor);
  }
  if (s.dominio.estado === 'necesito') {
    txt += linea('Dominio deseado', s.dominio.deseado);
    txt += linea('Alternativas', s.dominio.alternativas);
  }
  txt += `Tráfico esperado: ${etiqueta(ETIQUETAS.trafico, s.hosting.trafico)}\n`;
  txt += `Hosting sugerido: ${hosting.nivel.nombre} — Puntaje ${hosting.puntos}`;
  txt += hosting.detalle.length
    ? ` (${hosting.detalle.map((d) => `${d.motivo} ${d.puntos}`).join(' + ')})\n`
    : '\n';
  txt += comentario(s.dominio.comentario || s.hosting.comentario) + '\n';

  txt += '[8] EXTRAS\n';
  txt += `${nombres(EXTRAS, s.extras.seleccion)}\n`;
  txt += comentario(s.extras.comentario) + '\n';

  txt += '[9] REUNIÓN PARA PRESENTAR EL BOCETO\n';
  txt += `Modalidad: ${etiqueta(ETIQUETAS.modalidad, s.reunion.modalidad)}\n`;
  txt += linea('Fechas posibles', fechas);
  txt += linea('Franja horaria', s.reunion.franja ? ETIQUETAS.franja[s.reunion.franja] : '');
  if (s.reunion.modalidad === 'presencial') txt += linea('Lugar', s.reunion.lugar);
  txt += comentario(s.reunion.comentario) + '\n';

  if (s.comentarioGeneral.trim()) {
    txt += `[10] COMENTARIO GENERAL\n${s.comentarioGeneral.trim()}\n\n`;
  }

  if (tareas.length) {
    txt += 'PENDIENTES PARA ZENIT\n';
    txt += tareas.map((t) => `⚠ ${t}`).join('\n') + '\n\n';
  }

  txt += `${sep}\n`;
  return txt;
}

/** Mensaje corto para WhatsApp; el detalle completo va en el .txt adjunto. */
export function construirMensajeWhatsapp(s: Solicitud): string {
  const tipo = TIPOS_PROYECTO.find((t) => t.id === s.proyecto.tipo)?.nombre ?? 'Por definir';
  const modalidad = s.reunion.modalidad ? ETIQUETAS.modalidad[s.reunion.modalidad] : 'Por definir';
  return [
    `Hola ${SITE.brand}, armé mi solicitud de página web.`,
    '',
    `Código: ${s.codigo}`,
    `Nombre: ${s.datos.nombre}${s.datos.negocio ? ` (${s.datos.negocio})` : ''}`,
    `Proyecto: ${tipo}`,
    `Secciones: ${s.secciones.seleccion.length} seleccionadas`,
    `Pagos en línea: ${etiqueta(ETIQUETAS.recibir, s.pagos.recibir)}`,
    `Extras: ${nombres(EXTRAS, s.extras.seleccion)}`,
    `Reunión: ${modalidad}`,
    '',
    'Adjunto el archivo .txt con todos los detalles.',
  ].join('\n');
}

export function nombreArchivo(s: Solicitud): string {
  const nombre = (s.datos.negocio || s.datos.nombre || 'cliente')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `solicitud-${s.codigo}-${nombre}.txt`;
}

export function descargarTxt(s: Solicitud): void {
  const blob = new Blob([construirTxt(s)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo(s);
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
