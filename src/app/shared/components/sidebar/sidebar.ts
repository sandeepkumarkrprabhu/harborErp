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

import { TokenStorageService } from '../../../core/auth/services/token-storage';
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

  username: string | null = null;
  email: string | null = null;

  constructor(
    private tokenStorage: TokenStorageService,
    private readonly authService: AuthService,
    private readonly logger: Logger,
    private readonly router: Router
  ) { }

  readonly LogOut = LogOut;
  readonly Menu = Menu;

  isCollapsed = false;

  ngOnInit(): void {
    this.loadUserDetails();
  }

  private loadUserDetails(): void {
    this.username = this.tokenStorage.userName(); // unwrap signal
    this.email = this.tokenStorage.userEmail();   // unwrap signal
    this.logger.debug('Loaded user details:', { username: this.username, email: this.email });
  }



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