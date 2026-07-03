import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info';
export type NotificationPosition = 'top' | 'center' | 'bottom';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  position?: NotificationPosition;
  duration?: number; // milliseconds
  actionLabel?: string;
  action?: () => void;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private nextId = 1;

  get notifications() {
    return this.notifications$.asObservable();
  }

  show(
    message: string,
    type: NotificationType = 'info',
    options: {
      duration?: number;
      position?: NotificationPosition;
      actionLabel?: string;
      action?: () => void;
    } = {}
  ) {
    const notification: Notification = {
      id: this.nextId++,
      message,
      type,
      position: options.position ?? 'bottom',
      duration: options.duration ?? 4000,
      actionLabel: options.actionLabel,
      action: options.action
    };

    this.notifications$.next([...this.notifications$.value, notification]);

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => this.dismiss(notification.id), notification.duration);
    }
  }

  dismiss(id: number) {
    this.notifications$.next(this.notifications$.value.filter(n => n.id !== id));
  }
}
