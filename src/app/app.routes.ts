import { Routes } from '@angular/router';

export const routes: Routes = [

  // -------------------------
  // Default redirect
  // -------------------------
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // -------------------------
  // AUTH AREA (Login Layout)
  // -------------------------
  {
    path: '', // keep empty for clean URL (login)
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout').then(
        (m) => m.AuthLayout
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then(
            (m) => m.Login
          ),
      },
    ],
  },

  // -------------------------
  // APP AREA (Main Layout)
  // -------------------------
  {
    path: 'app',   // ✅ important fix
    loadComponent: () =>
      import('./layouts/application-layout/application-layout').then(
        (m) => m.ApplicationLayout
      ),
    children: [

      { path: 'dashboard', data: { title: 'Dashboard' }, loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard) },

      { path: 'projects', data: { title: 'Projects' }, loadComponent: () => import('./features/projects/projects').then(m => m.ProjectList) },

      { path: 'history', data: { title: 'History' }, loadComponent: () => import('./features/history/history').then(m => m.History) },

      { path: 'users', data: { title: 'Users' }, loadComponent: () => import('./features/users/users').then(m => m.Users) },

      { path: 'settings', data: { title: 'Settings' }, loadComponent: () => import('./features/settings/settings').then(m => m.Settings) },

      // ✅ default inside app
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      }
    ],
  },

  // -------------------------
  // Catch-all
  // -------------------------
  {
    path: '**',
    redirectTo: 'login',
  },
];