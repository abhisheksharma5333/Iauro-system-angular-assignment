/**
 * Student Store Unit Tests
 * Tests for StudentStore Signals-based state management
 */

import { TestBed } from '@angular/core/testing';
import { StudentStore } from './student.store';
import { Student } from '../models/student.model';

describe('StudentStore', () => {
  let store: StudentStore;

  // Mock student data
  const mockStudent: Student = {
    id: 'STU-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    gender: 'Male',
    course: 'Computer Science',
    skills: ['Angular', 'TypeScript'],
    city: 'New York',
    dob: new Date('1995-05-15'),
    address: '123 Main St, New York, NY 10001',
  };

  const mockStudent2: Student = {
    id: 'STU-002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    gender: 'Female',
    course: 'Web Development',
    skills: ['React', 'JavaScript'],
    city: 'Los Angeles',
    dob: new Date('1996-08-20'),
    address: '456 Oak Ave, Los Angeles, CA 90001',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentStore],
    });
    store = TestBed.inject(StudentStore);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should create the store', () => {
      expect(store).toBeTruthy();
    });

    it('should initialize with empty students array', () => {
      expect(store.students().length).toBe(0);
    });

    it('should have empty initial state', () => {
      expect(store.isEmpty()).toBe(true);
    });

    it('should have no error on initialization', () => {
      expect(store.error()).toBeNull();
    });

    it('should have zero total students on init', () => {
      expect(store.totalStudents()).toBe(0);
    });
  });

  describe('addStudent()', () => {
    it('should add a student to the store', () => {
      store.addStudent(mockStudent);

      expect(store.students().length).toBe(1);
      expect(store.students()[0]).toEqual(mockStudent);
    });

    it('should add multiple students', () => {
      store.addStudent(mockStudent);
      store.addStudent(mockStudent2);

      expect(store.students().length).toBe(2);
      expect(store.totalStudents()).toBe(2);
    });

    it('should not be empty after adding a student', () => {
      store.addStudent(mockStudent);

      expect(store.isEmpty()).toBe(false);
    });

    it('should persist student to localStorage', () => {
      store.addStudent(mockStudent);

      const storedData = localStorage.getItem('students_data');
      expect(storedData).toBeTruthy();

      const parsed = JSON.parse(storedData!);
      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe(mockStudent.id);
    });

    it('should clear error on successful add', () => {
      store.clearError(); // Ensure no error initially
      store.addStudent(mockStudent);

      expect(store.error()).toBeNull();
    });

    it('should handle adding student with empty skills array', () => {
      const studentWithoutSkills: Student = {
        ...mockStudent,
        skills: [],
      };

      store.addStudent(studentWithoutSkills);

      expect(store.students()[0].skills).toEqual([]);
    });

    it('should maintain student data integrity', () => {
      store.addStudent(mockStudent);
      const addedStudent = store.students()[0];

      expect(addedStudent.firstName).toBe('John');
      expect(addedStudent.email).toBe('john.doe@example.com');
      expect(addedStudent.course).toBe('Computer Science');
      expect(addedStudent.skills).toContain('Angular');
    });
  });

  describe('updateStudent()', () => {
    beforeEach(() => {
      store.addStudent(mockStudent);
    });

    it('should update student data', () => {
      const updates = { firstName: 'Jonathan', email: 'jonathan.doe@example.com' };

      store.updateStudent(mockStudent.id, updates);

      const updatedStudent = store.getStudentById(mockStudent.id);
      expect(updatedStudent?.firstName).toBe('Jonathan');
      expect(updatedStudent?.email).toBe('jonathan.doe@example.com');
    });

    it('should preserve unchanged fields', () => {
      const updates = { firstName: 'Jonathan' };

      store.updateStudent(mockStudent.id, updates);

      const updatedStudent = store.getStudentById(mockStudent.id);
      expect(updatedStudent?.lastName).toBe('Doe');
      expect(updatedStudent?.course).toBe('Computer Science');
    });

    it('should update skills array', () => {
      const updates = { skills: ['Angular', 'TypeScript', 'Node.js'] };

      store.updateStudent(mockStudent.id, updates);

      const updatedStudent = store.getStudentById(mockStudent.id);
      expect(updatedStudent?.skills.length).toBe(3);
      expect(updatedStudent?.skills).toContain('Node.js');
    });

    it('should not affect other students', () => {
      store.addStudent(mockStudent2);

      store.updateStudent(mockStudent.id, { firstName: 'Jonathan' });

      const unaffectedStudent = store.getStudentById(mockStudent2.id);
      expect(unaffectedStudent?.firstName).toBe('Jane');
    });

    it('should clear error on successful update', () => {
      store.updateStudent(mockStudent.id, { firstName: 'Jonathan' });

      expect(store.error()).toBeNull();
    });

    it('should persist updates to localStorage', () => {
      store.updateStudent(mockStudent.id, { firstName: 'Jonathan' });

      const storedData = localStorage.getItem('students_data');
      const parsed = JSON.parse(storedData!);

      expect(parsed[0].firstName).toBe('Jonathan');
    });

    it('should update course and city', () => {
      const updates = {
        course: 'Data Science',
        city: 'San Francisco',
      };

      store.updateStudent(mockStudent.id, updates);

      const updatedStudent = store.getStudentById(mockStudent.id);
      expect(updatedStudent?.course).toBe('Data Science');
      expect(updatedStudent?.city).toBe('San Francisco');
    });

    it('should handle partial updates with null values', () => {
      store.updateStudent(mockStudent.id, { address: '' });

      const updatedStudent = store.getStudentById(mockStudent.id);
      expect(updatedStudent?.address).toBe('');
    });
  });

  describe('deleteStudent()', () => {
    beforeEach(() => {
      store.addStudent(mockStudent);
      store.addStudent(mockStudent2);
    });

    it('should delete a student by id', () => {
      store.deleteStudent(mockStudent.id);

      expect(store.students().length).toBe(1);
      expect(store.getStudentById(mockStudent.id)).toBeUndefined();
    });

    it('should remove only the specified student', () => {
      store.deleteStudent(mockStudent.id);

      const remainingStudent = store.getStudentById(mockStudent2.id);
      expect(remainingStudent).toEqual(mockStudent2);
    });

    it('should persist deletion to localStorage', () => {
      store.deleteStudent(mockStudent.id);

      const storedData = localStorage.getItem('students_data');
      const parsed = JSON.parse(storedData!);

      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe(mockStudent2.id);
    });

    it('should clear error on successful delete', () => {
      store.deleteStudent(mockStudent.id);

      expect(store.error()).toBeNull();
    });

    it('should clear selected student if it was deleted', () => {
      store.selectStudent(mockStudent.id);
      expect(store.selectedStudentId()).toBe(mockStudent.id);

      store.deleteStudent(mockStudent.id);

      expect(store.selectedStudentId()).toBeNull();
    });

    it('should not clear selection if different student is deleted', () => {
      store.selectStudent(mockStudent2.id);

      store.deleteStudent(mockStudent.id);

      expect(store.selectedStudentId()).toBe(mockStudent2.id);
    });

    it('should update total students count', () => {
      expect(store.totalStudents()).toBe(2);

      store.deleteStudent(mockStudent.id);

      expect(store.totalStudents()).toBe(1);
    });

    it('should handle deleting non-existent student gracefully', () => {
      const initialCount = store.students().length;

      store.deleteStudent('NON-EXISTENT-ID');

      expect(store.students().length).toBe(initialCount);
    });
  });

  describe('deleteStudents() - Bulk Delete', () => {
    beforeEach(() => {
      store.addStudent(mockStudent);
      store.addStudent(mockStudent2);
    });

    it('should delete multiple students', () => {
      const idsToDelete = [mockStudent.id, mockStudent2.id];

      store.deleteStudents(idsToDelete);

      expect(store.students().length).toBe(0);
    });

    it('should persist bulk deletion to localStorage', () => {
      store.deleteStudents([mockStudent.id]);

      const storedData = localStorage.getItem('students_data');
      const parsed = JSON.parse(storedData!);

      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe(mockStudent2.id);
    });

    it('should clear selection if selected student is deleted', () => {
      store.selectStudent(mockStudent.id);

      store.deleteStudents([mockStudent.id]);

      expect(store.selectedStudentId()).toBeNull();
    });
  });

  describe('Search and Filter Methods', () => {
    beforeEach(() => {
      store.addStudent(mockStudent);
      store.addStudent(mockStudent2);
    });

    it('should search students by first name', () => {
      const results = store.searchStudents('John');

      expect(results.length).toBe(1);
      expect(results[0].firstName).toBe('John');
    });

    it('should search students by email', () => {
      const results = store.searchStudents('jane.smith');

      expect(results.length).toBe(1);
      expect(results[0].email).toBe('jane.smith@example.com');
    });

    it('should search students case-insensitively', () => {
      const results = store.searchStudents('JOHN');

      expect(results.length).toBe(1);
      expect(results[0].firstName).toBe('John');
    });

    it('should return all students for empty search', () => {
      const results = store.searchStudents('');

      expect(results.length).toBe(2);
    });

    it('should filter students by course', () => {
      const results = store.filterByCourse('Computer Science');

      expect(results.length).toBe(1);
      expect(results[0].course).toBe('Computer Science');
    });

    it('should filter students by skills', () => {
      const results = store.filterBySkills(['Angular']);

      expect(results.length).toBe(1);
      expect(results[0].firstName).toBe('John');
    });

    it('should get unique courses', () => {
      const courses = store.getUniqueCourses();

      expect(courses.length).toBe(2);
      expect(courses).toContain('Computer Science');
      expect(courses).toContain('Web Development');
    });

    it('should get unique skills', () => {
      const skills = store.getUniqueSkills();

      expect(skills.length).toBeGreaterThanOrEqual(4);
      expect(skills).toContain('Angular');
      expect(skills).toContain('React');
    });
  });

  describe('Selection Management', () => {
    beforeEach(() => {
      store.addStudent(mockStudent);
    });

    it('should select a student', () => {
      store.selectStudent(mockStudent.id);

      expect(store.selectedStudentId()).toBe(mockStudent.id);
    });

    it('should get selected student via computed signal', () => {
      store.selectStudent(mockStudent.id);

      expect(store.selectedStudent()).toEqual(mockStudent);
    });

    it('should clear selection', () => {
      store.selectStudent(mockStudent.id);
      store.selectStudent(null);

      expect(store.selectedStudentId()).toBeNull();
      expect(store.selectedStudent()).toBeNull();
    });

    it('should return null for non-existent selected student', () => {
      store.selectStudent('NON-EXISTENT');

      expect(store.selectedStudent()).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should clear error message', () => {
      store.clearError();

      expect(store.error()).toBeNull();
    });

    it('should maintain error null on normal operations', () => {
      store.addStudent(mockStudent);
      store.updateStudent(mockStudent.id, { firstName: 'Updated' });
      store.deleteStudent(mockStudent.id);

      expect(store.error()).toBeNull();
    });
  });

  describe('Store Snapshot', () => {
    beforeEach(() => {
      store.addStudent(mockStudent);
    });

    it('should return current state snapshot', () => {
      const snapshot = store.getSnapshot();

      expect(snapshot.students.length).toBe(1);
      expect(snapshot.students[0].id).toBe(mockStudent.id);
      expect(snapshot.selectedStudentId).toBeNull();
      expect(snapshot.error).toBeNull();
      expect(snapshot.isLoading).toBe(false);
    });
  });

  describe('Clear Store', () => {
    beforeEach(() => {
      store.addStudent(mockStudent);
      store.addStudent(mockStudent2);
    });

    it('should clear all students', () => {
      store.clearStore();

      expect(store.students().length).toBe(0);
      expect(store.isEmpty()).toBe(true);
    });

    it('should clear localStorage', () => {
      store.clearStore();

      const storedData = localStorage.getItem('students_data');
      expect(storedData).toBeNull();
    });

    it('should reset selection', () => {
      store.selectStudent(mockStudent.id);
      store.clearStore();

      expect(store.selectedStudentId()).toBeNull();
    });
  });
});
