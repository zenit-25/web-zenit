export const SITE = {
  brand: 'Zenit Digital',
  tagline: 'Diseño y desarrollo de páginas web modernas, a tu medida.',
  whatsappNumber: '573245667724',
  whatsappDisplay: '+57 324 566 7724',
  email: 'zenitdigital25@gmail.com',
  github: 'https://github.com/zenit-25',
  whatsappMessage: 'Hola, vi el portafolio de Zenit Digital y quiero cotizar un proyecto web.',
} as const;

export function buildWhatsappLink(message: string = SITE.whatsappMessage): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
