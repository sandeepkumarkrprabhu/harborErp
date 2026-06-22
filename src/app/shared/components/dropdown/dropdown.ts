import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown.html',
  styleUrls: ['./dropdown.css']
})
export class Dropdown {
  /** Label shown above or beside the dropdown */
  @Input() label: string = '';

  /** Options for the dropdown */
  @Input() options: string[] = [];

  /** Current selected value */
  @Input() selected: string = '';

  /** Emit when selection changes */
  @Output() selectionChange = new EventEmitter<string>();

  onChange(value: string) {
    this.selectionChange.emit(value);
  }
}
