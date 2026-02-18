import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
  import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { NotificationService } from '../../../shared/services/notification.service';
import { Gender, StudentCreatePayload } from '../models/student.model';
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

interface CityGroup {
  category: string;
  cities: readonly string[];
}

type SkillControls = {
  [K in Skill]: FormControl<boolean>;
};

interface StudentFormControls {
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

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss',
})
export class StudentFormComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly studentStore = inject(StudentStore);
  private readonly notificationService = inject(NotificationService);

  readonly availableSkills = SKILLS;
  readonly cityGroups: ReadonlyArray<CityGroup> = [
    {
      category: 'Major Cities',
      cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    },
    {
      category: 'Metropolitan Areas',
      cities: ['San Francisco', 'Seattle', 'Boston', 'Miami', 'Denver'],
    },
    {
      category: 'Other Cities',
      cities: ['Austin', 'Portland', 'Nashville', 'Atlanta', 'Detroit'],
    },
  ];

  readonly studentForm = this.formBuilder.group<StudentFormControls>({
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

  isSubmitting = false;

  isFieldInvalid(fieldName: keyof StudentFormControls, validatorName: string): boolean {
    const field = this.studentForm.controls[fieldName];
    return field.hasError(validatorName) && (field.dirty || field.touched);
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.notificationService.warning('Please fill in all required fields');
      return;
    }

    const formValue = this.studentForm.getRawValue();
    if (!formValue.dob || !formValue.gender) {
      this.notificationService.warning('Please fill in all required fields');
      return;
    }

    this.isSubmitting = true;

    const payload: StudentCreatePayload = {
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
      const createdStudent = this.studentStore.addStudent(payload);
      this.notificationService.success(
        `${createdStudent.firstName} ${createdStudent.lastName} added successfully`
      );
      this.onReset();
    } catch {
      this.notificationService.error('Failed to add student');
    } finally {
      this.isSubmitting = false;
    }
  }

  onReset(): void {
    this.studentForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      dob: null,
      city: '',
      course: '',
      address: '',
      skillsGroup: this.createDefaultSkillState(),
    });
  }

  private getSelectedSkills(): string[] {
    const skillsGroup = this.studentForm.controls.skillsGroup.controls;
    return this.availableSkills.filter((skill) => skillsGroup[skill].value);
  }

  private createSkillControls(): SkillControls {
    return SKILLS.reduce((controls, skill) => {
      controls[skill] = this.formBuilder.control(false);
      return controls;
    }, {} as SkillControls);
  }

  private createDefaultSkillState(): Record<Skill, boolean> {
    return SKILLS.reduce((state, skill) => {
      state[skill] = false;
      return state;
    }, {} as Record<Skill, boolean>);
  }
}
