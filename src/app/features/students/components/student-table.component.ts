import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NotificationService } from '../../../shared/services/notification.service';
import { Student } from '../models/student.model';
import { StudentStore } from '../store/student.store';
import { StudentEditDialogComponent } from './student-edit-dialog.component';

type SortableStudentField = 'firstName' | 'lastName' | 'email' | 'course' | 'city';

const SORT_ACCESSORS: Record<SortableStudentField, (student: Student) => string> = {
  firstName: (student) => student.firstName,
  lastName: (student) => student.lastName,
  email: (student) => student.email,
  course: (student) => student.course,
  city: (student) => student.city,
};

@Component({
  selector: 'app-student-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './student-table.component.html',
  styleUrl: './student-table.component.scss',
})
export class StudentTableComponent {
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  readonly studentStore = inject(StudentStore);

  readonly dataSource = new MatTableDataSource<Student>();
  readonly displayedColumns: string[] = [
    'select',
    'firstName',
    'lastName',
    'email',
    'course',
    'city',
    'gender',
    'skills',
    'actions',
  ];
  readonly pageSizeOptions = [5, 10, 25, 50];
  pageSize = 10;
  readonly selectedIds = new Set<string>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.studentStore.students();
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
  }

  onSortChange(sort: Sort): void {
    if (!sort.direction || !this.isSortableField(sort.active)) {
      return;
    }

    const accessor = SORT_ACCESSORS[sort.active];
    const isAscending = sort.direction === 'asc';
    const sortedData = [...this.dataSource.data].sort((studentA, studentB) => {
      const firstValue = accessor(studentA);
      const secondValue = accessor(studentB);
      return isAscending ? firstValue.localeCompare(secondValue) : secondValue.localeCompare(firstValue);
    });

    this.dataSource.data = sortedData;
  }

  toggleSelect(studentId: string, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedIds.add(studentId);
      return;
    }

    this.selectedIds.delete(studentId);
  }

  toggleSelectAll(event: MatCheckboxChange): void {
    if (event.checked) {
      this.dataSource.data.forEach((student) => this.selectedIds.add(student.id));
      return;
    }

    this.selectedIds.clear();
  }

  isSelected(studentId: string): boolean {
    return this.selectedIds.has(studentId);
  }

  isAllSelected(): boolean {
    return this.dataSource.data.length > 0 && this.dataSource.data.every((student) => this.isSelected(student.id));
  }

  isSomeSelected(): boolean {
    return this.selectedIds.size > 0 && !this.isAllSelected();
  }

  clearSelection(): void {
    this.selectedIds.clear();
  }

  deleteSelected(): void {
    if (!this.selectedIds.size) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${this.selectedIds.size} student(s)? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const selectionCount = this.selectedIds.size;
    this.studentStore.deleteStudents([...this.selectedIds]);
    this.selectedIds.clear();
    this.notificationService.success(`${selectionCount} student(s) deleted successfully`);
  }

  onEdit(student: Student): void {
    this.dialog.open(StudentEditDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { student },
      disableClose: false,
    });
  }

  onDelete(student: Student): void {
    const confirmed = window.confirm(
      `Delete ${student.firstName} ${student.lastName}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.studentStore.deleteStudent(student.id);
    this.notificationService.success(`${student.firstName} ${student.lastName} deleted successfully`);
  }

  onView(student: Student): void {
    this.studentStore.selectStudent(student.id);
    this.notificationService.info(`Viewing details for ${student.firstName} ${student.lastName}`);
  }

  private isSortableField(field: string): field is SortableStudentField {
    return field in SORT_ACCESSORS;
  }
}
