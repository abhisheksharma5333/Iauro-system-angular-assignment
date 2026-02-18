import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { StudentFormComponent } from '../components/student-form.component';
import { StudentTableComponent } from '../components/student-table.component';
import { StudentStore } from '../store/student.store';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    StudentFormComponent,
    StudentTableComponent,
  ],
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.scss',
})
export class StudentsPageComponent {
  constructor(public readonly store: StudentStore) {}
}
