import { Component } from '@angular/core';
import { ProjectModel } from './models/ProjectModel';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {

  selectedFilter = 'All';

  projects: ProjectModel[] = [
    {
      id: 1,
      name: 'harbor-api',
      description: 'Go backend service for Harbor portal',
      environment: 'Microservice',
      health: 100,
      healthy: 3,
      unhealthy: 0,
      lastDeployment: '1 day ago',
      owner: 'Sangeeta'
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
      owner: 'Priya'
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
      owner: 'Chris M'
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
      owner: 'Alex K'
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
      owner: 'Chris N'
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
      owner: 'Emma C'
    }
  ];

}