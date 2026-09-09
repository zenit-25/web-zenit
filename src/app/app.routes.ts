import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Zenit Digital — Desarrollo Web y Diseño' },
  { path: '**', redirectTo: '' },
];
