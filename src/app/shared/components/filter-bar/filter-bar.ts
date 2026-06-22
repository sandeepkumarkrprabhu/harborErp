import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOption } from '../../../Models/FilterOption';
import { SearchIcon } from 'lucide-angular';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-bar.html',
  styleUrls: ['./filter-bar.css']
})
export class FilterBar {

  readonly SearchIcon = SearchIcon;
  
  @Input() options: FilterOption[] = [];
  @Output() searchChange = new EventEmitter<string>();

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchChange.emit(input.value); // ✅ emits a string
  }
}
