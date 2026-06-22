import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableConfig } from '../../../Models/Table';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css']
})
export class DataTable {
  @Input() tables: TableConfig[] = [];   // ✅ single array of table configs

  @Output() actionClicked = new EventEmitter<{ action: string; row: any }>();

  onAction(action: string, row: any) {
    this.actionClicked.emit({ action, row });
  }

  getCellClasses(col: TableColumn, value: any): string {
    const classes = ['px-4', 'py-2', 'text-sm'];

    if (col.bold) classes.push('font-bold');
    if (col.italic) classes.push('italic');
    if (col.cursor) classes.push(`cursor-${col.cursor}`);
    if (col.colorClass) classes.push(col.colorClass);

    return classes.join(' ');
  }

}
