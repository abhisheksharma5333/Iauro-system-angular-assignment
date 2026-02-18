# Students Feature Documentation

## Overview

The Students feature is a complete module implementing clean architecture principles with Angular 18 standalone components, Material Design, and state management using Angular Signals.

## Architecture

### Clean Architecture Principles Applied

1. **Separation of Concerns**: Each layer has distinct responsibilities
2. **Dependency Injection**: All dependencies are injected, never instantiated
3. **Reactive Programming**: RxJS and Angular Signals for reactive data flow
4. **Type Safety**: Strict TypeScript typing throughout
5. **Reusability**: Components and services are highly reusable
6. **Testability**: All services and components are independently testable

### Folder Structure

```
src/app/features/students/
├── models/
│   └── student.model.ts          # Data models and interfaces
├── services/
│   └── student.service.ts        # HTTP API communication
├── store/
│   └── student.store.ts          # State management (Signals)
├── components/
│   ├── student-form.component.ts # Form component
│   └── student-table.component.ts # Table component
├── pages/
│   └── students-list.component.ts # Main page component
├── students.routes.ts            # Feature routes
├── index.ts                       # Public API exports
└── [README or doc files]
```

## Layer Details

### 1. Models Layer (`models/student.model.ts`)

Defines all data structures and interfaces:

```typescript
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enrollmentDate: Date;
  gpa: number;
  major: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Interfaces:**
- `Student` - Complete student entity
- `StudentCreatePayload` - Required fields for creation
- `StudentUpdatePayload` - Partial fields for updates
- `StudentListResponse` - Paginated API response
- `StudentFilterCriteria` - Filter parameters
- `PaginationParams` - Pagination settings

### 2. Service Layer (`services/student.service.ts`)

Handles all HTTP communication with the API:

```typescript
@Injectable({ providedIn: 'root' })
export class StudentService {
  getStudents(params?: StudentQueryParams): Observable<StudentListResponse>
  getStudentById(id: string): Observable<Student>
  createStudent(payload: StudentCreatePayload): Observable<Student>
  updateStudent(id: string, payload: StudentUpdatePayload): Observable<Student>
  deleteStudent(id: string): Observable<void>
  deleteStudents(ids: string[]): Observable<{ deleted: number }>
  getMajors(): Observable<string[]>
  searchStudents(searchTerm: string): Observable<Student[]>
}
```

**Responsibilities:**
- Construct API URLs
- Handle HTTP parameters
- Convert API responses
- Error handling (delegated to consumers)

### 3. Store Layer (`store/student.store.ts`)

State management using Angular Signals:

```typescript
@Injectable({ providedIn: 'root' })
export class StudentStore {
  // Signals
  readonly students = computed(() => this.state().students);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);
  readonly totalCount = computed(() => this.state().totalCount);
  
  // Methods
  loadStudents(): void
  createStudent(payload: any): void
  updateStudent(id: string, payload: any): void
  deleteStudent(id: string): void
  setPagination(page: number, pageSize: number): void
  setSort(sortBy: string, sortOrder: 'asc' | 'desc'): void
  setFilters(filters: Record<string, any>): void
}
```

**Key Features:**
- Reactive state management with Signals
- Computed selectors for derived state
- Automatic error handling
- Pagination and sorting
- Filter management
- Selection management

### 4. Component Layer

#### Form Component (`components/student-form.component.ts`)

- **Type:** Standalone form component
- **Dependencies:** Reactive Forms, Material Form Fields
- **Features:**
  - Create and edit modes
  - Validation with error messages
  - Date picker integration
  - Major selection dropdown
  - GPA validation (0-4 range)
  - Phone format validation
  - Cancel/Submit actions

#### Table Component (`components/student-table.component.ts`)

- **Type:** Standalone data table component
- **Dependencies:** Material Table, Paginator, Sort
- **Features:**
  - Sortable columns
  - Pagination support
  - Row selection with checkboxes
  - Bulk selection (select all)
  - Custom action buttons
  - Empty state handling
  - Loading indicator
  - Responsive design
  - Status badges

### 5. Page Component (`pages/students-list.component.ts`)

Orchestrates the feature:

```typescript
export class StudentsPageComponent implements OnInit {
  // Injects store and dialog
  store: StudentStore
  
  // Methods
  openCreateForm(): void
  openEditForm(student: Student): void
  deleteStudent(id: string): void
  onPageChange(event: { page: number; pageSize: number }): void
  onSortChange(event: { sortBy: string; sortOrder: 'asc' | 'desc' }): void
  onSelectionChange(selectedIds: string[]): void
}
```

**Responsibilities:**
- Manage page-level interactions
- Handle dialog management
- Display notifications
- Coordinate between store and components

## Usage Examples

### 1. Using the Store in a Component

```typescript
import { Component } from '@angular/core';
import { StudentStore } from './store/student.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div>
      <h1>Total Students: {{ store.totalCount() }}</h1>
      <p *ngIf="store.isLoading()">Loading...</p>
      <p *ngIf="store.error()">{{ store.error() }}</p>
      <ul>
        <li *ngFor="let student of store.students()">
          {{ student.firstName }} {{ student.lastName }}
        </li>
      </ul>
    </div>
  `
})
export class DashboardComponent {
  constructor(public store: StudentStore) {}

  ngOnInit() {
    // Store automatically loads students
    // Access data via signals
  }
}
```

