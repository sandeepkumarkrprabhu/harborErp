import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderGit2, Clock3, LucideAngularModule } from 'lucide-angular';

import { MetricTile } from '../../shared/components/metric-tile/metric-tile';
import { ActivityList } from '../../shared/components/activity-list/activity-list';
import { Project } from '../../Models/project';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { Deployment } from '../../Models/Deployment';
import { environment } from '../../../environments/environment.development';

import { ProjectService } from '../../core/projects/services/project.service';
import { CompositionService } from '../../core/composition/composition-service';
import { Observable, map, of } from 'rxjs';
import { DateUtils } from '../../shared/utility/date-utils';
import { DashboardKPICard, DashboardRecentActivities } from '../../Models/Composition';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricTile, ActivityList, ProjectCard, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  readonly FolderGit2 = FolderGit2;
  readonly Clock3 = Clock3;

  projects$!: Observable<Project[]>;
  kpiCardDetails$!: Observable<DashboardKPICard>;
  activities$: Observable<DashboardRecentActivities[]> = of([]);

  constructor(
    private projectService: ProjectService,
    private compositionService: CompositionService,
    private dateUtils: DateUtils,
  ) {}

  // Array for looping in template
  metricTiles: { title: string; value: number; details: any[] }[] = [];

  // activities = [
  //   { name: 'payment-service', status: 'deploying', by: 'Arjun' },
  //   { name: 'user-authentication', status: 'active', by: 'Maya' },
  //   { name: 'order-management', status: 'idle', by: 'Liam' },
  //   { name: 'inventory-tracking', status: 'deployed', by: 'Zara' },
  //   { name: 'notification-system', status: 'error', by: 'Ethan' },
  // ];

  ngOnInit(): void {
    // Fetch projects from the service
    this.projects$ = this.projectService.getLatestProjects().pipe(
      map((projects) =>
        projects.map((project) => ({
          ...project,
          updated_at: this.dateUtils.formatDate(project.updated_at),
        })),
      ),
    );

    console.log('Recent projects:', this.projects$);

    this.activities$ = this.compositionService.getDashboardRecentActivites();

    this.compositionService.getDashboardKPI().subscribe((dashboardKPI) => {
      this.metricTiles = [
        {
          title: 'Environments',
          value: dashboardKPI.total_environments,
          details: [
            {
              label: 'Healthy',
              value: dashboardKPI.healthy_environments,
              barColor: 'bg-green-600',
            },
            {
              label: 'Unhealthy',
              value: dashboardKPI.unhealthy_environments,
              barColor: 'bg-red-600',
            },
          ],
        },
        {
          title: 'Deployments',
          value: dashboardKPI.deployments_past_hour, // or past_24_hours depending on your design
          details: [
            { label: 'Past 24h', value: dashboardKPI.deployments_past_24_hours },
            { label: 'Past Hour', value: dashboardKPI.deployments_past_hour },
          ],
        },
        {
          title: 'Last 24 hours',
          value: dashboardKPI.deployments_past_24_hours,
          details: [],
        },
        {
          title: 'Deployment Frequency',
          value: parseFloat(Number(dashboardKPI.deployment_frequency_weekly_average).toFixed(2)),
          details: [],
        },
      ];
    });
  }

  // get projectsMostDeployments(): Project[] {
  //   return [...this.projects$].sort((a, b) => b.deployments - a.deployments).slice(0, 5);
  // }

  // get deploymentChartData(): { name: string; value: number }[] {
  //   return this.projectsMostDeployments.map((project: Project) => ({
  //     name: project.project_name,
  //     value: project.deployments,
  //   }));
  // }
}
