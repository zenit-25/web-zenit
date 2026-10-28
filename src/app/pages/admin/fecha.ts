/** "28 oct 2026, 6:42 p. m." en hora de Colombia. */
export function fechaCorta(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  });
}
