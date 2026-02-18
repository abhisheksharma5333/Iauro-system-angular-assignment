# Angular Material Integration Guide

This document outlines how Angular Material has been integrated into the project.

## Installation

Angular Material 18 and CDK 18 have been installed via npm:

```bash
npm install @angular/material@18 @angular/cdk@18
```

## Theme Configuration

### Prebuilt Theme

The project uses Material's **Indigo/Pink** prebuilt theme, imported in `src/styles.scss`:

```scss
@import '@angular/material/prebuilt-themes/indigo-pink.css';
```

**Theme Colors:**
- **Primary:** Indigo (#3f51b5)
- **Accent:** Pink (#e91e63)
- **Warn:** Red

### Available Prebuilt Themes

You can switch to any of these themes by changing the import in `src/styles.scss`:

- `indigo-pink.css` (default)
- `deeppurple-amber.css`
- `purple-green.css`
- `pink-bluegrey.css`

## Typography

Material's typography system is automatically applied through the prebuilt theme. The following typography classes are available:

- `.mat-headline-1` through `.mat-headline-6`
- `.mat-title`
- `.mat-body-1`, `.mat-body-2`
- `.mat-caption`
- `.mat-label`

**Font Family:** Roboto (Material default)

## Animations

Animations are enabled globally for all Material components:

```scss
@media (prefers-reduced-motion: no-preference) {
  .mat-mdc-button,
  .mat-mdc-card,
  .mat-toolbar,
  .mat-list-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
```

The `provideAnimations()` is configured in `src/app/app.config.ts`.

## Material Modules

### Shared Material Exports

The project includes a centralized Material module export at `src/app/shared/material.module.ts` that contains:

- All commonly used Material components
- Export array `MATERIAL_COMPONENTS` for standalone components

### Using Material Components

#### In Standalone Components

Import the specific Material modules you need:

```typescript
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  template: `
    <mat-card>
      <button mat-raised-button color="primary">Click me</button>
    </mat-card>
  `
})
export class ExampleComponent {}
```

#### Using the Material Module Helper

Alternatively, import the pre-configured module:

```typescript
import { MATERIAL_COMPONENTS } from '@app/shared/material.module';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MATERIAL_COMPONENTS],
  template: `...`
})
export class ExampleComponent {}
```

## Available Material Components

The following Material components are exported in `material.module.ts`:

### Basic Components
- `MatButtonModule` - Buttons
- `MatIconModule` - Icons
- `MatToolbarModule` - Toolbar
- `MatSidenavModule` - Sidenav

### Forms
- `MatFormFieldModule` - Form fields
- `MatInputModule` - Input fields
- `MatSelectModule` - Select dropdowns
- `MatCheckboxModule` - Checkboxes
- `MatRadioModule` - Radio buttons
- `MatSlideToggleModule` - Toggle switches
- `MatDatepickerModule` - Date picker
- `MatNativeDateModule` - Date picker provider

### Navigation
- `MatMenuModule` - Menus
- `MatTabsModule` - Tabs
- `MatStepperModule` - Stepper

### Layout
- `MatCardModule` - Cards
- `MatListModule` - Lists
- `MatDividerModule` - Dividers
- `MatExpansionModule` - Expansion panels

### Indicators
- `MatProgressBarModule` - Progress bar
- `MatProgressSpinnerModule` - Progress spinner
- `MatChipsModule` - Chips

### Popups & Modals
- `MatDialogModule` - Dialogs
- `MatTooltipModule` - Tooltips
- `MatSnackBarModule` - Snack bars

### Data Tables
- `MatTableModule` - Data tables
- `MatSortModule` - Table sorting
- `MatPaginatorModule` - Table pagination

## Global Configuration

### App Providers

Material ripple configuration is applied in `src/app/app.config.ts`:

```typescript
{
  provide: MAT_RIPPLE_GLOBAL_OPTIONS,
  useValue: {
    disabled: false,
    animation: {
      enterDuration: 300,
      exitDuration: 300,
    }
  }
}
```

## Customization

### Custom Theme

To create a custom theme, refer to the [Angular Material Theming Guide](https://material.angular.io/guide/theming).

### Component-Specific Styles

Each component can have its own SCSS file for Material component overrides:

```scss
// app.component.scss
::ng-deep {
  .mat-mdc-button {
    // custom styles
  }
}
```

## Common Material Directives

- `mat-raised-button` - Raised button style
- `mat-flat-button` - Flat button style
- `mat-stroked-button` - Stroked button style
- `matListItem` - List item
- `matListItemIcon` - Icon in list
- `matListItemTitle` - Title in list
- `matColumnDef` - Table column definition
- `matHeaderCell` - Table header cell
- `matCell` - Table cell

## Resources

- [Angular Material Documentation](https://material.angular.io/)
- [Material Design Guidelines](https://material.design/)
- [Angular Material Components](https://material.angular.io/components/categories)

## Project Examples

The following components in this project use Material:

- **AppLayoutComponent** - Uses `MatToolbar`
- **HomeComponent** - Uses `MatCard`, `MatList`, `MatIcon`
