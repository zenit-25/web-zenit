/** Solicitud que arma el cliente en el configurador "Diseña tu página". */
export interface Solicitud {
  codigo: string;
  /** Secreto del navegador que creó la solicitud: solo él puede actualizarla en la BD. */
  token: string;
  creada: string;
  datos: {
    nombre: string;
    negocio: string;
    ciudad: string;
    whatsapp: string;
    correo: string;
    /** Autorización de tratamiento de datos personales (Ley 1581 de 2012). */
    autorizacion: boolean;
    comentario: string;
  };
  proyecto: {
    tipo: string;
    comentario: string;
  };
  secciones: {
    seleccion: string[];
    comentario: string;
  };
  marca: {
    logo: 'tengo' | 'crear' | 'no' | '';
    estiloLogo: string;
    /** Fondo claro, oscuro o que Zenit lo recomiende. */
    tema: 'claro' | 'oscuro' | 'recomendado' | '';
    /** 'propios': el cliente define sus colores; 'zenit': los proponemos nosotros. */
    paleta: 'propios' | 'zenit' | '';
    colores: ColorMarca[];
    estilo: string;
    comentario: string;
  };
  contacto: {
    whatsappBoton: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    otraRed: string;
    direccion: string;
    mostrarHorario: boolean;
    horario: DiaHorario[];
    horarioNota: string;
    correoContacto: string;
    comentario: string;
  };
  pagos: {
    recibir: 'si' | 'no' | 'despues' | '';
    cuentaWompi: 'tengo' | 'crear' | 'ayuda' | '';
    titular: 'natural' | 'empresa' | '';
    comentario: string;
  };
  dominio: {
    estado: 'tengo' | 'necesito' | 'nose' | '';
    dominioActual: string;
    proveedor: string;
    deseado: string;
    alternativas: string;
    comentario: string;
  };
  hosting: {
    trafico: 'bajo' | 'medio' | 'alto' | '';
    usuarios: boolean;
    baseDatos: boolean;
    panel: boolean;
    archivos: boolean;
    comentario: string;
  };
  extras: {
    seleccion: string[];
    comentario: string;
  };
  reunion: {
    modalidad: 'presencial' | 'virtual' | 'whatsapp' | '';
    fechas: string[];
    franja: 'manana' | 'tarde' | 'noche' | '';
    lugar: string;
    comentario: string;
  };
  comentarioGeneral: string;
}

/** Opción genérica de catálogo (secciones, extras, estilos...). */
export interface OpcionCatalogo {
  id: string;
  nombre: string;
  info: string;
}

/** Rasgos técnicos que suman puntos para decidir el hosting. */
export type RasgoHosting =
  'formulario' | 'blog' | 'pagos' | 'reservas' | 'usuarios' | 'baseDatos' | 'panel' | 'archivos';

export interface TipoProyecto extends OpcionCatalogo {
  ideal: string;
  seccionesSugeridas: string[];
  rasgos: RasgoHosting[];
  ejemplo?: { nombre: string; url: string };
}

export interface Extra extends OpcionCatalogo {
  rasgo?: RasgoHosting;
}

export interface ColorMarca {
  hex: string;
  /** Dónde se usa: fondo, botones, títulos... (ver USOS_COLOR). */
  uso: string;
}

export interface DiaHorario {
  dia: string;
  abierto: boolean;
  desde: string;
  hasta: string;
  /** Jornada partida: cierra al mediodía y vuelve a abrir. */
  partida: boolean;
  desde2: string;
  hasta2: string;
}
