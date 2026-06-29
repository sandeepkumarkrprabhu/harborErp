import { Component, Input } from '@angular/core';
import type { CreateUserData, ValidationErrors } from '../create-user/create-user';

@Component({
  selector: 'app-user-identity',
  standalone: true,
  templateUrl: './user-identity.html',
  styleUrls: ['./user-identity.css'],
})
export class UserIdentity {
  @Input({ required: true }) data!: CreateUserData;
  @Input() errors: ValidationErrors = {};
  @Input() showErrors = false;

  roles = [
    'Developer',
    'Frontend Engineer',
    'Backend Engineer',
    'DevOps',
    'QA Engineer',
    'UI/UX Designer',
    'Data Analyst',
    'Cloud Engineer'
  ];

  statuses = ['Active', 'Pending', 'Inactive'];

  suggestedProjects = [
    { name: 'harbor-api', type: 'Backend', bg: 'bg-[#e3f2fd]' },
    { name: 'harbor-frontend', type: 'Frontend', bg: 'bg-[#e8f5e9]' },
    { name: 'auth-service', type: 'Service', bg: 'bg-[#fff3e0]' },
    { name: 'notification-worker', type: 'Worker', bg: 'bg-[#ffebee]' },
    { name: 'payment-gateway', type: 'Payments', bg: 'bg-[#f3e5f5]' },
    { name: 'inventory-service', type: 'Inventory', bg: 'bg-[#e0f2f1]' }
  ];

  updateField<K extends keyof CreateUserData>(field: K, value: CreateUserData[K]) {
    this.data[field] = value;
  }

  toggleProject(projectName: string) {
    const idx = this.data.projects.indexOf(projectName);
    if (idx > -1) {
      this.data.projects.splice(idx, 1);
    } else {
      this.data.projects.push(projectName);
    }
  }

  parseCsv(value: string): string[] {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }

  errorFor(field: keyof CreateUserData): string {
    return this.showErrors ? this.errors[field] ?? '' : '';
  }
}
