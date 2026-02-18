/**
 * Students Feature Routes
 * Lazy-loaded routes for the students feature
 */

import { Routes } from '@angular/router';
import { StudentsPageComponent } from './pages/students-list.component';

export const STUDENTS_ROUTES: Routes = [
  {
    path: '',
    component: StudentsPageComponent,
    data: { title: 'Students' },
  },
];
