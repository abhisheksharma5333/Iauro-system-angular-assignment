import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { NotificationService } from '../../../shared/services/notification.service';
import { StudentStore } from '../store/student.store';
import { StudentTableComponent } from './student-table.component';

describe('StudentTableComponent', () => {
  let component: StudentTableComponent;
  let fixture: ComponentFixture<StudentTableComponent>;

  beforeEach(async () => {
    const studentStoreMock = {
      students: jasmine.createSpy('students').and.returnValue([]),
      isLoading: jasmine.createSpy('isLoading').and.returnValue(false),
      totalStudents: jasmine.createSpy('totalStudents').and.returnValue(0),
      deleteStudents: jasmine.createSpy('deleteStudents'),
      deleteStudent: jasmine.createSpy('deleteStudent'),
      selectStudent: jasmine.createSpy('selectStudent'),
    };

    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const notificationMock = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
      'warning',
      'info',
    ]);

    await TestBed.configureTestingModule({
      imports: [StudentTableComponent],
      providers: [
        { provide: StudentStore, useValue: studentStoreMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: NotificationService, useValue: notificationMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
