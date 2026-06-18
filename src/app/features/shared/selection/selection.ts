import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selection',
  imports: [CommonModule],
  templateUrl: './selection.html',
  styleUrl: './selection.css',
})
export class Selection {
  @Input() options: string[] = [];
  @Input() selected = '';
  @Output() selectedChange = new EventEmitter<string>();

  onSelect(option: string): void {
    this.selected = option;
    this.selectedChange.emit(option);
  }
}
