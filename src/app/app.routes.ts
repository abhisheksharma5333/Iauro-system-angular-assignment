import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'students',
      },
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.routes').then((module) => module.HOME_ROUTES),
      },
      {
        path: 'students',
        loadChildren: () =>
          import('./features/students/students.routes').then((module) => module.STUDENTS_ROUTES),
      },
      // Feature routes can be added here with lazy loading
      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./features/dashboard/dashboard.routes').then((module) => module.DASHBOARD_ROUTES)
      // },
    ]
  },
  // Wildcard route must be last
  {
    path: '**',
    redirectTo: ''
  }
];
