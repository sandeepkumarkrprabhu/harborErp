import { Component, Input, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { SearchIcon, Plus, LucideAngularModule } from 'lucide-angular';
import { InputField } from '../../shared/components/input-field/input-field';
import { QuickActionsPanel } from '../../shared/components/quick-actions-panel/quick-actions-panel';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, QuickActionsPanel, InputField, Sidebar, LucideAngularModule],
  templateUrl: './main-layout.html',
})
export class MainLayout implements OnInit {
  showQuickActions = false;
  isSmallScreen = false;
  searchPlaceholder = 'Search projects, tasks, deployments, users....';

  readonly SearchIcon = SearchIcon;
  readonly Plus = Plus;

  @Input() pageTitle: string = 'Overview';

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 768; // md breakpoint is 768px in Tailwind
    this.searchPlaceholder = this.isSmallScreen
      ? 'Search'
      : 'Search projects, tasks, deployments, users....';
  }

  /** Handle display of quick Actions */
  toggleQuickActions() {
    this.showQuickActions = !this.showQuickActions;
  }
}
