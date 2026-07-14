import { Component, Input, ChangeDetectorRef } from '@angular/core';
import type { ValidationErrors } from '../create-user/create-user';
import { User } from '../../../Models/User';
import { Project } from '../../../Models/project';
import { ProjectService } from '../../../core/projects/services/project.service';
import { RoleService } from '../../../core/role/role-service';
import { RegisterUserRequest } from '../../../core/auth/models/auth';
import { Role } from '../../../Models/role';

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
    private projectService: ProjectService,
    private roleService: RoleService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Fetch suggested projects from backend
    this.projectService.getProjects().subscribe(projects => {
      //console.log("DB Projects:", projects);
      this.suggestedProjects = projects;
      this.cdr.detectChanges();
    });

    this.roleService.getRoles().subscribe(roles => { 
      //console.log("DB Roles:", roles);
      this.roles = roles;
      this.cdr.detectChanges();
    })
  }

  updateField<K extends keyof User>(field: K, value: User[K]) {
    this.data[field] = value;
  }

  toggleProject(project: Project) {
    const idx = this.data.projects.findIndex(p => p.project_name === project.project_name);
    if (idx > -1) {
      // remove existing project
      this.data.projects = [
        ...this.data.projects.slice(0, idx),
        ...this.data.projects.slice(idx + 1)
      ];
    } else {
      // add project object (or just push `project` if backend already provides full details)
      this.data.projects = [...this.data.projects, project];
    }
  }

  parseCsv(value: string): Project[] {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
      .map(name => ({
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
        github_org:'',
        github_repo: '',
        total_environments: '0',
        environments: [{
          id: crypto.randomUUID(),
          environment_name: '',
          resources: [{
            id: crypto.randomUUID(),
            environment_id: '',
            aws_region: '',
            aws_service: '',
            aws_resource: ''
          }]
        }]
      }));
  }

  errorFor(field: keyof RegisterUserRequest): string {
    return this.showErrors ? this.errors[field] ?? '' : '';
  }


}
