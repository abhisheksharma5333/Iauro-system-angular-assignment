import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly title = 'Welcome to Iauro Angular Assignment';
  readonly features: readonly string[] = [
    'Angular 18 Standalone Components',
    'Angular Material Integration',
    'Indigo/Pink Material Theme',
    'Enterprise-grade Architecture',
    'SCSS Styling',
    'Feature-based Folder Structure',
    'Lazy Loading Routes',
    'TypeScript Strict Mode',
    'Global Material Typography',
    'Animations Enabled'
  ];
}
