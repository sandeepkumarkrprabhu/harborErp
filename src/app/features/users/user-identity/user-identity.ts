import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../Models/User';
import { Role } from '../../../Models/role';
import { RoleService } from '../../../core/role/role-service';
import { AuthService } from '../../../core/auth/services/auth.service';

import { InputField } from '../../../shared/components/input-field/input-field';

@Component({
  selector: 'app-user-identity',
  standalone: true,
  imports: [InputField, ReactiveFormsModule],
  templateUrl: './user-identity.html',
  styleUrls: ['./user-identity.css'],
})
export class UserIdentity {
  @Input({ required: true }) data!: User;
  @Input() errors: any = {};
  @Input() showErrors = false;

  roles: Role[] = [];
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private githubService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // initialize form with user data
    this.userForm = this.fb.group({
      name: [this.data?.name || ''],
      email: [this.data?.email || ''],
      role_id: [this.data?.role_id || ''],
      github_username: [this.data?.github_username || ''],
    });

    // load roles async
    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles;

      // If role_id is not set but role_name is, find the matching role to bind it
      if (!this.data?.role_id && this.data?.role_name) {
        const matchedRole = this.roles.find(
          (r) => r.name.toLowerCase() === this.data.role_name.toLowerCase()
        );
        if (matchedRole) {
          this.data.role_id = matchedRole.id;
        }
      }

      // patch role_id once roles are loaded
      if (this.data?.role_id) {
        this.userForm.patchValue({ role_id: this.data.role_id });
      }

      // Auto-sync form changes back to data reference after initial load
      this.userForm.valueChanges.subscribe((val) => {
        Object.assign(this.data, val);
        const matchedRole = this.roles.find((r) => r.id === val.role_id);
        if (matchedRole) {
          this.data.role_name = matchedRole.name;
        } else {
          this.data.role_name = '';
        }
      });

      this.cdr.detectChanges();
    });
  }

  saveChanges() {
    Object.assign(this.data, this.userForm.value);
    const matchedRole = this.roles.find((r) => r.id === this.data.role_id);
    if (matchedRole) {
      this.data.role_name = matchedRole.name;
    }
  }

  errorFor(controlName: string): string {
    return this.errors?.[controlName] || '';
  }

  verifyGithubUser(userId: string, username: string) {
    if (!username) return;
    this.githubService.verifyGithubUser(userId, username).subscribe({
      next: (res) => {
        console.log('GitHub user verified:', res);
        this.data.github_username = username;
        this.data.github_verified = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error verifying GitHub user:', err);
        this.data.github_verified = false;
        this.cdr.detectChanges();
      }
    });
  }
}
