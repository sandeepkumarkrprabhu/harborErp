// quick-actions-panel.component.ts
import { Component, Input, OnInit, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import {
  LucideAngularModule,
  FolderKanban,
  Users,
  Shield,
  Bell,
  History,
  ArrowRight,
} from 'lucide-angular';

import { TokenStorageService } from '../../../core/auth/services/token-storage';

@Component({
  selector: 'app-quick-actions-panel',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './quick-actions-panel.html',
})
export class QuickActionsPanel implements OnInit {
  @Input() isOpen = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  constructor(
    private tokenStorage: TokenStorageService
  ) {
    effect(() => {
      this.configureActions();
    });
  }

  private readonly allActions = [
    { label: 'New Project', desc: 'Spin up a new microservice', icon: FolderKanban, route: '/projects' },
    { label: 'Add Member', desc: 'Invite new team members to Harbor', icon: Users, route: '/members' },
    { label: 'Create Team', desc: 'Configure resource access groups', icon: Shield, route: '/teams' },
    { label: 'System Alerts', desc: 'Inspect cluster warnings & notices', icon: Bell, route: '/alerts' },
    { label: 'Deploy Logs', desc: 'Review complete build history', icon: History, route: '/deploy/logs' },
  ];

  actions = [] as typeof this.allActions;
  arrowIcon = ArrowRight;

  ngOnInit() {
  }

  private configureActions() {
    const userRole = this.tokenStorage.userRole() ?? 'user';
    const roleKey = userRole.toLowerCase();

    // Admin users see all actions, otherwise project-related actions
    const allowedLabels = roleKey === 'admin'
      ? this.allActions.map(item => item.label)
      : ['New Project', 'Add Member', 'Create Team'];

    this.actions = this.allActions.filter((item) => allowedLabels.includes(item.label));
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.isOpen = false; // close panel after navigation
  }
}

