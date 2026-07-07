import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateUtils {
  /**
   * Format an ISO date string into a human-readable format.
   * @param dateString ISO date string (e.g. "2026-06-09T11:53:37.475068Z")
   * @param locale optional locale (default: 'en-GB')
   */
  formatDate(dateString: string, locale: string = 'en-GB'): string {
    if (!dateString) return '';
    try {
      const formatter = new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      return formatter.format(new Date(dateString));
    } catch {
      return dateString; // fallback if parsing fails
    }
  }
}
