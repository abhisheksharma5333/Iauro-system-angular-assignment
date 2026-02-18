# Iauro Angular Assignment

Enterprise-grade Angular 18 application with Material Design and standalone components.

## Features

- ✅ Angular 18 with Standalone Components
- ✅ Angular Material 18 Integration (Indigo/Pink Theme)
- ✅ Material CDK for complex UI patterns
- ✅ Global Material Typography
- ✅ Animations Enabled
- ✅ Standalone Routing with Lazy Loading
- ✅ SCSS Styling
- ✅ Enterprise Architecture
- ✅ TypeScript Strict Mode
- ✅ Best Practices Folder Structure

```
src/
├── app/
│   ├── core/                    # Core services, models, guards, interceptors
│   │   ├── services/            # Singleton services
│   │   ├── guards/              # Route guards
│   │   ├── interceptors/        # HTTP interceptors
│   │   └── models/              # Core data models
│   ├── shared/                  # Shared components, directives, pipes
│   │   ├── components/          # Reusable components
│   │   ├── directives/          # Custom directives
│   │   └── pipes/               # Custom pipes
│   ├── features/                # Feature modules (lazy-loaded)
│   │   ├── home/                # Home feature
│   │   └── [feature]/           # Add more features here
│   ├── layouts/                 # Layout components
│   ├── app.config.ts            # Application configuration
│   ├── app.routes.ts            # Route definitions
│   ├── app.component.ts         # Root component
│   └── app.component.html
├── config/                      # Configuration files
│   └── environment.ts           # Environment configuration
├── styles.scss                  # Global styles
├── main.ts                      # Application entry point
└── index.html                   # HTML template
```

## Features

- ✅ Angular 18 with Standalone Components
- ✅ Standalone Routing with Lazy Loading
- ✅ SCSS Styling
- ✅ Enterprise Architecture
- ✅ TypeScript Strict Mode
- ✅ Best Practices Folder Structure

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Development

### Generate Components

To generate a new standalone component:

```bash
ng generate component --standalone [component-name]
```

### Generate Services

```bash
ng generate service core/services/[service-name]
```

### Testing

Run unit tests:

```bash
npm test
```

## Architecture Guidelines

### Core Module
- Contains singleton services
- HTTP interceptors
- Route guards
- Core models and interfaces

### Shared Module
- Reusable components
- Custom directives
- Custom pipes
- Shared utilities

### Features
- Feature-specific components and services
- Lazy-loaded routes
- Feature-specific models

## Architecture Guidelines

### Core Module
- Contains singleton services
- HTTP interceptors
- Route guards
- Core models and interfaces

### Shared Module
- Reusable components
- Custom directives
- Custom pipes
- Shared utilities
- Material component exports (material.module.ts)

### Features
- Feature-specific components and services
- Lazy-loaded routes
- Feature-specific models

## Material Design Integration

### Theme Configuration

The application uses Angular Material 18 with the **Indigo/Pink theme**:

- **Primary Color:** Indigo (#3f51b5)
- **Accent Color:** Pink (#e91e63)
- **Global Typography:** Roboto font family
- **Animations:** Enabled with 0.3s cubic-bezier timing

### Material Components Usage

Import Material modules in standalone components:

```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  template: `...`
})
export class ExampleComponent {}
```

For a comprehensive list of available Material components and usage guide, see [MATERIAL_SETUP.md](MATERIAL_SETUP.md).

## Best Practices Followed

1. **Standalone Components**: All components use the standalone API
2. **Lazy Loading**: Feature modules are lazy-loaded
3. **Type Safety**: Strict TypeScript mode enabled
4. **Scalability**: Feature-based folder structure
5. **Code Organization**: Clear separation of concerns
6. **Material Design**: Official Google Material Design system
7. **Animations**: Smooth transitions and interactions

## License

Copyright © 2026 Iauro. All rights reserved.
