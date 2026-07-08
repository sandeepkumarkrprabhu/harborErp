import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/auth/guards/auth.guard';
import { loginGuard } from './core/auth/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects').then(m => m.Projects)
      },
      {
        path: 'teams',
        loadComponent: () => import('./features/teams/teams').then(m => m.Teams)
      },
      {
        path: 'history',
        loadComponent: () => import('./features/history/history').then(m => m.History)
      },
      {
        path: 'deployments',
        loadComponent: () => import('./features/deployments/deployments').then(m => m.Deployments)
      },
      {
        path: 'deployments/:id',
        loadComponent: () => import('./features/deployments/deployment-detail/deployment-detail').then(m => m.DeploymentDetail)
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/project-details/project-details').then(m => m.ProjectDetails)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings').then(m => m.Settings)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users').then(m => m.Users)
      },
      {
        path: 'users/edit/:id',
        loadComponent: () => import('./features/users/create-user/create-user').then(m => m.CreateUser)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'setup-password',
    loadComponent: () => import('./features/auth/setup-Password/setup-password/setup-password').then(m => m.SetupPassword)
  },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  }
];