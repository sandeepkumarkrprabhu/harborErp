import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TableAction, TableColumn } from '../Models/Table';

export type { TableAction, TableColumn } from '../Models/Table';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table<T = any> {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() actions: TableAction<T>[] = [];
  @Input() emptyMessage = 'No records found.';

  @Output() rowClick = new EventEmitter<T>();

  trackByIndex(index: number): number {
    return index;
  }

  getCellValue(item: T, column: TableColumn<T>): string {
    if (column.cell) {
      const value = column.cell(item);
      return value == null ? '' : String(value);
    }

    if (!column.key) {
      return '';
    }

    const value = item[column.key];
    return value == null ? '' : String(value);
  }

  getHeadingClasses(column: TableColumn<T>): string[] {
    return [
      'px-4 py-3 text-left text-sm font-semibold text-slate-600',
      column.headingClass || ''
    ];
  }

  getCellClasses(column: TableColumn<T>): string[] {
    return [
      'px-4 py-4 text-sm text-slate-600',
      column.cellClass || ''
    ];
  }

  getAvatarLetter(item: T, column: TableColumn<T>): string {
    const value = this.getCellValue(item, column);
    return value.trim().charAt(0).toUpperCase();
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'success':
        return 'status-badge-success';
      case 'failed':
        return 'status-badge-failed';
      case 'running':
        return 'status-badge-running';
      case 'pending':
        return 'status-badge-pending';
      default:
        return 'status-badge-neutral';
    }
  }
}
