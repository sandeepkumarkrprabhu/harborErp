import { Component } from '@angular/core';
import { ProjectCard } from '../shared/project-card/project-card';
import { harborButton } from '../shared/button/button';
import { PageTitle } from '../shared/page-title/page-title';
import { Search } from '../shared/search/search';
import { Selection } from '../shared/selection/selection';

import { Project } from '../shared/Models/Project';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCard, harborButton, PageTitle, Search, Selection],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectList {

  selectedFilter = 'All';

  onNewProject(): void {
    console.log('+ New Project clicked');
  }

  projectRecords: Project[] = [
    {
      id: 1,
      name: 'harbor-api',
      description: 'Go backend service for Harbor portal',
      environment: 'Microservice',
      health: 100,
      healthy: 3,
      unhealthy: 0,
      lastDeployment: '1 day ago',
      owner: 'Sangeeta',
      sourceUrl: 'org/harbor-api'
    },
    {
      id: 2,
      name: 'harbor-frontend',
      description: 'Angular frontend application',
      environment: 'Microservice',
      health: 70,
      healthy: 2,
      unhealthy: 1,
      lastDeployment: '18 hours ago',
      owner: 'Priya',
      sourceUrl: 'org/harbor-frontend'
    },
    {
      id: 3,
      name: 'terraform-ngw-vpc',
      description: 'AWS VPC infrastructure via Terraform',
      environment: 'Infrastructure',
      health: 100,
      healthy: 2,
      unhealthy: 0,
      lastDeployment: '15 days ago',
      owner: 'Chris M',
      sourceUrl: 'org/terraform-ngw-vpc'
    },
    {
      id: 4,
      name: 'auth-service',
      description: 'OAuth & RBAC microservice',
      environment: 'Microservice',
      health: 100,
      healthy: 3,
      unhealthy: 0,
      lastDeployment: '3 days ago',
      owner: 'Alex K',
      sourceUrl: 'org/auth-service'
    },
    {
      id: 5,
      name: 'notification-worker',
      description: 'Slack & email notification worker',
      environment: 'Microservice',
      health: 50,
      healthy: 1,
      unhealthy: 1,
      lastDeployment: '5 days ago',
      owner: 'Chris N',
      sourceUrl: 'org/notification-worker'
    },
    {
      id: 6,
      name: 'data-pipeline',
      description: 'ETL pipeline for analytics reporting',
      environment: 'Microservice',
      health: 100,
      healthy: 3,
      unhealthy: 0,
      lastDeployment: '3 days ago',
      owner: 'Emma C',
      sourceUrl: 'org/data-pipeline'
    }
  ];

}