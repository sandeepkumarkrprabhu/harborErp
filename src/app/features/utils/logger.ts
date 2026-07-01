import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Logger {
  /**
   * Debug log - Only logs when environment.debug is true
   */
  debug(...args: unknown[]): void {
    if (environment.debug) {
      console.debug('[DEBUG]', ...args);
    }
  }

  /**
   * General log - Only logs when environment.debug is true
   */
  log(...args: unknown[]): void {
    if (environment.debug) {
      console.log('[LOG]', ...args);
    }
  }

  /**
   * Info log - Only logs when environment.debug is true
   */
  info(...args: unknown[]): void {
    if (environment.debug) {
      console.info('[INFO]', ...args);
    }
  }

  /**
   * Warning log - Only logs when environment.debug is true
   */
  warn(...args: unknown[]): void {
    if (environment.debug) {
      console.warn('[WARN]', ...args);
    }
  }

  /**
   * Error log - Always logs
   * (You can change this to respect environment.debug if desired.)
   */
  error(...args: unknown[]): void {
    console.error('[ERROR]', ...args);
  }

  /**
   * Table log - Only logs when environment.debug is true
   */
  table(data: unknown): void {
    if (environment.debug) {
      console.table(data);
    }
  }

  /**
   * Group log - Only logs when environment.debug is true
   */
  group(label: string): void {
    if (environment.debug) {
      console.group(label);
    }
  }

  /**
   * End grouped log
   */
  groupEnd(): void {
    if (environment.debug) {
      console.groupEnd();
    }
  }

  /**
   * Timer start
   */
  time(label: string): void {
    if (environment.debug) {
      console.time(label);
    }
  }

  /**
   * Timer end
   */
  timeEnd(label: string): void {
    if (environment.debug) {
      console.timeEnd(label);
    }
  }
}