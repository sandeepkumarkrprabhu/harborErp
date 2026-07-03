import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetricTile } from '../../shared/components/metric-tile/metric-tile';
import { ActivityList } from '../../shared/components/activity-list/activity-list';
import { Project } from '../../Models/project';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { Deployment } from '../../Models/Deployment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricTile, ActivityList, ProjectCard],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  // Source of truth
  metrics = {
    environments: {
      total: 15,
      healthy: 14,
      unhealthy: 1,
      details: [
        { label: 'healthy', value: 14, textColor: 'text-green-600', barColor: 'bg-green-500' },
        { label: 'unhealthy', value: 1, textColor: 'text-red-600', barColor: 'bg-red-500' }
      ]
    },
    deployments: {
      inProgress: 2,
      details: [
        { label: 'in progress', value: 2, textColor: 'text-orange-600', barColor: 'bg-orange-500' }
      ]
    },
    last24h: {
      total: 11,
      succeeded: 10,
      failed: 1,
      details: [
        { label: 'succeeded', value: 10, textColor: 'text-green-600', barColor: 'bg-green-500' },
        { label: 'failed', value: 1, textColor: 'text-red-600', barColor: 'bg-red-500' }
      ]
    },
    frequency: {
      today: 8,
      week: 34,
      details: [
        { label: 'today', value: 8, textColor: 'text-blue-600', barColor: 'bg-blue-500' },
        { label: 'this week', value: 34, textColor: 'text-purple-600', barColor: 'bg-purple-500' }
      ]
    }
  };

  // Array for looping in template
  metricTiles: { title: string; value: number; details: any[] }[] = [];

  projects: Project[] = [
    { id: "1", project_name: 'harbor-api', status: 'active', project_description: 'Go backend service for Harbor portal', type: 'Microservice', source:'org/harbor-api', branch: 'main', envs: 4, healthy: 4, unhealthy: 0, updated_at: '2h ago', by: 'Alex K.', deployments: 12 },
    { id: "2", project_name: 'harbor-frontend',  status: 'active', project_description: 'Angular frontend application', type: 'Infrastructure', envs: 3, source:'org/harbor-frontend', branch: 'main', healthy: 2, unhealthy: 1, updated_at: '5h ago', by: 'Priya R.', deployments: 20 },
    { id: "3", project_name: 'auth-service', status: 'active', project_description: 'OAuth2 & RBAC microservice', type: 'Microservice', envs: 3, source:'org/auth-service', branch: 'master', healthy: 3, unhealthy: 0, updated_at: '1d ago', by: 'Sam T.', deployments: 8 },
    { id: "4", project_name: 'notification-worker', status: 'active', project_description: 'Slack & email notification worker', type: 'Infrastructure', envs: 4, source:'org/notification-worker', branch: 'prod', healthy: 4, unhealthy: 0, updated_at: '2d ago', by: 'Zara M.', deployments: 15 },
  ];

  activities = [
    { name: 'payment-service', status: 'deploying', by: 'Arjun' },
    { name: 'user-authentication', status: 'active', by: 'Maya' },
    { name: 'order-management', status: 'idle', by: 'Liam' },
    { name: 'inventory-tracking', status: 'deployed', by: 'Zara' },
    { name: 'notification-system', status: 'error', by: 'Ethan' }
  ];

  ngOnInit(): void {
    this.metricTiles = [
      { title: 'Environments', value: this.metrics.environments.total, details: this.metrics.environments.details },
      { title: 'Deployments', value: this.metrics.deployments.inProgress, details: this.metrics.deployments.details },
      { title: 'Last 24 hours', value: this.metrics.last24h.total, details: this.metrics.last24h.details },
      { title: 'Deployment Frequency', value: this.metrics.frequency.today, details: this.metrics.frequency.details }
    ];
  }

  get projectsMostDeployments(): Project[] {
    return [...this.projects].sort((a, b) => b.deployments - a.deployments).slice(0, 5);
  }

  get deploymentChartData(): { name: string; value: number }[] {
    return this.projectsMostDeployments.map((project: Project) => ({
      name: project.project_name,
      value: project.deployments
    }));
  }
}