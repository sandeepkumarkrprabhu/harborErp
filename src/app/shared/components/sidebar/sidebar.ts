import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, FolderKanban, UsersRound, History, Users, Settings, Bell, LogOut, Menu } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  readonly LogOut = LogOut;
  readonly Menu = Menu;

  // Sidebar toggle state
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  navItems = [
    { label: 'Dashboard',     route: '/dashboard',      icon: LayoutDashboard },
    { label: 'Projects', route: '/projects', icon: FolderKanban },
    { label: 'Teams',      route: '/teams',       icon: UsersRound },
    { label: 'History',       route: '/history',        icon: History         },
    { label: 'Users',         route: '/users',          icon: Users           },
    { label: 'Settings',      route: '/settings',       icon: Settings        },
    { label: 'Notifications', route: '/notifications',  icon: Bell            },
  ];
}
