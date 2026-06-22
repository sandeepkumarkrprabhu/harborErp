import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOption } from '../../../Models/FilterOption'; 

@Component({
  selector: 'app-sort-bar',
  standalone: true,              
  imports: [CommonModule],       
  templateUrl: './sort-bar.html',
  styleUrls: ['./sort-bar.css'], 
})
export class SortBar {
  @Input() options: FilterOption[] = [];
  @Input() active: string = '';               
  @Output() filterChange = new EventEmitter<string>();

  onFilterSelect(value: string) {
    this.filterChange.emit(value);
  }
}
