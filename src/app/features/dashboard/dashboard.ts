import { Component } from '@angular/core';

import { DashboardSummaryCard } from './dashboard-summary/dashboard-summary';
import { RecentProjects } from './recent-projects/recent-projects';
import { DashboardActivity } from './dashboard-activity/dashboard-activity';
import { DashboardChart } from './dashboard-chart/dashboard-chart';
import { DashboardSummaryModel } from './models/dashboard-card.model';

import { PageTitle } from '../shared/page-title/page-title';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardSummaryCard,
    RecentProjects,
    DashboardActivity,
    DashboardChart,
    PageTitle
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  cards: DashboardSummaryModel[] = [
    {
      title: 'Environments',
      value: 15,
      icon: 'pi pi-server',

      success: '12 Healthy',
      successColor: '#22C55E',

      failure: '3 Unhealthy',
      failureColor: '#e65100',

      successPercentage: 80,
      failurePercentage: 20,

      subtitle: 'Across all projects'
    },
    {
      title: 'Deployments',
      value: 2,
      icon: 'pi pi-cloud-upload',

      inProgress: 'In progress right now',
      inProgressColor: '#e65100',

      inProgressPercentage: 100,

      subtitle: 'Current deployments'
    },
    {
      title: 'Last 24 Hours',
      value: 11,
      icon: 'pi pi-clock',

      success: '10 Successful',
      successColor: '#22C55E',

      failure: '1 Failed',
      failureColor: '#EF4444',

      successPercentage: 91,
      failurePercentage: 9,

      subtitle: 'Recent activity'
    },
    {
      title: 'Deployment Frequency',
      value: 8,
      icon: 'pi pi-chart-line',

      success: 'Deploys today',
      successColor: '#22C55E',

      failure: '3% this week',
      failureColor: '#EF4444',

      successPercentage: 72,
      failurePercentage: 28,

      subtitle: 'Average deployment rate'
    }
  ];

}