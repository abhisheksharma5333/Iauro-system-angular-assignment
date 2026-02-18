export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  course: string;
  skills: string[];
  city: string;
  dob: Date;
  address: string;
}

export type StudentCreatePayload = Omit<Student, 'id'>;
export type StudentUpdatePayload = Partial<StudentCreatePayload>;

export interface StudentListResponse {
  data: Student[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface StudentFilterCriteria {
  searchTerm?: string;
  course?: string;
  city?: string;
  skills?: string[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: 'firstName' | 'lastName' | 'email' | 'course' | 'city';
  sortOrder?: 'asc' | 'desc';
}

export type StudentQueryParams = StudentFilterCriteria & Partial<PaginationParams>;
