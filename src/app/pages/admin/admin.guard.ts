import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { adminApi } from '../../core/services/admin-api';

/** Solo deja entrar al panel con una sesión válida; si no, va al inicio de sesión. */
export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  return (await adminApi.sesionActiva()) ? true : router.parseUrl('/admin/entrar');
};
