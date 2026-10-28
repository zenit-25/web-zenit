import { Extra, OpcionCatalogo, TipoProyecto } from '../../models/solicitud.model';

export const TIPOS_PROYECTO: TipoProyecto[] = [
  {
    id: 'landing',
    nombre: 'Landing page',
    info: 'Una sola página que presenta tu negocio y lleva al visitante a contactarte.',
    ideal: 'Emprendimientos, servicios profesionales y campañas.',
    seccionesSugeridas: ['inicio', 'nosotros', 'servicios', 'testimonios', 'formulario', 'mapa'],
    rasgos: [],
    ejemplo: { nombre: 'Mallas BGA', url: 'https://pagina-mallas.vercel.app/inicio' },
  },
  {
    id: 'corporativo',
    nombre: 'Sitio corporativo',
    info: 'Sitio de varias páginas para presentar tu empresa con más detalle.',
    ideal: 'Empresas que quieren una presencia completa y profesional.',
    seccionesSugeridas: [
      'inicio',
      'nosotros',
      'servicios',
      'equipo',
      'testimonios',
      'faq',
      'formulario',
      'mapa',
    ],
    rasgos: ['formulario'],
  },
  {
    id: 'restaurante',
    nombre: 'Restaurante o cafetería',
    info: 'Menú digital, horarios, ubicación y botón para pedir o reservar.',
    ideal: 'Restaurantes, cafés, panaderías y comidas rápidas.',
    seccionesSugeridas: ['inicio', 'menu', 'galeria', 'nosotros', 'testimonios', 'mapa'],
    rasgos: [],
  },
  {
    id: 'catalogo',
    nombre: 'Catálogo con pedidos por WhatsApp',
    info: 'Muestra tus productos con precios; el cliente arma su pedido y te escribe por WhatsApp.',
    ideal: 'Tiendas que venden por redes y quieren verse más profesionales.',
    seccionesSugeridas: ['inicio', 'productos', 'nosotros', 'testimonios', 'faq'],
    rasgos: [],
  },
  {
    id: 'tienda',
    nombre: 'Tienda en línea',
    info: 'Carrito de compras, pago en línea y gestión de pedidos.',
    ideal: 'Negocios que quieren vender y cobrar directamente en su página.',
    seccionesSugeridas: ['inicio', 'productos', 'nosotros', 'faq', 'formulario'],
    rasgos: ['pagos', 'baseDatos', 'panel'],
  },
  {
    id: 'citas',
    nombre: 'Sistema de citas o reservas',
    info: 'Tus clientes ven tu disponibilidad y reservan solos; tú administras la agenda.',
    ideal: 'Barberías, consultorios, spa, estudios y servicios con agenda.',
    seccionesSugeridas: ['inicio', 'servicios', 'equipo', 'precios', 'testimonios', 'mapa'],
    rasgos: ['reservas', 'baseDatos', 'panel'],
    ejemplo: { nombre: 'Azenda', url: 'https://azenda.online' },
  },
  {
    id: 'sorteos',
    nombre: 'Plataforma de sorteos o rifas',
    info: 'Venta de números o boletas, pagos en línea y resultados del sorteo.',
    ideal: 'Rifas, sorteos y dinámicas con premios.',
    seccionesSugeridas: ['inicio', 'productos', 'faq', 'testimonios'],
    rasgos: ['pagos', 'baseDatos', 'panel'],
    ejemplo: { nombre: 'Ciudad Bonita', url: 'https://inversionesjcb.online' },
  },
  {
    id: 'invitacion',
    nombre: 'Invitación digital',
    info: 'Invitación para tu evento con cuenta regresiva, confirmación de asistencia, música y galería.',
    ideal: 'Bodas, quince años, cumpleaños y eventos.',
    seccionesSugeridas: ['inicio', 'galeria', 'mapa', 'formulario'],
    rasgos: ['formulario'],
  },
  {
    id: 'portafolio',
    nombre: 'Portafolio personal o de marca',
    info: 'Muestra tus trabajos, experiencia y formas de contacto.',
    ideal: 'Fotógrafos, diseñadores, artistas y profesionales independientes.',
    seccionesSugeridas: ['inicio', 'nosotros', 'galeria', 'servicios', 'testimonios', 'formulario'],
    rasgos: [],
  },
  {
    id: 'sistema',
    nombre: 'Sistema web a medida',
    info: 'Plataforma con usuarios, panel administrativo y procesos propios de tu negocio.',
    ideal: 'Inventarios, ventas, gestión interna y procesos especiales.',
    seccionesSugeridas: ['inicio'],
    rasgos: ['usuarios', 'baseDatos', 'panel'],
  },
  {
    id: 'otro',
    nombre: 'Otro / no estoy seguro',
    info: 'Cuéntanos tu idea en el comentario y te ayudamos a definirla.',
    ideal: 'Ideas nuevas o proyectos que no encajan en las opciones.',
    seccionesSugeridas: [],
    rasgos: [],
  },
];

