import { Component, Input } from '@angular/core';
import { User } from '../../../Models/User';
import { Role } from '../../../Models/role';

import { RoleService } from '../../../core/role/role-service';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-review-create',
  standalone: true,
  templateUrl: './review-create.html',
  styleUrls: ['./review-create.css'],
})
export class ReviewCreate {
  @Input({ required: true }) data!: User;

  roles: Role[] = [];

  constructor(
    private readonly authService: AuthService,
    private roleService: RoleService,
  ) {}

  ngOnInit() {
    this.roleService.getRoles().subscribe((roles) => {
      //console.log("DB Roles:", roles);
      this.roles = roles;

      // update role_name based on role_id
      const matchedRole = roles.find((r: any) => r.id === this.data.role_id);
      if (matchedRole) {
        this.data.role_name = matchedRole.name;
      }
    });
  }

  submit(): void {
    const payload = {
      name: this.data.name,
      email: this.data.email,
      role_id: this.data.role_id,
      github_username: this.data.github_username,
      requires_github_access: !!this.data.github_verified, // true if verified
    };

    this.authService.createUser(payload).subscribe({
      next: (res) => {
        console.log('User created:', res);
        // optionally close wizard or navigate
        // this.onCloseWizard();
      },
      error: (err) => {
        console.error('Error creating user:', err);
      },
    });
  }
}
