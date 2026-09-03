import { Project } from '../models/project.model';

/**
 * Portafolio de proyectos. Para agregar uno nuevo, solo añade un objeto
 * más a este arreglo — la sección de portafolio se actualiza sola.
 */
export const PROJECTS: Project[] = [
  {
    id: 'mallas-bga',
    name: 'Mallas BGA',
    category: 'Sitio comercial',
    description:
      'Landing page comercial para una empresa de mallas de Bucaramanga. Presenta el catálogo de soluciones, beneficios del producto y un flujo directo para solicitar cotización.',
    tags: ['Landing Page', 'Diseño UI/UX', 'Despliegue en Vercel'],
    url: 'https://pagina-mallas.vercel.app/inicio',
    status: 'live',
    accent: 'violet',
  },
  {
    id: 'inversiones-jcb',
    name: 'Ciudad Bonita',
    category: 'Plataforma de sorteos',
    description:
      'Sitio web de sorteos en línea para Inversiones JCB: explica cómo comprar los números, muestra los premios entregados y guía al usuario paso a paso hasta el día del sorteo.',
    tags: ['Plataforma Web', 'Gestión de Sorteos', 'UI a medida'],
    url: 'https://inversionesjcb.online',
    status: 'live',
    accent: 'teal',
  },
  {
    id: 'azenda',
    name: 'Azenda',
    category: 'Sistema web',
    description:
      'Sistema web para organizar citas, ventas e inventario en un solo lugar, pensado para negocios que necesitan agendar clientes y controlar su operación día a día.',
    tags: ['Sistema Web', 'Gestión de Citas', 'Ventas e Inventario'],
    url: 'https://azenda.online',
    status: 'live',
    accent: 'blue',
  },
  {
    id: 'proximo-proyecto',
    name: 'Tu proyecto aquí',
    category: 'Próximamente',
    description:
      'Este espacio está reservado para el siguiente proyecto. El portafolio crece con cada trabajo nuevo entregado a un cliente.',
    tags: ['Disponible'],
    status: 'coming-soon',
    accent: 'violet',
  },
];
