import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Student,
  StudentListResponse,
  StudentCreatePayload,
  StudentUpdatePayload,
  StudentQueryParams,
} from '../models/student.model';
import { environment } from '@config/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly apiUrl = `${environment.apiUrl}/students`;

  constructor(private readonly http: HttpClient) {}

  getStudents(params?: StudentQueryParams): Observable<StudentListResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page !== undefined) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.pageSize !== undefined) {
        httpParams = httpParams.set('pageSize', params.pageSize.toString());
      }
      if (params.sortBy) {
        httpParams = httpParams.set('sortBy', params.sortBy);
      }
      if (params.sortOrder) {
        httpParams = httpParams.set('sortOrder', params.sortOrder);
      }
      if (params.searchTerm) {
        httpParams = httpParams.set('search', params.searchTerm);
      }
      if (params.course) {
        httpParams = httpParams.set('course', params.course);
      }
      if (params.city) {
        httpParams = httpParams.set('city', params.city);
      }
      if (params.skills?.length) {
        httpParams = httpParams.set('skills', params.skills.join(','));
      }
    }

    return this.http.get<StudentListResponse>(this.apiUrl, { params: httpParams });
  }

  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(payload: StudentCreatePayload): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, payload);
  }

  updateStudent(id: string, payload: StudentUpdatePayload): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, payload);
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteStudents(ids: string[]): Observable<{ deleted: number }> {
    return this.http.post<{ deleted: number }>(`${this.apiUrl}/bulk-delete`, { ids });
  }

  getCourses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/courses`);
  }

  searchStudents(searchTerm: string): Observable<Student[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<Student[]>(`${this.apiUrl}/search`, { params });
  }
}
