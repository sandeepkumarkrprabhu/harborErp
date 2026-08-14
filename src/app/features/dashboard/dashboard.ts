import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderGit2, Clock3, LucideAngularModule } from 'lucide-angular';

import { MetricTile } from '../../shared/components/metric-tile/metric-tile';
import { ActivityList } from '../../shared/components/activity-list/activity-list';
import { Project } from '../../Models/project';
import { ProjectCard } from '../../shared/components/project-card/project-card';

import { ProjectService } from '../../core/projects/services/project.service';
import { CompositionService } from '../../core/composition/composition-service';
import { Observable, map, of } from 'rxjs';
import { DateUtils } from '../../shared/utility/date-utils';
import {
  DashboardKPICard,
  DashboardRecentActivities,
  ProjectDeploymentsGraph,
} from '../../Models/Composition';

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
  projectDeploymentsGraph$!: Observable<ProjectDeploymentsGraph[]>;
  deploymentChartData: { name: string; value: number }[] = [];
  maxDeploymentValue: number = 0;

  constructor(
    private projectService: ProjectService,
    private compositionService: CompositionService,
    private dateUtils: DateUtils,
  ) {}

  // Array for looping in template
  metricTiles: { title: string; value: number; details: any[] }[] = [];

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

    //console.log('Recent projects:', this.projects$);

    this.activities$ = this.compositionService.getDashboardRecentActivites();

    // Fetch deployments graph data
    this.projectDeploymentsGraph$ = this.compositionService.getDashboardProjectDeploymentsGraph();
    this.projectDeploymentsGraph$.subscribe((data) => {
      //console.log('Raw deploymentsGraph data:', data);
      this.transformDeploymentGraphData(data);
    });

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
          details: [{ label: 'deployments', value: 'across all repos' }],
        },
        {
          title: 'Deployment Frequency',
          value: parseFloat(Number(dashboardKPI.deployment_frequency_weekly_average).toFixed(2)),
          details: [{ label: 'weekly average', value: 'weekly average' }],
        },
      ];
    });
  }

  // dashboard.ts
  get yTicks(): number[] {
    const steps = 5; // number of ticks
    return Array.from({ length: steps }, (_, i) =>
      Math.round((i * this.maxDeploymentValue) / (steps - 1)),
    );
  }

  /**
   * Transform the project deployments graph data into chart-friendly format
   * Sums all deployment counts per project
   */
  private transformDeploymentGraphData(data: ProjectDeploymentsGraph[]): void {
    this.deploymentChartData = data.map((project) => ({
      name: project.project_name,
      value: Object.values(project.data).reduce((sum, val) => sum + val, 0),
    }));

    // Calculate max value for chart scaling
    this.maxDeploymentValue = Math.max(...this.deploymentChartData.map((d) => d.value), 1) + 10;

    // console.log('=== Deployment Graph Data ===');
    // console.log('Raw data:', data);
    // console.log('Transformed data:', this.deploymentChartData);
    // console.log('Max deployment value:', this.maxDeploymentValue);
    // console.log('Y-Axis ticks:', this.yTicks);
    // console.log('============================');
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
