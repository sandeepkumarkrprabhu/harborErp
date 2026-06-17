import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';
import { filter } from 'rxjs';

import { Sidebar } from './sidebar/sidebar';
import { AppHeader } from './app-header/app-header';

@Component({
  selector: 'app-application-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    AppHeader
  ],
  templateUrl: './application-layout.html',
  styleUrl: './application-layout.css'
})
export class ApplicationLayout {

  // ✅ Page title
  pageTitle = 'Dashboard';

  // ✅ Sidebar state (single source of truth)
  isSidebarCollapsed = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.listenToRouteChanges();
  }

  // ✅ Update title based on route data
  private listenToRouteChanges(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        let route = this.activatedRoute;

        while (route.firstChild) {
          route = route.firstChild;
        }

        this.pageTitle =
          route.snapshot.data['title'] ?? this.pageTitle;
      });
  }

  // ✅ Toggle sidebar (used by header + sidebar)
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}