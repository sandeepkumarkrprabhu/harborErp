import { Component } from '@angular/core';
import { RecentProject} from '../models/RecentProject';

@Component({
  selector: 'app-recent-projects',
  standalone: true,
  imports: [],
  templateUrl: './recent-projects.html',
  styleUrl: './recent-projects.css',
})
export class RecentProjects {
  
  projects: RecentProject[] = [
    {
      id: 1,
      name: 'harbor-api',
      description: 'Go backend service for Harbor portal',
      imageUrl: 'https://picsum.photos/80?random=1',
      color: '#16A34A',
      lastDeployment: 'Last deployed 2 hours ago by Alex K.',
      deployedOrgName: 'org/harbour-api'
    },
    {
      id: 2,
      name: 'harbor-frontend',
      description: 'Angular frontend application',
      imageUrl: 'https://picsum.photos/80?random=2',
      color: '#DC2626',
      lastDeployment: 'Last deployed 5 hours ago by Priya N.',
      deployedOrgName: 'org/harbour-frontend'
    },
    {
      id: 3,
      name: 'auth-service',
      description: 'OAuth2 & SSO microservice',
      imageUrl: 'https://picsum.photos/80?random=3',
      color: '#0891B2',
      lastDeployment: 'Last deployed 1 day ago by Kevin R.',
      deployedOrgName: 'org/auth-service'
    },
    {
      id: 4,
      name: 'notification-worker',
      description: 'Slack & Email notification worker',
      imageUrl: 'https://picsum.photos/80?random=4',
      color: '#10B981',
      lastDeployment: 'Last deployed 9 hours ago by Sameer P.',
      deployedOrgName: 'org/notification-worker'
    }
  ];
}