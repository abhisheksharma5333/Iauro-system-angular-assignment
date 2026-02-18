# Students Feature - Quick Reference

## File Structure

```
src/app/features/students/
├── models/
│   └── student.model.ts              ✓ Data models & interfaces
├── services/
│   └── student.service.ts            ✓ API communication (10 methods)
├── store/
│   └── student.store.ts              ✓ State management with Signals
├── components/
│   ├── student-form.component.ts     ✓ Reactive form (create/edit)
│   └── student-table.component.ts    ✓ Data table with sorting/pagination
├── pages/
│   └── students-list.component.ts    ✓ Main orchestrator component
├── students.routes.ts                ✓ Feature routes (lazy-loaded)
├── index.ts                          ✓ Public API exports
└── STUDENTS_FEATURE.md               ✓ Detailed documentation
```

## Architecture Highlights

### 1. Clean Architecture Layers

```
UI Layer (Components)
    ↓
Business Logic (Store)
    ↓
Data Access (Service)
    ↓
API Layer (HTTP)
```

### 2. State Management (Angular Signals)

```typescript
// Reactive signals
students() → returns current students
isLoading() → returns loading state
error() → returns error message
totalCount() → returns total items

// Computed selectors
totalPages() → computed from totalCount
isEmpty() → computed from students
displayedStudents() → subset of students
```

### 3. Angular Material Integration

- **Table Component**: Sorting, pagination, row selection
- **Form Component**: Validation, error messages, date picker
- **Dialog**: Create/edit modals
- **Snackbar**: User notifications
- **Progress Bar**: Loading indicator
- **Toolbar**: Header with actions

## Key Features

✅ **Standalone Components**: All components use standalone API  
✅ **Lazy Loading**: Feature loaded on demand via route  
✅ **Reactive Forms**: Strong typing with Reactive Forms  
✅ **Type Safety**: Full TypeScript strict mode  
✅ **Error Handling**: Centralized error management  
✅ **Pagination**: Server-side pagination  
✅ **Sorting**: Sortable columns  
✅ **Filtering**: Multiple filter criteria  
✅ **Selection**: Bulk row selection  
✅ **Responsive Design**: Works on mobile/tablet  

## API Contract

```
GET    /api/students                - List with pagination
GET    /api/students/:id            - Get single
POST   /api/students                - Create
PUT    /api/students/:id            - Update
DELETE /api/students/:id            - Delete
POST   /api/students/bulk-delete    - Bulk delete
GET    /api/students/majors         - Get majors
GET    /api/students/search         - Search
```

## Usage Examples

### Access Store in Any Component

```typescript
import { StudentStore } from '@app/features/students';

@Component({ ... })
export class MyComponent {
  constructor(public store: StudentStore) {}
  
  ngOnInit() {
    // Auto-loads on construction
    console.log(this.store.students());     // Signal access
    console.log(this.store.isLoading());    // Loaded state
    console.log(this.store.totalCount());   // Total items
  }
}
```

### Create Student

```typescript
store.createStudent({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '1234567890',
  enrollmentDate: new Date(),
  gpa: 3.5,
  major: 'Computer Science'
});
```

### Filter & Sort

```typescript
// Pagination
store.setPagination(1, 25);

// Filters
store.setFilters({ major: 'CS', minGpa: 3.0 });

// Sort
store.setSort('gpa', 'desc');

// Clear all
store.clearFilters();
```

### Delete Student

```typescript
store.deleteStudent('student-id');
```

## Component Props & Events

### StudentFormComponent

**Inputs:**
```typescript
@Input() student: Student | null
@Input() isSubmitting: boolean
@Input() majors: string[]
```

**Outputs:**
```typescript
@Output() submitted: EventEmitter<StudentCreatePayload | StudentUpdatePayload>
@Output() cancelled: EventEmitter<void>
```

### StudentTableComponent

**Inputs:**
```typescript
@Input() students: Student[]
@Input() totalCount: number
@Input() pageSize: number
@Input() isLoading: boolean
@Input() actions: TableAction[]
```

**Outputs:**
```typescript
@Output() pageChange: EventEmitter<{ page: number; pageSize: number }>
@Output() sortChange: EventEmitter<{ sortBy: string; sortOrder: 'asc' | 'desc' }>
@Output() selectionChange: EventEmitter<string[]>
```

## Route Configuration

Feature automatically loads at `/students`:

```typescript
// In app.routes.ts
{
  path: 'students',
  loadChildren: () => import('./features/students/students.routes')
    .then(m => m.STUDENTS_ROUTES)
}
```

## Testing Strategy

### Unit Test Service

```typescript
const students = await firstValueFrom(
  service.getStudents({ page: 1, pageSize: 10 })
);
```

### Unit Test Store

```typescript
store.createStudent(payload);
expect(store.students().length).toBeGreaterThan(0);
```

### Component Testing

```typescript
component.form.setValue({ /* valid data */ });
component.onSubmit();
expect(component.submitted).toHaveBeenCalled();
```

## Performance Notes

- Lazy-loaded feature ~1.6MB
- Computed signals are memoized
- HTTP requests include pagination
- Material table with virtual scrolling (can be enabled)
- Change detection can use OnPush strategy

## Common Tasks

| Task | How To |
|------|--------|
| Load students | Store initializes automatically |
| Filter results | `store.setFilters(criteria)` |
| Change page | `store.setPagination(page, size)` |
| Sort column | `store.setSort(field, order)` |
| Create student | `store.createStudent(payload)` |
| Edit student | `store.updateStudent(id, payload)` |
| Delete student | `store.deleteStudent(id)` |
| Handle errors | Subscribe to `store.error()` |
| Show loading | Check `store.isLoading()` |

## Folder Organization Rationale

| Folder | Purpose |
|--------|---------|
| `models/` | Type definitions, interfaces (no logic) |
| `services/` | API layer, HTTP communication |
| `store/` | State management with Signals |
| `components/` | Reusable presentational components |
| `pages/` | Page-level orchestrator components |

## Best Practices Applied

✓ Single Responsibility Principle  
✓ Open/Closed Principle  
✓ Dependency Injection  
✓ DRY (Don't Repeat Yourself)  
✓ SOLID principles  
✓ Reactive programming  
✓ Type safety  
✓ Separation of concerns  
✓ Testability  
✓ Reusability  

## Next Steps

1. **Mock API**: Create mock HTTP backend for development
2. **Tests**: Add unit tests for components and services
3. **E2E**: Add Cypress/Playwright tests
4. **Real Backend**: Connect to actual API
5. **Enhanced Features**: Add export, reports, bulk operations
6. **Student Profile**: Create detail page for each student
7. **Audit Log**: Track changes with timestamps

## Troubleshooting

### Q: Data not showing?
A: Check browser Network tab for API errors. Verify API endpoint matches configuration.

### Q: Form validation failing?
A: Check validators are applied to FormControls. Ensure form is touched for errors.

### Q: Sorting not working?
A: Verify service handles sort parameters. Test API endpoint directly.

### Q: Memory leak?
A: Store uses `takeUntilDestroyed()` to unsubscribe. Check component cleanup.

## Documentation Files

- **STUDENTS_FEATURE.md** - Comprehensive architecture & implementation guide
- **Quick Reference** - This file
- **Code Comments** - Inline documentation in source files