### 2. Creating a Student

```typescript
const payload: StudentCreatePayload = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '1234567890',
  enrollmentDate: new Date(),
  gpa: 3.5,
  major: 'Computer Science'
};

this.store.createStudent(payload);
```

### 3. Filtering and Pagination

```typescript
// Set pagination
this.store.setPagination(2, 20);

// Set filters
this.store.setFilters({
  major: 'Computer Science',
  minGpa: 3.0,
  isActive: true
});

// Set sort
this.store.setSort('gpa', 'desc');
```

## API Contract

Expected backend API endpoints:

```
GET    /api/students              - List students (with pagination, filters)
GET    /api/students/:id          - Get single student
POST   /api/students              - Create student
PUT    /api/students/:id          - Update student
DELETE /api/students/:id          - Delete student
POST   /api/students/bulk-delete  - Bulk delete
GET    /api/students/majors       - Get majors list
GET    /api/students/search       - Search students
```

### Request Parameters

```typescript
{
  page: number;           // 1-based page number
  pageSize: number;       // Items per page
  sortBy: string;         // Field to sort by
  sortOrder: 'asc' | 'desc';
  search?: string;        // Search term
  major?: string;         // Filter by major
  isActive?: boolean;     // Filter by status
  minGpa?: number;        // Minimum GPA
  maxGpa?: number;        // Maximum GPA
}
```

### Response Format

```typescript
{
  data: Student[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

## State Management Flow

```
Component
    ↓
User Action (click, input)
    ↓
Store Method (e.g., createStudent)
    ↓
Service Method (e.g., createStudent HTTP call)
    ↓
API Response
    ↓
Store State Update (signal)
    ↓
Computed Selectors Update
    ↓
Component Re-renders (via signals)
```

## Testing Strategy

### Unit Testing Services

```typescript
it('should fetch students', () => {
  const mockResponse: StudentListResponse = { /* ... */ };
  spyOn(http, 'get').and.returnValue(of(mockResponse));
  
  service.getStudents().subscribe(result => {
    expect(result).toEqual(mockResponse);
  });
});
```

### Testing Store

```typescript
it('should load students', () => {
  store.loadStudents();
  expect(store.isLoading()).toBe(true);
  // Wait for async operation
  expect(store.students().length).toBeGreaterThan(0);
});
```

### Testing Components

```typescript
it('should submit form', () => {
  component.form.setValue({ /* valid data */ });
  component.onSubmit();
  expect(component.submitted).toHaveBeenCalled();
});
```

## Performance Considerations

1. **Lazy Loading**: Feature is lazy-loaded via route
2. **Pagination**: Server-side pagination reduces data transfer
3. **Signals**: Efficient reactive updates only affected components re-render
4. **Memoization**: Computed selectors are memoized
5. **OnPush Change Detection**: Can be enabled for optimal performance

## Error Handling

Errors are captured at the Store level:

```typescript
store.error() // Contains error message
store.clearError() // Clear error

// Automatic error management during operations
store.createStudent(payload); // If fails, error is set
```

## Extensions

To add new features:

1. **New API endpoint**: Add method to `StudentService`
2. **New state**: Add signal to `StudentStore`
3. **New UI**: Create standalone component and import in page
4. **New filter**: Add to `StudentFilterCriteria` and UI

## Best Practices Followed

✅ Standalone components throughout  
✅ Lazy loading of feature routes  
✅ Strong typing with interfaces  
✅ Dependency injection  
✅ Single responsibility principle  
✅ DRY (Don't Repeat Yourself)  
✅ Reactive programming with Signals  
✅ Material Design components  
✅ Error handling  
✅ Loading states  
✅ Responsive design  
✅ Accessibility considerations  

## Troubleshooting

### Data not updating
- Check if store method is called
- Verify signal changes trigger component update
- Check network tab for API errors

### Form validation not working
- Ensure FormControl has validators
- Check form control name matches
- Verify form is marked as touched

### Table not sorting
- Verify sortBy matches column definition
- Check service handles sort parameters
- Test API sorting endpoint

## Future Enhancements

- [ ] Advanced filtering UI
- [ ] Export to CSV
- [ ] Bulk operations
- [ ] Undo/Redo functionality
- [ ] Real-time updates (WebSocket)
- [ ] Student profile page
- [ ] Grade management
- [ ] Attendance tracking
