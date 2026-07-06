import { Component, Input } from '@angular/core';
import type { ValidationErrors } from '../create-user/create-user';
import { User } from '../../../Models/User';
import { Project } from '../../../Models/project';
import { ProjectService } from '../../../core/projects/services/project.service';

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

  roles = [
    'Developer', 'Frontend Engineer', 'Backend Engineer', 'DevOps',
    'QA Engineer', 'UI/UX Designer', 'Data Analyst', 'Cloud Engineer'
  ];
  statuses = ['Active', 'Pending', 'Inactive'];

  suggestedProjects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    // Fetch suggested projects from backend
    this.projectService.getProjects().subscribe(projects => {
      this.suggestedProjects = projects;
    });
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
        bg:''
      }));
  }


  errorFor(field: keyof User): string {
    return this.showErrors ? this.errors[field] ?? '' : '';
  }
}
