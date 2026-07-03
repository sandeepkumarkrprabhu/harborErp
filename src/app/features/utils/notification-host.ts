import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NotificationService, Notification } from './notification';

@Component({
  selector: 'app-notification-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-host">
      <div class="notifications-top">
        @for (notification of (notifications$ | async)?.filter(n => n.position === 'top'); track notification.id) {
          <div class="notification notification-{{ notification.type }}">
            <span>{{ notification.message }}</span>
            @if (notification.actionLabel) {
              <button
                class="notification-action"
                (click)="notification.action?.(); notificationService.dismiss(notification.id)"
              >
                {{ notification.actionLabel }}
              </button>
            }
          </div>
        }
      </div>

      <div class="notifications-center">
        @for (notification of (notifications$ | async)?.filter(n => n.position === 'center'); track notification.id) {
          <div class="notification notification-{{ notification.type }}">
            <span>{{ notification.message }}</span>
            @if (notification.actionLabel) {
              <button
                class="notification-action"
                (click)="notification.action?.(); notificationService.dismiss(notification.id)"
              >
                {{ notification.actionLabel }}
              </button>
            }
          </div>
        }
      </div>

      <div class="notifications-bottom">
        @for (notification of (notifications$ | async)?.filter(n => n.position === 'bottom'); track notification.id) {
          <div class="notification notification-{{ notification.type }}">
            <span>{{ notification.message }}</span>
            @if (notification.actionLabel) {
              <button
                class="notification-action"
                (click)="notification.action?.(); notificationService.dismiss(notification.id)"
              >
                {{ notification.actionLabel }}
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
  .notification-host {
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  .notifications-top,
  .notifications-center,
  .notifications-bottom {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    align-items: center;
    pointer-events: none;
  }

  .notifications-top { top: 0; justify-content: flex-start; }
  .notifications-center { top: 50%; transform: translateY(-50%); justify-content: center; }
  .notifications-bottom { bottom: 0; justify-content: flex-end; }

  .notification {
    pointer-events: auto;
    min-width: 240px;
    max-width: 100%;
    border-radius: 0.5rem;
    padding: 0.85rem 1rem;
    color: white;
    box-shadow: 0 16px 45px rgba(0, 0, 0, 0.15);
    display: inline-flex;
    gap: 0.75rem;
    align-items: center;
  }

  .notification-action {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.95);
    cursor: pointer;
    font-weight: 600;
  }

  /* ✅ Add colors */
  .notification-success { background: #16a34a; } /* green */
  .notification-error   { background: #b91c1c; } /* deep red for contrast */
  .notification-info    { background: #2563eb; } /* blue */
`]

})
    
export class NotificationHostComponent {
  notificationService = inject(NotificationService);
  notifications$: Observable<Notification[]> = this.notificationService.notifications;
}
