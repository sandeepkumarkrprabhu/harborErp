import { Injectable } from '@angular/core';
import { NotificationService } from './notification';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private notificationService: NotificationService) {}

  showError(message: string) {
    this.notificationService.show(message, 'error');
  }

  showSuccess(message: string) {
    this.notificationService.show(message, 'success');
  }
}
