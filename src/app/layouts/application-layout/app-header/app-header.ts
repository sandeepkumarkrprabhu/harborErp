import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {

  // ✅ Page title
  @Input() pageTitle: string = '';

  // ✅ Sidebar state (used for UI logic if needed)
  @Input() isSidebarCollapsed: boolean = false;

  // ✅ Emit toggle event
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  // ✅ Search input
  searchText: string = '';

  // ✅ Toggle sidebar
  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  // ✅ Search handler
  onSearch(): void {
    console.log('Search:', this.searchText);
  }

  // ✅ Quick action handler
  onQuickAction(): void {
    console.log('Quick action clicked');
  }
}