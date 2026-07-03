import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchIcon } from 'lucide-angular';
import { FilterOption } from '../../Models/FilterOption';
import { Project } from '../../Models/project';
import { SortBar } from '../../shared/components/sort-bar/sort-bar';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { InputField } from '../../shared/components/input-field/input-field';
import { CreateProject } from './create-project/create-project';
import { ProjectIdentity } from './project-identity/project-identity';
import { ProjectService } from '../../core/projects/services/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, InputField, SortBar, ProjectCard, CreateProject],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
})

export class Projects {

  showCreateProject = false;
  readonly SearchIcon = SearchIcon;
  activeFilter: string = 'all';
  searchTerm: string = '';

  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }
  
  /** Load projects from backend */
  loadProjects() {
  this.projectService.getProjects().subscribe({
    next: (data) => {
      this.projects = data;
      console.log('Projects loaded:', this.projects); // ✅ log here
    },
    error: (err) => console.error('Failed to load projects', err),
  });
}

  // projects: Project[] = [
  //   {
  //     name: 'harbor-api',
  //     desc: 'Go backend service for Harbor portal',
  //     type: 'Microservice',
  //     source: 'org/harbor-api',
  //     branch: 'main',
  //     envs: 4,
  //     healthy: 4,
  //     unhealthy: 0,
  //     updated: '2h ago',
  //     by: 'Alex K.',
  //     deployments: 12
  //   },
  //   {
  //     name: 'harbor-frontend',
  //     desc: 'Angular frontend application',
  //     type: 'Infrastructure',
  //     source: 'org/harbor-frontend',
  //     branch: 'master',
  //     envs: 3,
  //     healthy: 2,
  //     unhealthy: 1,
  //     updated: '5h ago',
  //     by: 'Priya R.',
  //     deployments: 20
  //   },
  //   {
  //     name: 'auth-service',
  //     desc: 'Authentication and authorization microservice',
  //     type: 'Microservice',
  //     source: 'org/auth-service',
  //     branch: 'dev',
  //     envs: 2,
  //     healthy: 2,
  //     unhealthy: 0,
  //     updated: '1d ago',
  //     by: 'John D.',
  //     deployments: 8
  //   },
  //   {
  //     name: 'notification-worker',
  //     desc: 'Slack and email notification worker',
  //     type: 'Worker',
  //     source: 'org/notification-worker',
  //     branch: 'main',
  //     envs: 2,
  //     healthy: 2,
  //     unhealthy: 0,
  //     updated: '3h ago',
  //     by: 'Zara M.',
  //     deployments: 15
  //   },
  //   {
  //     name: 'payment-gateway',
  //     desc: 'Handles payment transactions and billing',
  //     type: 'Microservice',
  //     source: 'org/payment-gateway',
  //     branch: 'release',
  //     envs: 3,
  //     healthy: 3,
  //     unhealthy: 0,
  //     updated: '6h ago',
  //     by: 'Liam S.',
  //     deployments: 25
  //   },
  //   {
  //     name: 'analytics-service',
  //     desc: 'Data analytics and reporting engine',
  //     type: 'Infrastructure',
  //     source: 'org/analytics-service',
  //     branch: 'main',
  //     envs: 4,
  //     healthy: 3,
  //     unhealthy: 1,
  //     updated: '12h ago',
  //     by: 'Sophia T.',
  //     deployments: 18
  //   },
  //   {
  //     name: 'inventory-service',
  //     desc: 'Manages product inventory and stock levels',
  //     type: 'Microservice',
  //     source: 'org/inventory-service',
  //     branch: 'develop',
  //     envs: 2,
  //     healthy: 2,
  //     unhealthy: 0,
  //     updated: '2d ago',
  //     by: 'Ethan B.',
  //     deployments: 10
  //   },
  //   {
  //     name: 'user-profile',
  //     desc: 'User profile management and preferences',
  //     type: 'Frontend',
  //     source: 'org/user-profile',
  //     branch: 'main',
  //     envs: 3,
  //     healthy: 3,
  //     unhealthy: 0,
  //     updated: '8h ago',
  //     by: 'Olivia C.',
  //     deployments: 14
  //   },
  //   {
  //     name: 'search-service',
  //     desc: 'Full-text search and indexing engine',
  //     type: 'Microservice',
  //     source: 'org/search-service',
  //     branch: 'feature/search-v2',
  //     envs: 2,
  //     healthy: 1,
  //     unhealthy: 1,
  //     updated: '4h ago',
  //     by: 'Noah P.',
  //     deployments: 9
  //   },
  //   {
  //     name: 'logging-service',
  //     desc: 'Centralized logging and monitoring',
  //     type: 'Infrastructure',
  //     source: 'org/logging-service',
  //     branch: 'main',
  //     envs: 3,
  //     healthy: 3,
  //     unhealthy: 0,
  //     updated: '1h ago',
  //     by: 'Emma W.',
  //     deployments: 22
  //   },
  //   {
  //     name: 'recommendation-engine',
  //     desc: 'Provides personalized recommendations',
  //     type: 'Microservice',
  //     source: 'org/recommendation-engine',
  //     branch: 'experiment',
  //     envs: 2,
  //     healthy: 1,
  //     unhealthy: 1,
  //     updated: '3d ago',
  //     by: 'Mason H.',
  //     deployments: 7
  //   },
  //   {
  //     name: 'file-storage',
  //     desc: 'Handles file uploads and storage',
  //     type: 'Infrastructure',
  //     source: 'org/file-storage',
  //     branch: 'main',
  //     envs: 4,
  //     healthy: 4,
  //     unhealthy: 0,
  //     updated: '10h ago',
  //     by: 'Ava L.',
  //     deployments: 16
  //   }
  // ];


  /** Filtered list based on active filter and search term */
  get filteredProjects(): Project[] {
    let list = this.projects;

    if (this.activeFilter === 'active') {
      list = list.filter(p => p.unhealthy === 0);
    } else if (this.activeFilter === 'degraded') {
      list = list.filter(p => p.unhealthy > 0);
    } else if (this.activeFilter === 'archived') {
      list = [];
    }

    if (this.searchTerm) {
      list = list.filter(p =>
        p.project_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.project_description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return list;
  }

  /** Handle show create project as popup */
  openCreateProject() {
    this.showCreateProject = true;
  }

  /** Handle hide create project as popup */
  closeCreateProject() {
    this.showCreateProject = false;
  }

  /** Handle filter change from filter-bar */
  onFilterChange(value: string) {
    this.activeFilter = value;
  }

  /** Handle search change from filter-bar */
  onSearchChange(term: string) {
    this.searchTerm = term; // ✅ receives a string
  }

  /** Add a new project dynamically */
  // onAddProject() {
  //   const now = new Date();

  //   // Define possible types
  //   const types = ['Microservice', 'Infrastructure', 'Worker', 'Frontend', 'Backend'];

  //   // Pick a random type
  //   const randomType = types[Math.floor(Math.random() * types.length)];

  //   // Generate a dynamic name
  //   const projectId = this.projects.length + 1;
  //   const projectName = `project-${projectId}`;

  //   // Generate a dynamic description
  //   const descriptions = [
  //     'Handles authentication and user sessions',
  //     'Processes background jobs and notifications',
  //     'Provides REST API for client apps',
  //     'Manages database migrations and schema',
  //     'Frontend UI for customer portal'
  //   ];
  //   const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];

  //   this.projects.push({
  //     name: projectName,
  //     desc: randomDesc,
  //     type: randomType,
  //     envs: Math.floor(Math.random() * 5) + 1, // random 1–5 environments
  //     source: 'org/'+ projectName,
  //     branch: 'master',
  //     healthy: Math.floor(Math.random() * 3),  // random healthy count
  //     unhealthy: Math.floor(Math.random() * 2), // random unhealthy count
  //     updated: now.toLocaleString(),           // actual timestamp
  //     by: 'You',
  //     deployments: 0
  //   });
  // }


  /** Dynamic filter options with counts */
  get filterOptions(): FilterOption[] {
    return [
      { label: 'All', count: this.projects.length, value: 'all' },
      { label: 'Active', count: this.projects.filter(p => p.unhealthy === 0).length, value: 'active' },
      { label: 'Degraded', count: this.projects.filter(p => p.unhealthy > 0).length, value: 'degraded' },
      { label: 'Archived', count: 0, value: 'archived' }
    ];
  }
}
