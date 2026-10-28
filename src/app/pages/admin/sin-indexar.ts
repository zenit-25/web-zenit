import { DestroyRef, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';

/** Pide a los buscadores no indexar la página del panel mientras está abierta. */
export function sinIndexar(): void {
  const meta = inject(Meta);
  meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  inject(DestroyRef).onDestroy(() => meta.removeTag('name="robots"'));
}
