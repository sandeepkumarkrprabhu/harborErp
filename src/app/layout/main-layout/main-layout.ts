import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { SearchIcon } from 'lucide-angular';
import { InputField } from '../../shared/components/input-field/input-field';
import { QuickActionsPanel } from '../../shared/components/quick-actions-panel/quick-actions-panel';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, QuickActionsPanel, InputField, Sidebar],
  templateUrl: './main-layout.html'
})
export class MainLayout {

  showQuickActions = false;

  readonly SearchIcon = SearchIcon;

  @Input() pageTitle: string = 'Overview';

  /** Handle display of quick Actions */
  toggleQuickActions() {
    this.showQuickActions = !this.showQuickActions;
  }
  
}