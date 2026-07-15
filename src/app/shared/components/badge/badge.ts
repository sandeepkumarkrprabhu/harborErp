import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.html',
  styleUrls: ['./badge.css']
})
export class Badge {
  /** The status key used for color mapping */
  @Input() badgeStatus: string = '';

  /** Optional text to display inside the badge */
  @Input() text?: string;

  /** Automatically map status → Tailwind classes */
  get colorClass(): string {
    switch (this.badgeStatus?.toLowerCase()) {
      case 'success':
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'failed':
      case 'inactive':
        return 'bg-red-100 text-red-700';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700 italic';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  /** Final text shown in the badge */
  get displayText(): string {
    return this.text?.trim() || this.badgeStatus;
  }
}
