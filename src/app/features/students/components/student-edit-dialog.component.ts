import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { NotificationService } from '../../../shared/services/notification.service';
import { Gender, Student, StudentUpdatePayload } from '../models/student.model';
import { StudentStore } from '../store/student.store';

const SKILLS = [
  'Angular',
  'React',
  'Vue',
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'Node.js',
  'MongoDB',
] as const;

type Skill = (typeof SKILLS)[number];

type SkillControls = {
  [K in Skill]: FormControl<boolean>;
};

interface EditFormControls {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  gender: FormControl<Gender | ''>;
  dob: FormControl<Date | null>;
  city: FormControl<string>;
  course: FormControl<string>;
  address: FormControl<string>;
  skillsGroup: FormGroup<SkillControls>;
}

interface DialogData {
  student: Student;
}

@Component({
  selector: 'app-student-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './student-edit-dialog.component.html',
  styleUrl: './student-edit-dialog.component.scss',
})
export class StudentEditDialogComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly studentStore = inject(StudentStore);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<StudentEditDialogComponent>);
  private readonly data = inject(MAT_DIALOG_DATA) as DialogData;

  readonly availableSkills = SKILLS;
  readonly student = this.data.student;

  readonly editForm = this.formBuilder.group<EditFormControls>({
    firstName: this.formBuilder.control('', [Validators.required, Validators.minLength(2)]),
    lastName: this.formBuilder.control('', [Validators.required, Validators.minLength(2)]),
    email: this.formBuilder.control('', [Validators.required, Validators.email]),
    gender: this.formBuilder.control<Gender | ''>('', Validators.required),
    dob: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    city: this.formBuilder.control('', Validators.required),
    course: this.formBuilder.control('', Validators.required),
    address: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
    skillsGroup: new FormGroup<SkillControls>(this.createSkillControls()),
  });

  isSaving = false;

  constructor() {
    this.populateForm();
  }

  isFieldInvalid(fieldName: keyof EditFormControls, validatorName: string): boolean {
    const field = this.editForm.controls[fieldName];
    return field.hasError(validatorName) && (field.dirty || field.touched);
  }

  onSave(): void {
    if (this.editForm.invalid) {
      this.notificationService.warning('Please fill in all required fields');
      return;
    }

    const formValue = this.editForm.getRawValue();
    if (!formValue.dob || !formValue.gender) {
      this.notificationService.warning('Please fill in all required fields');
      return;
    }

    this.isSaving = true;

    const updates: StudentUpdatePayload = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      gender: formValue.gender,
      dob: formValue.dob,
      city: formValue.city,
      course: formValue.course,
      skills: this.getSelectedSkills(),
      address: formValue.address,
    };

    try {
      this.studentStore.updateStudent(this.student.id, updates);
      this.notificationService.success(`${this.student.firstName} ${this.student.lastName} updated successfully`);
      this.dialogRef.close(true);
    } catch {
      this.notificationService.error('Failed to update student');
    } finally {
      this.isSaving = false;
    }
  }

  onCancel(): void {
    if (this.editForm.dirty) {
      const confirmed = window.confirm('You have unsaved changes. Do you want to discard them?');
      if (!confirmed) {
        return;
      }
    }

    this.dialogRef.close(false);
  }

  private populateForm(): void {
    this.editForm.patchValue({
      firstName: this.student.firstName,
      lastName: this.student.lastName,
      email: this.student.email,
      gender: this.student.gender,
      dob: new Date(this.student.dob),
      city: this.student.city,
      course: this.student.course,
      address: this.student.address,
    });

    const skillsGroup = this.editForm.controls.skillsGroup.controls;
    this.availableSkills.forEach((skill) => {
      skillsGroup[skill].setValue(this.student.skills.includes(skill));
    });
  }

  private getSelectedSkills(): string[] {
    const skillsGroup = this.editForm.controls.skillsGroup.controls;
    return this.availableSkills.filter((skill) => skillsGroup[skill].value);
  }

  private createSkillControls(): SkillControls {
    return SKILLS.reduce((controls, skill) => {
      controls[skill] = this.formBuilder.control(false);
      return controls;
    }, {} as SkillControls);
  }
}
