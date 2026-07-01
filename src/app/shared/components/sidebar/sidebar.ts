import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  FolderKanban,
  UsersRound,
  History,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
} from 'lucide-angular';

import { AuthService } from '../../../core/auth/services/auth.service';
import { Logger } from '../../../features/utils/logger';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
    private readonly router: Router
  ) {}

  readonly LogOut = LogOut;
  readonly Menu = Menu;

  isCollapsed = false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  readonly navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', route: '/projects', icon: FolderKanban },
    { label: 'Teams', route: '/teams', icon: UsersRound },
    { label: 'History', route: '/history', icon: History },
    { label: 'Users', route: '/users', icon: Users },
    { label: 'Settings', route: '/settings', icon: Settings },
    { label: 'Notifications', route: '/notifications', icon: Bell },
  ];

  async logout(): Promise<void> {
    this.logger.info('User logging out...');

    this.authService.logout();

    const success = await this.router.navigate(['/login']);
    this.logger.debug('Navigation success:', success);
  }
}