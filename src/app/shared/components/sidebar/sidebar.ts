import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
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
import { Logger } from '../../../features/utils/logger';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar implements OnInit, OnDestroy {
  username: string | null = null;
  email: string | null = null;

  constructor(
    private tokenStorage: TokenStorageService,
    private readonly authService: AuthService,
    private readonly logger: Logger,
    private readonly router: Router,
  ) {}

  readonly LogOut = LogOut;
  readonly Menu = Menu;

  isCollapsed = false;
  isSmallScreen = false;

  ngOnInit(): void {
    this.loadUserDetails();
    this.configureNavItems();
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 768; // md breakpoint is 768px in Tailwind
    if (this.isSmallScreen) {
      this.isCollapsed = true; // Collapse on small screens
    }
  }

  private loadUserDetails(): void {
    this.username = this.tokenStorage.userName(); // unwrap signal
    this.email = this.tokenStorage.userEmail(); // unwrap signal
    this.logger.debug('Loaded user details:', { username: this.username, email: this.email });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // Define all possible navigation items
  private readonly allNavItems = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', route: '/projects', icon: FolderKanban },
    { label: 'Teams', route: '/teams', icon: UsersRound },
    // { label: 'History', route: '/history', icon: History },
    { label: 'Users', route: '/users', icon: Users },
    { label: 'Settings', route: '/settings', icon: Settings },
    { label: 'Notifications', route: '/notifications', icon: Bell },
  ];

  // Role based allowed menu labels
  private readonly roleMenuMap: Record<string, string[]> = {
    admin: ['Dashboard', 'Projects', 'Teams', 'History', 'Users', 'Settings', 'Notifications'],
    manager: ['Dashboard', 'Projects', 'Teams'],
  };

  // Filtered navigation items based on current user role
  readonly navItems = [] as typeof this.allNavItems;

  private configureNavItems(): void {
    // Determine role (case‑insensitive). Fallback to empty array if unknown.
    const userRole = this.authService.currentUserValue?.roles?.[0] ?? 'Admin';
    const roleKey = userRole.toLowerCase();
    const allowedLabels = this.roleMenuMap[roleKey] || [];
    this.navItems.push(...this.allNavItems.filter((item) => allowedLabels.includes(item.label)));
  }

  async logout(): Promise<void> {
    this.logger.info('User logging out...');

    this.authService.logout();

    const success = await this.router.navigate(['/login']);
    this.logger.debug('Navigation success:', success);
  }
}