export const SECCIONES: OpcionCatalogo[] = [
  {
    id: 'inicio',
    nombre: 'Portada (inicio)',
    info: 'Lo primero que se ve: imagen o carrusel, frase principal y botón de acción.',
  },
  {
    id: 'nosotros',
    nombre: 'Quiénes somos',
    info: 'Tu historia, misión, visión y lo que te diferencia.',
  },
  {
    id: 'servicios',
    nombre: 'Servicios',
    info: 'Tarjetas con lo que ofreces y una breve descripción de cada servicio.',
  },
  {
    id: 'productos',
    nombre: 'Productos o catálogo',
    info: 'Productos con foto, precio y botón para pedir o cotizar.',
  },
  { id: 'menu', nombre: 'Menú', info: 'Carta de platos o bebidas organizada por categorías.' },
  {
    id: 'galeria',
    nombre: 'Galería de fotos o videos',
    info: 'Muestra tu trabajo, tu local o tus productos en imágenes.',
  },
  { id: 'equipo', nombre: 'Equipo', info: 'Fotos y cargos de las personas que trabajan contigo.' },
  { id: 'precios', nombre: 'Planes y precios', info: 'Tabla comparativa de paquetes o tarifas.' },
  {
    id: 'testimonios',
    nombre: 'Testimonios',
    info: 'Opiniones de clientes reales que generan confianza.',
  },
  {
    id: 'faq',
    nombre: 'Preguntas frecuentes',
    info: 'Respuestas a las dudas más comunes de tus clientes.',
  },
  {
    id: 'formulario',
    nombre: 'Formulario de contacto',
    info: 'Formulario para que te escriban; los mensajes te llegan al correo.',
  },
  {
    id: 'mapa',
    nombre: 'Ubicación (mapa)',
    info: 'Mapa de Google con tu dirección y cómo llegar.',
  },
  {
    id: 'redes',
    nombre: 'Redes sociales',
    info: 'Enlaces o publicaciones de tu Instagram, Facebook o TikTok.',
  },
];

export const ESTILOS_VISUALES: OpcionCatalogo[] = [
  {
    id: 'minimalista',
    nombre: 'Minimalista',
    info: 'Limpio, mucho espacio en blanco y pocos elementos.',
  },
  {
    id: 'elegante',
    nombre: 'Elegante',
    info: 'Tipografías finas, tonos sobrios y sensación premium.',
  },
  {
    id: 'moderno',
    nombre: 'Moderno y llamativo',
    info: 'Colores vivos, degradados y animaciones.',
  },
  { id: 'oscuro', nombre: 'Oscuro', info: 'Fondo oscuro con acentos de color, como este sitio.' },
  {
    id: 'corporativo',
    nombre: 'Corporativo',
    info: 'Serio, ordenado y enfocado en transmitir confianza.',
  },
  {
    id: 'recomendado',
    nombre: 'Que Zenit me recomiende',
    info: 'Te proponemos el estilo que mejor va con tu negocio.',
  },
];

