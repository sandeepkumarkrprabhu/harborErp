import { Component, OnInit } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { ProjectDeploymentStat } from '../models/ProjectDeploymentStat';

@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [UIChart],
  templateUrl: './dashboard-chart.html',
  styleUrl: './dashboard-chart.css',
})
export class DashboardChart implements OnInit {

  chartData: any;
  chartOptions: any;

  deploymentStats: ProjectDeploymentStat[] = [
    {
      projectName: 'auth-micro...',
      deploymentCount: 12
    },
    {
      projectName: 'harbor-api',
      deploymentCount: 20
    },
    {
      projectName: 'harbor-auth',
      deploymentCount: 16
    },
    {
      projectName: 'harbor-front...',
      deploymentCount: 5
    },
    {
      projectName: 'gc-engine',
      deploymentCount: 14
    },
    {
      projectName: 'amplify-fe',
      deploymentCount: 9
    },
    {
      projectName: 'test-ui',
      deploymentCount: 18
    },
    {
      projectName: 'test-swagg...',
      deploymentCount: 7
    }
  ];

  ngOnInit(): void {

    this.loadChart();
  }

  private loadChart(): void {

    this.chartData = {
      labels: this.deploymentStats.map(
        project => project.projectName
      ),
      datasets: [
        {
          label: 'Deployments',
          data: this.deploymentStats.map(
            project => project.deploymentCount
          ),
          backgroundColor: '#D48A74',
          borderRadius: 4,
          borderSkipped: false,
          barThickness: 28
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      },

      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 10
            }
          },
          border: {
            display: false
          }
        },

        y: {
          beginAtZero: true,
          ticks: {
            display: false
          },
          grid: {
            color: '#F1F5F9'
          },
          border: {
            display: false
          }
        }
      }
    };
  }
}