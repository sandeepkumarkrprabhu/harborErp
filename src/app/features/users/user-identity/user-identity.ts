import { Component, Input, ChangeDetectorRef } from '@angular/core';
import type { ValidationErrors } from '../create-user/create-user';

import { User } from '../../../Models/User';
import { Project } from '../../../Models/project';
import { RegisterUserRequest } from '../../../core/auth/models/auth';
import { Role } from '../../../Models/role';

import { AuthService } from '../../../core/auth/services/auth.service';
//import { ProjectService } from '../../../core/projects/services/project.service';
import { RoleService } from '../../../core/role/role-service';

@Component({
  selector: 'app-user-identity',
  standalone: true,
  templateUrl: './user-identity.html',
  styleUrls: ['./user-identity.css'],
})
export class UserIdentity {
  @Input({ required: true }) data!: User;
  @Input() errors: ValidationErrors = {};
  @Input() showErrors = false;

  statuses = ['Active', 'Pending', 'Inactive'];

  suggestedProjects: Project[] = [];
  roles: Role[] = [];

  constructor(
    //private projectService: ProjectService,
    private roleService: RoleService,
    private githubService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.roleService.getRoles().subscribe((roles) => {
      //console.log("DB Roles:", roles);
      this.roles = roles;
      this.cdr.detectChanges();
    });

    console.log('User Detail:', this.data);
  }

  updateField<K extends keyof User>(field: K, value: User[K]) {
    this.data[field] = value;
  }

  toggleProject(project: Project) {
    const idx = this.data.projects.findIndex((p) => p.project_name === project.project_name);
    if (idx > -1) {
      // remove existing project
      this.data.projects = [
        ...this.data.projects.slice(0, idx),
        ...this.data.projects.slice(idx + 1),
      ];
    } else {
      // add project object (or just push `project` if backend already provides full details)
      this.data.projects = [...this.data.projects, project];
    }
  }

  parseCsv(value: string): Project[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((name) => ({
        id: '',
        project_name: name,
        type: '',
        project_description: '',
        branch: '',
        by: '',
        updated_at: '',
        deployments: 0,
        envs: 0,
        healthy: 0,
        source: '',
        status: 'Active',
        unhealthy: 0,
        bg: '',
        github_org: '',
        github_repo: '',
        total_environments: '0',
        environments: [
          {
            id: crypto.randomUUID(),
            environment_name: '',
            resources: [
              {
                id: crypto.randomUUID(),
                environment_id: '',
                aws_region: '',
                aws_service: '',
                aws_resource: '',
              },
            ],
          },
        ],
      }));
  }

  errorFor(field: keyof RegisterUserRequest): string {
    return this.showErrors ? (this.errors[field] ?? '') : '';
  }

  verifyGithubUser(id: string, username: string) {
    console.log(
      'Github verify username :',
      this.data.github_username,
      ' for user id :',
      this.data.id,
    );
    // Call backend API to verify GitHub user
    this.githubService.verifyGithubUser(id, username).subscribe({
      next: (res) => {
        if (res.verified) {
          this.updateField('github_verified', true);
        } else {
          this.updateField('github_verified', false);
        }
      },
      error: () => {
        this.updateField('github_verified', false);
      },
    });
  }
}
