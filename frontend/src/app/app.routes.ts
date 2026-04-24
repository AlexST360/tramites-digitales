import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'tramites',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tramites-list/tramites-list').then(m => m.TramitesList),
  },
  {
    path: 'tramites/nuevo',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tramite-form/tramite-form').then(m => m.TramiteForm),
  },
  {
    path: 'tramites/editar/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tramite-form/tramite-form').then(m => m.TramiteForm),
  },
  {
    path: 'tramites/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tramite-detail/tramite-detail').then(m => m.TramiteDetail),
  },
];
