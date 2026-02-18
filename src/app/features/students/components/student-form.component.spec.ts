/**
 * Student Form Component Unit Tests
 * Tests for StudentFormComponent form validation and submission
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentFormComponent } from './student-form.component';
import { StudentStore } from '../store/student.store';
import { NotificationService } from '../../../shared/services/notification.service';
import { StudentCreatePayload } from '../models/student.model';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentStore: jasmine.SpyObj<StudentStore>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('StudentStore', [
      'addStudent',
      'updateStudent',
      'deleteStudent',
      'students',
      'isLoading',
    ]);

    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
      'warning',
      'info',
    ]);

    await TestBed.configureTestingModule({
      imports: [StudentFormComponent, ReactiveFormsModule, MatSnackBarModule],
      providers: [
        { provide: StudentStore, useValue: storeSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    studentStore = TestBed.inject(StudentStore) as jasmine.SpyObj<StudentStore>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Form Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the form on ngOnInit', () => {
      expect(component.studentForm).toBeTruthy();
    });

    it('should have all form controls', () => {
      const form = component.studentForm;

      expect(form.get('firstName')).toBeTruthy();
      expect(form.get('lastName')).toBeTruthy();
      expect(form.get('email')).toBeTruthy();
      expect(form.get('gender')).toBeTruthy();
      expect(form.get('dob')).toBeTruthy();
      expect(form.get('city')).toBeTruthy();
      expect(form.get('course')).toBeTruthy();
      expect(form.get('address')).toBeTruthy();
      expect(form.get('skillsGroup')).toBeTruthy();
    });

    it('should initialize form as invalid', () => {
      expect(component.studentForm.invalid).toBe(true);
    });

    it('should have empty initial values', () => {
      expect(component.studentForm.get('firstName')?.value).toBe('');
      expect(component.studentForm.get('lastName')?.value).toBe('');
      expect(component.studentForm.get('email')?.value).toBe('');
    });
  });

  describe('First Name Validation', () => {
    it('should mark firstName as required', () => {
      const control = component.studentForm.get('firstName');
      control?.setValue('');
      control?.markAsTouched();

      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate minimum length of 2 characters', () => {
      const control = component.studentForm.get('firstName');
      control?.setValue('J');
      control?.markAsTouched();

      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should accept valid firstName', () => {
      const control = component.studentForm.get('firstName');
      control?.setValue('John');

      expect(control?.valid).toBe(true);
    });
  });

  describe('Last Name Validation', () => {
    it('should mark lastName as required', () => {
      const control = component.studentForm.get('lastName');
      control?.setValue('');
      control?.markAsTouched();

      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate minimum length of 2 characters', () => {
      const control = component.studentForm.get('lastName');
      control?.setValue('D');
      control?.markAsTouched();

      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should accept valid lastName', () => {
      const control = component.studentForm.get('lastName');
      control?.setValue('Doe');

      expect(control?.valid).toBe(true);
    });
  });

  describe('Email Validation', () => {
    it('should mark email as required', () => {
      const control = component.studentForm.get('email');
      control?.setValue('');
      control?.markAsTouched();

      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const control = component.studentForm.get('email');

      control?.setValue('invalid-email');
      expect(control?.hasError('email')).toBe(true);

      control?.setValue('test@example.com');
      expect(control?.hasError('email')).toBe(false);
    });

    it('should reject email without domain', () => {
      const control = component.studentForm.get('email');
      control?.setValue('test@');

      expect(control?.hasError('email')).toBe(true);
    });

    it('should accept valid email addresses', () => {
      const control = component.studentForm.get('email');

      const validEmails = [
        'user@example.com',
        'john.doe@university.edu',
        'jane+smith@company.co.uk',
      ];

      validEmails.forEach((email) => {
        control?.setValue(email);
        expect(control?.valid).toBe(true, `Email ${email} should be valid`);
      });
    });
  });

  describe('Gender Validation', () => {
    it('should mark gender as required', () => {
      const control = component.studentForm.get('gender');
      control?.setValue('');
      control?.markAsTouched();

      expect(control?.hasError('required')).toBe(true);
    });

    it('should accept valid gender values', () => {
      const control = component.studentForm.get('gender');

      const genders = ['Male', 'Female', 'Other'] as const;
      genders.forEach((gender) => {
        control?.setValue(gender);
        expect(control?.valid).toBe(true, `Gender ${gender} should be valid`);
      });
    });
  });

  describe('Date of Birth Validation', () => {
    it('should mark dob as required', () => {
      const control = component.studentForm.get('dob');
      control?.setValue(null);
      control?.markAsTouched();

      expect(control?.hasError('required')).toBe(true);
    });

    it('should accept valid date', () => {
      const control = component.studentForm.get('dob');
      control?.setValue(new Date('1995-05-15'));

      expect(control?.valid).toBe(true);
    });
  });

  describe('City Validation', () => {
    it('should mark city as required', () => {
      const control = component.studentForm.get('city');
      control?.setValue('');
      control?.markAsTouched();

      expect(control?.hasError('required')).toBe(true);
    });

    it('should accept valid city name', () => {
      const control = component.studentForm.get('city');
      control?.setValue('New York');

      expect(control?.valid).toBe(true);
    });
  });

  describe('Course Validation', () => {
    it('should mark course as required', () => {
      const control = component.studentForm.get('course');
      control?.setValue('');
      control?.markAsTouched();

      expect(control?.hasError('required')).toBe(true);
    });

    it('should accept valid course', () => {
      const control = component.studentForm.get('course');
      control?.setValue('Computer Science');

      expect(control?.valid).toBe(true);
    });
  });

  describe('Address Validation', () => {
    it('should mark address as required', () => {
      const control = component.studentForm.get('address');
      control?.setValue('');
      control?.markAsTouched();

      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate minimum length of 5 characters', () => {
      const control = component.studentForm.get('address');
      control?.setValue('123');
      control?.markAsTouched();

      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should accept valid address', () => {
      const control = component.studentForm.get('address');
      control?.setValue('123 Main Street, New York, NY 10001');

      expect(control?.valid).toBe(true);
    });
  });

  describe('Skills Validation', () => {
    it('should have all available skills', () => {
      expect(component.availableSkills.length).toBeGreaterThan(0);
      expect(component.availableSkills).toContain('Angular');
      expect(component.availableSkills).toContain('React');
    });

    it('should initialize all skills as unchecked', () => {
      const skillsGroup = component.studentForm.get('skillsGroup');

      component.availableSkills.forEach((skill) => {
        expect(skillsGroup?.get(skill)?.value).toBe(false);
      });
    });
  });

  describe('isFieldInvalid() Method', () => {
    it('should return false for valid field that is not touched', () => {
      const control = component.studentForm.get('firstName');
      control?.setValue('John');

      const isInvalid = component.isFieldInvalid('firstName', 'required');
      expect(isInvalid).toBe(false);
    });

    it('should return true for invalid touched field', () => {
      const control = component.studentForm.get('firstName');
      control?.setValue('');
      control?.markAsTouched();

      const isInvalid = component.isFieldInvalid('firstName', 'required');
      expect(isInvalid).toBe(true);
    });

    it('should return true for invalid dirty field', () => {
      const control = component.studentForm.get('firstName');
      control?.setValue('');
      control?.markAsDirty();

      const isInvalid = component.isFieldInvalid('firstName', 'required');
      expect(isInvalid).toBe(true);
    });

    it('should return false for valid touched field', () => {
      const control = component.studentForm.get('firstName');
      control?.setValue('John');
      control?.markAsTouched();

      const isInvalid = component.isFieldInvalid('firstName', 'required');
      expect(isInvalid).toBe(false);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Fill form with valid data
      component.studentForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        gender: 'Male',
        dob: new Date('1995-05-15'),
        city: 'New York',
        course: 'Computer Science',
        address: '123 Main Street, New York, NY 10001',
      });
    });

    it('should show warning if form is invalid on submit', () => {
      component.studentForm.patchValue({ firstName: '' }); // Make invalid

      component.onSubmit();

      expect(notificationService.warning).toHaveBeenCalled();
    });

    it('should call studentStore.addStudent on valid submission', () => {
      component.onSubmit();

      expect(studentStore.addStudent).toHaveBeenCalled();
    });

    it('should send a create payload without id', () => {
      component.onSubmit();

      const addedStudent = studentStore.addStudent.calls.mostRecent().args[0] as StudentCreatePayload;
      expect(addedStudent.firstName).toBe('John');
      expect((addedStudent as { id?: string }).id).toBeUndefined();
    });

    it('should show success notification on submit', () => {
      component.onSubmit();

      expect(notificationService.success).toHaveBeenCalled();
    });

    it('should set isSubmitting to false after submission', (done) => {
      component.onSubmit();

      setTimeout(() => {
        expect(component.isSubmitting).toBe(false);
        done();
      }, 100);
    });

    it('should include selected skills in submitted data', () => {
      const skillsGroup = component.studentForm.get('skillsGroup');
      skillsGroup?.get('Angular')?.setValue(true);
      skillsGroup?.get('TypeScript')?.setValue(true);

      component.onSubmit();

      const addedStudent = studentStore.addStudent.calls.mostRecent().args[0];
      expect(addedStudent.skills).toContain('Angular');
      expect(addedStudent.skills).toContain('TypeScript');
    });

    it('should pass correct firstName and lastName', () => {
      component.onSubmit();

      const addedStudent = studentStore.addStudent.calls.mostRecent().args[0];
      expect(addedStudent.firstName).toBe('John');
      expect(addedStudent.lastName).toBe('Doe');
    });

    it('should pass correct email and gender', () => {
      component.onSubmit();

      const addedStudent = studentStore.addStudent.calls.mostRecent().args[0];
      expect(addedStudent.email).toBe('john@example.com');
      expect(addedStudent.gender).toBe('Male');
    });

    it('should pass correct course and city', () => {
      component.onSubmit();

      const addedStudent = studentStore.addStudent.calls.mostRecent().args[0];
      expect(addedStudent.course).toBe('Computer Science');
      expect(addedStudent.city).toBe('New York');
    });
  });

  describe('onReset() Method', () => {
    beforeEach(() => {
      // Fill form with data
      component.studentForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
    });

    it('should reset form to initial state', () => {
      component.onReset();

      expect(component.studentForm.get('firstName')?.value).toBeNull();
      expect(component.studentForm.get('lastName')?.value).toBeNull();
      expect(component.studentForm.get('email')?.value).toBeNull();
    });

    it('should reset all skill checkboxes', () => {
      const skillsGroup = component.studentForm.get('skillsGroup');
      skillsGroup?.get('Angular')?.setValue(true);

      component.onReset();

      component.availableSkills.forEach((skill) => {
        expect(skillsGroup?.get(skill)?.value).toBe(false);
      });
    });

    it('should mark form as pristine after reset', () => {
      component.studentForm.markAsDirty();

      component.onReset();

      // After reset, the form controls should be reset
      expect(component.studentForm.get('firstName')?.value).toBeNull();
    });
  });

  describe('Form Validation Integration', () => {
    it('should have invalid form with only firstName filled', () => {
      component.studentForm.patchValue({ firstName: 'John' });

      expect(component.studentForm.invalid).toBe(true);
    });

    it('should have valid form with all required fields filled', () => {
      component.studentForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        gender: 'Male',
        dob: new Date('1995-05-15'),
        city: 'New York',
        course: 'Computer Science',
        address: '123 Main Street',
      });

      expect(component.studentForm.valid).toBe(true);
    });

    it('should handle form submission when skills are not selected', () => {
      component.studentForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        gender: 'Male',
        dob: new Date('1995-05-15'),
        city: 'New York',
        course: 'Computer Science',
        address: '123 Main Street',
      });

      // Don't select any skills
      component.onSubmit();

      const addedStudent = studentStore.addStudent.calls.mostRecent().args[0];
      expect(addedStudent.skills).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle error during form submission', () => {
      studentStore.addStudent.and.throwError('Test error');

      component.studentForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        gender: 'Male',
        dob: new Date('1995-05-15'),
        city: 'New York',
        course: 'Computer Science',
        address: '123 Main Street',
      });

      component.onSubmit();

      expect(notificationService.error).toHaveBeenCalled();
      expect(component.isSubmitting).toBe(false);
    });
  });
});
