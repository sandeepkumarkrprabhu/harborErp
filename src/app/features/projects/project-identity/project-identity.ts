import { Component, ChangeDetectorRef, Input } from '@angular/core';

import type { CreateProjectData, ValidationErrors } from '../../../Models/project';
import { User } from '../../../Models/User';

import { UserService } from '../../../core/users/services/userService';
import { UserHelper } from '../../../core/users/services/user-helper';

import { InputField } from '../../../shared/components/input-field/input-field';

@Component({
  selector: 'app-project-identity',
  standalone: true,
  imports: [InputField],
  templateUrl: './project-identity.html',
  styleUrls: ['./project-identity.css']
})
  
export class ProjectIdentity {
  @Input({ required: true }) data!: CreateProjectData;
  @Input() errors: ValidationErrors = {};
  @Input() showErrors = false;

  suggestedMembers: User[] = [];

  userHelper = UserHelper;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }
  
  ngOnInit() {
      this.loadUsers();
  }

  /** Load projects from backend */
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        // enrich each user with a bg property
        this.suggestedMembers = data.map((u, idx) => ({
          ...u,
          bg: this.getBgColor(idx)
        }));
        //console.log('Users loaded:', this.suggestedMembers);
        console.log("Projects suggested users loaded");
        this.cdr.detectChanges(); // Force UI refresh
      },
      error: (err) => console.error('Failed to load users', err),
    });
  }

  getBgColor(index: number): string {
    const shades = [
      'bg-primary',
      'bg-primary/80',
      'bg-primary/60',
      'bg-primary/40',
      'bg-primary/20',
      'bg-primary/70'
    ];
    return shades[index % shades.length];
  }
  updateField<K extends keyof CreateProjectData>(field: K, value: CreateProjectData[K]) {
    this.data[field] = value;
  }

  toggleMember(memberName: string) {
    const idx = this.data.members.indexOf(memberName);
    if (idx > -1) {
      // remove if already selected
      this.data.members.splice(idx, 1);
    } else {
      // add if not present
      this.data.members.push(memberName);
    }
  }

  parseCsv(value: string): string[] {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }

  errorFor(field: keyof CreateProjectData): string {
    return this.showErrors ? this.errors[field] ?? '' : '';
  }
}
