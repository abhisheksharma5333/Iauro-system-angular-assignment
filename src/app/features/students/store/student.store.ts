import { Injectable, computed, effect, signal } from '@angular/core';

import { Student, StudentCreatePayload, StudentUpdatePayload } from '../models/student.model';

const STORAGE_KEY = 'students_data';

export interface StudentStoreState {
  students: Student[];
  selectedStudentId: string | null;
  error: string | null;
  isLoading: boolean;
}

const INITIAL_STATE: StudentStoreState = {
  students: [],
  selectedStudentId: null,
  error: null,
  isLoading: false,
};

@Injectable({
  providedIn: 'root',
})
export class StudentStore {
  private readonly state = signal<StudentStoreState>(INITIAL_STATE);

  readonly students = computed(() => this.state().students);
  readonly selectedStudentId = computed(() => this.state().selectedStudentId);
  readonly error = computed(() => this.state().error);
  readonly isLoading = computed(() => this.state().isLoading);

  readonly totalStudents = computed(() => this.students().length);
  readonly isEmpty = computed(() => this.students().length === 0);
  readonly selectedStudent = computed(() => {
    const selectedId = this.selectedStudentId();
    return selectedId ? this.students().find((student) => student.id === selectedId) ?? null : null;
  });

  constructor() {
    this.initializeStore();
    this.setupPersistence();
  }

  private initializeStore(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsedStudents = (JSON.parse(stored) as Student[]).map((student) => ({
        ...student,
        dob: new Date(student.dob),
      }));

      this.state.update((currentState) => ({
        ...currentState,
        students: parsedStudents,
      }));
    } catch {
      this.setError('Failed to load stored data');
    }
  }

  private setupPersistence(): void {
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.students()));
      } catch {
        this.setError('Failed to save data');
      }
    });
  }

  addStudent(payload: Student | StudentCreatePayload): Student {
    const student: Student = 'id' in payload ? payload : { ...payload, id: this.generateStudentId() };

    this.state.update((currentState) => ({
      ...currentState,
      students: [...currentState.students, student],
      error: null,
    }));

    return student;
  }

  updateStudent(id: string, updates: StudentUpdatePayload): void {
    this.state.update((currentState) => ({
      ...currentState,
      students: currentState.students.map((student) =>
        student.id === id ? { ...student, ...updates } : student
      ),
      error: null,
    }));
  }

  deleteStudent(id: string): void {
    this.state.update((currentState) => ({
      ...currentState,
      students: currentState.students.filter((student) => student.id !== id),
      selectedStudentId:
        currentState.selectedStudentId === id ? null : currentState.selectedStudentId,
      error: null,
    }));
  }

  deleteStudents(ids: string[]): void {
    if (!ids.length) {
      return;
    }

    const idSet = new Set(ids);
    this.state.update((currentState) => ({
      ...currentState,
      students: currentState.students.filter((student) => !idSet.has(student.id)),
      selectedStudentId:
        currentState.selectedStudentId && idSet.has(currentState.selectedStudentId)
          ? null
          : currentState.selectedStudentId,
      error: null,
    }));
  }

  selectStudent(id: string | null): void {
    this.state.update((currentState) => ({
      ...currentState,
      selectedStudentId: id,
    }));
  }

  getStudentById(id: string): Student | undefined {
    return this.students().find((student) => student.id === id);
  }

  searchStudents(query: string): Student[] {
    const searchQuery = query.trim().toLowerCase();
    if (!searchQuery) {
      return this.students();
    }

    return this.students().filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchQuery) ||
        student.lastName.toLowerCase().includes(searchQuery) ||
        student.email.toLowerCase().includes(searchQuery) ||
        student.course.toLowerCase().includes(searchQuery) ||
        student.city.toLowerCase().includes(searchQuery)
    );
  }

  filterByCourse(course: string): Student[] {
    if (!course) {
      return this.students();
    }

    return this.students().filter((student) => student.course === course);
  }

  filterBySkills(skills: string[]): Student[] {
    if (!skills.length) {
      return this.students();
    }

    return this.students().filter((student) => skills.some((skill) => student.skills.includes(skill)));
  }

  getUniqueCourses(): string[] {
    return [...new Set(this.students().map((student) => student.course))].sort();
  }

  getUniqueSkills(): string[] {
    return [...new Set(this.students().flatMap((student) => student.skills))].sort();
  }

  clearStore(): void {
    this.state.set(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }

  setLoading(isLoading: boolean): void {
    this.state.update((currentState) => ({
      ...currentState,
      isLoading,
    }));
  }

  clearError(): void {
    this.state.update((currentState) => ({
      ...currentState,
      error: null,
    }));
  }

  getSnapshot(): StudentStoreState {
    return this.state();
  }

  private setError(message: string): void {
    this.state.update((currentState) => ({
      ...currentState,
      error: message,
    }));
  }

  private generateStudentId(): string {
    return `STU-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
}
