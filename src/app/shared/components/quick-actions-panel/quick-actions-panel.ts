// quick-actions-panel.component.ts
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  FolderKanban,
  Users,
  Shield,
  Bell,
  History,
  ArrowRight,
} from 'lucide-angular';

@Component({
  selector: 'app-quick-actions-panel',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './quick-actions-panel.html',
})
export class QuickActionsPanel {
  @Input() isOpen = false;

  constructor(private router: Router) {}

  actions = [
    { label: 'New Project', desc: 'Spin up a new microservice', icon: FolderKanban, route: '/projects' },
    { label: 'Add Member', desc: 'Invite new team members to Harbor', icon: Users, route: '/members' },
    { label: 'Create Team', desc: 'Configure resource access groups', icon: Shield, route: '/teams' },
    { label: 'System Alerts', desc: 'Inspect cluster warnings & notices', icon: Bell, route: '/alerts' },
    { label: 'Deploy Logs', desc: 'Review complete build history', icon: History, route: '/deploy/logs' },
  ];

  arrowIcon = ArrowRight;

  navigate(route: string) {
    this.router.navigate([route]);
    this.isOpen = false; // close panel after navigation
  }
}