export const EXTRAS: Extra[] = [
  {
    id: 'correo',
    nombre: 'Correo corporativo',
    info: 'Correos con tu dominio, por ejemplo ventas@tunegocio.com.',
  },
  {
    id: 'idiomas',
    nombre: 'Varios idiomas',
    info: 'Tu página en español y otros idiomas, con selector de idioma.',
  },
  {
    id: 'blog',
    nombre: 'Blog o noticias',
    info: 'Sección para publicar artículos, novedades o consejos.',
    rasgo: 'blog',
  },
  {
    id: 'panel-contenido',
    nombre: 'Panel para editar contenido',
    info: 'Tú mismo cambias textos, fotos, precios o productos sin depender de nosotros.',
    rasgo: 'panel',
  },
  {
    id: 'reservas',
    nombre: 'Reservas o agendamiento',
    info: 'Tus clientes reservan una cita o mesa directamente en la página.',
    rasgo: 'reservas',
  },
  {
    id: 'seo',
    nombre: 'Posicionamiento en Google (SEO)',
    info: 'Optimización para que tu página aparezca mejor en las búsquedas.',
  },
  {
    id: 'analitica',
    nombre: 'Estadísticas de visitas',
    info: 'Conoce cuántas personas visitan tu página y qué miran.',
  },
  {
    id: 'mantenimiento',
    nombre: 'Mantenimiento mensual',
    info: 'Actualizaciones, cambios pequeños y soporte después de publicar.',
  },
  {
    id: 'fotografia',
    nombre: 'Fotografía de productos o local',
    info: 'Fotos profesionales para que tu página luzca mejor.',
  },
  {
    id: 'redaccion',
    nombre: 'Redacción de textos',
    info: 'Escribimos los textos de tu página por ti.',
  },
];

export const WOMPI = {
  url: 'https://wompi.com/es/co',
  descripcion:
    'Wompi es la pasarela de pagos de Bancolombia. Permite que tus clientes paguen con tarjeta, PSE, Nequi, Bancolombia y otros medios; el dinero llega directamente a tu cuenta bancaria.',
  seguridad:
    'Por tu seguridad, nunca te pediremos tus llaves privadas ni contraseñas por chat o correo. Las configuramos juntos al momento de implementar.',
  requisitos: {
    natural: [
      'Documento de identidad',
      'RUT actualizado',
      'Certificación bancaria de una cuenta a tu nombre',
      'Correo electrónico y número de celular',
    ],
    empresa: [
      'Certificado de Cámara de Comercio reciente',
      'RUT de la empresa',
      'Documento de identidad del representante legal',
      'Certificación bancaria de una cuenta a nombre de la empresa',
    ],
  },
  nota: 'Los requisitos y las comisiones por transacción los define Wompi; verifícalos en su página antes de crear la cuenta.',
} as const;

/** Precios de referencia por año. Ajustar cuando cambien. */
export const DOMINIOS = [
  {
    extension: '.com',
    precio: '50.000 – 70.000 COP',
    info: 'El más conocido y usado en todo el mundo.',
  },
  {
    extension: '.co',
    precio: '100.000 – 150.000 COP',
    info: 'Identifica a Colombia y es corto y fácil de recordar.',
  },
  {
    extension: '.com.co',
    precio: '50.000 – 90.000 COP',
    info: 'Ideal para negocios que venden en Colombia.',
  },
] as const;

export const TEMAS: OpcionCatalogo[] = [
  {
    id: 'claro',
    nombre: 'Claro',
    info: 'Fondo blanco o de tonos suaves. Transmite limpieza y frescura.',
  },
  {
    id: 'oscuro',
    nombre: 'Oscuro',
    info: 'Fondo negro o muy oscuro. Se ve moderno y resalta las fotos.',
  },
  {
    id: 'recomendado',
    nombre: 'Que Zenit lo recomiende',
    info: 'Escogemos el que mejor funcione con tu marca.',
  },
];

/** Dónde puede ir cada color de la marca. */
export const USOS_COLOR: OpcionCatalogo[] = [
  {
    id: 'principal',
    nombre: 'Color principal de la marca',
    info: 'El que más identifica a tu negocio.',
  },
  { id: 'fondo', nombre: 'Fondo', info: 'Color de fondo de la página o de algunas secciones.' },
  { id: 'botones', nombre: 'Botones', info: 'Botones de acción como «Escríbenos» o «Comprar».' },
  { id: 'titulos', nombre: 'Títulos y textos', info: 'Color de las letras de títulos o textos.' },
  {
    id: 'detalles',
    nombre: 'Detalles y acentos',
    info: 'Íconos, líneas, etiquetas y pequeños resaltes.',
  },
  { id: 'libre', nombre: 'Donde Zenit lo vea mejor', info: 'Lo ubicamos donde mejor combine.' },
];

export const MAX_COLORES = 5;

export const DIAS_SEMANA = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const;
