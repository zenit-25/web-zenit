import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { adminGuard } from './pages/admin/admin.guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Zenit Digital — Desarrollo Web y Diseño' },
  {
    path: 'disena-tu-pagina',
    loadComponent: () => import('./pages/configurador/configurador').then((m) => m.Configurador),
    title: 'Diseña tu página — Zenit Digital',
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./pages/privacidad/privacidad').then((m) => m.Privacidad),
    title: 'Política de datos — Zenit Digital',
  },
  {
    path: 'admin/entrar',
    loadComponent: () =>
      import('./pages/admin/admin-entrar/admin-entrar').then((m) => m.AdminEntrar),
    title: 'Panel — Zenit Digital',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin-lista/admin-lista').then((m) => m.AdminLista),
    title: 'Solicitudes — Zenit Digital',
  },
  {
    path: 'admin/:codigo',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-detalle/admin-detalle').then((m) => m.AdminDetalle),
    title: 'Solicitud — Zenit Digital',
  },
  { path: '**', redirectTo: '' },
];
