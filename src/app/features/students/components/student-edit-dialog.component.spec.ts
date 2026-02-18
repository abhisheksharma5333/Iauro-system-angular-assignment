import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { NotificationService } from '../../../shared/services/notification.service';
import { Student } from '../models/student.model';
import { StudentStore } from '../store/student.store';
import { StudentEditDialogComponent } from './student-edit-dialog.component';

describe('StudentEditDialogComponent', () => {
  let component: StudentEditDialogComponent;
  let fixture: ComponentFixture<StudentEditDialogComponent>;

  beforeEach(async () => {
    const student: Student = {
      id: 'STU-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      gender: 'Male',
      dob: new Date('1999-01-01'),
      city: 'New York',
      course: 'Computer Science',
      skills: ['Angular'],
      address: '123 Main Street',
    };

    const studentStoreMock = jasmine.createSpyObj('StudentStore', ['updateStudent']);
    const notificationMock = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
      'warning',
      'info',
    ]);
    const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [StudentEditDialogComponent],
      providers: [
        { provide: StudentStore, useValue: studentStoreMock },
        { provide: NotificationService, useValue: notificationMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { student } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
