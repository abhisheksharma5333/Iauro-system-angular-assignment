import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStore } from '../store/student.store';
import { StudentsPageComponent } from './students-list.component';

describe('StudentsPageComponent', () => {
  let component: StudentsPageComponent;
  let fixture: ComponentFixture<StudentsPageComponent>;

  beforeEach(async () => {
    const studentStoreMock = {
      totalStudents: jasmine.createSpy('totalStudents').and.returnValue(0),
      getUniqueCourses: jasmine.createSpy('getUniqueCourses').and.returnValue([]),
      error: jasmine.createSpy('error').and.returnValue(null),
    };

    await TestBed.configureTestingModule({
      imports: [StudentsPageComponent],
      providers: [{ provide: StudentStore, useValue: studentStoreMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
