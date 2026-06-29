import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.html',
  styleUrls: ['./badge.css']
})
export class Badge {
  @Input() badgeStatus: string = '';

  /** Automatically map status → Tailwind classes */
  get colorClass(): string {
    switch (this.badgeStatus?.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700 italic';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
