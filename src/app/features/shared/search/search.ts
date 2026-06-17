import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  @Input() placeholder = '';
  @Output() clicked = new EventEmitter<MouseEvent>();
  
  searchText: string = '';
  
  onSearch(): void {
    console.log('Search:', this.searchText);
  }
}
