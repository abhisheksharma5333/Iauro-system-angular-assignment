/**
 * Notification Service
 * Centralized service for displaying Material Snackbar notifications
 * Provides reusable notification methods for success, error, info, and warning
 */

import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationConfig extends MatSnackBarConfig {
  type?: NotificationType;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  // Default configuration for snackbars
  private readonly defaultConfig: NotificationConfig = {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
  };

  /**
   * Show success notification
   * @param message The message to display
   * @param config Optional snackbar configuration
   */
  success(message: string, config?: NotificationConfig): void {
    this.show(message, 'success', config);
  }

  /**
   * Show error notification
   * @param message The error message to display
   * @param config Optional snackbar configuration
   */
  error(message: string, config?: NotificationConfig): void {
    this.show(message, 'error', config);
  }

  /**
   * Show info notification
   * @param message The informational message to display
   * @param config Optional snackbar configuration
   */
  info(message: string, config?: NotificationConfig): void {
    this.show(message, 'info', config);
  }

  /**
   * Show warning notification
   * @param message The warning message to display
   * @param config Optional snackbar configuration
   */
  warning(message: string, config?: NotificationConfig): void {
    this.show(message, 'warning', config);
  }

  /**
   * Generic show method for displaying notifications
   * @param message The message to display
   * @param type The type of notification
   * @param config Optional snackbar configuration
   */
  private show(
    message: string,
    type: NotificationType = 'info',
    config?: NotificationConfig
  ): void {
    const mergedConfig: NotificationConfig = {
      ...this.defaultConfig,
      ...config,
      type,
    };

    const panelClass = this.getPanelClass(type);

    this.snackBar.open(message, 'Close', {
      ...mergedConfig,
      panelClass,
    });
  }

  /**
   * Get CSS class based on notification type
   * @param type The notification type
   * @returns Array of CSS class names
   */
  private getPanelClass(type: NotificationType): string[] {
    const baseClass = 'notification-snackbar';
    return [`${baseClass}`, `${baseClass}--${type}`];
  }

  /**
   * Dismiss all currently open snackbars
   */
  dismissAll(): void {
    this.snackBar.dismiss();
  }
}
