import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { LucideAngularModule } from 'lucide-angular';
import { UserAvatar } from '../user-avatar/user-avatar';

import {
  LayoutDashboard,
  FolderKanban,
  History,
  Users,
  Settings,
  Bell,
  Menu,
  LogOut
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule,
    NgClass,
    NgFor,
    NgIf,
    UserAvatar
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})

export class Sidebar {
  // Controlled from parent layout
  @Input() isCollapsed = false;

  // Optional: allow sidebar toggle from inside
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router) {}

  // Menu configuration
  menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/app/dashboard',
      color: '#6b7280',
      activeBg: "#D88E7B"
    },
    {
      label: 'Projects',
      icon: FolderKanban,
      route: '/app/projects',
      color: '#6b7280',
      activeBg: "#D88E7B"
    },
    {
      label: 'History',
      icon: History,
      route: '/app/history',
      color: '#6b7280',
      activeBg: "#D88E7B"
    },
    {
      label: 'Users',
      icon: Users,
      route: '/app/users',
      color: '#6b7280',
      activeBg: ""
    },
    {
      label: 'Settings',
      icon: Settings,
      route: '/app/settings',
      color: '#6b7280',
      activeBg: "#D88E7B"
    }
  ];

  notificationsItem = {
    label: 'Notifications',
    icon: Bell,
    route: '/notifications',
    color: '#6b7280',
    activeBg: 'bg-rose-600'
  };

  // example notifications count (replace with real service integration)
  notificationsCount = 3;

  Menu = Menu;
  

  // Toggle sidebar (if button inside sidebar)
  onToggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggleSidebar.emit();
  }

  isSelectedRoute(route: string): boolean {
    try {
      return this.router.isActive(route, true);
    } catch {
      return false;
    }
  }

  // Logout handler (extend with auth service later)
  logout(): void {
    console.log('Logging out...');
    this.router.navigate(['/login']);
  }

  // ✅ Helper to check active route (optional custom logic)
  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  // ✅ trackBy helper for ngFor
  trackByRoute(index: number, item: any): string | number {
    return item?.route ?? index;
  }

  // ✅ User menu state for profile dropdown
  isUserMenuOpen = false;
  // when true, open the menu upward
  isUserMenuUp = false;

  // ✅ Toggle user menu; computes whether to open above/below based on button position
  toggleUserMenu(event?: Event): void {
    if (event && event.currentTarget) {
      const btn = event.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // estimate dropdown height ~160px; open up if not enough space below
      this.isUserMenuUp = spaceBelow < 160;
    }
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}