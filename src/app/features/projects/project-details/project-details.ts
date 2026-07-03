import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Eye } from 'lucide-angular';

import { Project } from '../../../Models/project';
import { TableConfig } from '../../../Models/Table';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { Badge } from "../../../shared/components/badge/badge";

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [DataTable, Badge],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.css']
})
export class ProjectDetails implements OnInit {

  @Input() project?: Project;

  showCreateEnvironment = false;
  projectId!: string;

  environments: Array<{ slNo: number; environmentName: string; status: string }> = [];
  deployments: Array<{ slNo: number; environmentName: string; status: string; triggeredBy: string; duration: string; timestamp: string; prCommit: string; branch: string }> = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (history.state?.project) {
      this.project = history.state.project as Project;
      this.projectId = this.project.project_name;
    } else {
      this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    }

    if (this.project) {
      this.environments = this.buildEnvironments(this.project);
      this.deployments = this.buildDeployments(this.project);
    }
  }

  // Environment Table Config
  get environmentTableConfig(): TableConfig {
    return {
      columns: [
        { header: 'Environment', field: 'environmentName', badge: true, badgeColorMap: {
            'Production': 'text-[#d08873]',
            'Staging': 'text-gray-700',
            'QA': 'text-[#e65100]'
          }},
        { header: 'Status', field: 'status', badge: true, badgeColorMap: {
            'Healthy': 'bg-green-100 text-green-700',
            'Unhealthy': 'bg-red-100 text-red-700'
          }},
        { header: 'Last Deployment', field: 'lastDeployment' },
        { header: 'Deployed By', field: 'deployedBy', italic: true },
        { header: 'Branch', field: 'branch', badge: true, italic: true, colorClass: 'text-blue-700' },
        { header: 'Compute', field: 'compute', badge: true }
      ],
      data: this.environments,
      actions: [
        { label: 'View', icon: Eye, color: 'bg-white text-gray-600 border border-black/5 select-none', action: 'view' },
        { label: 'Deploy', icon: Eye, color: 'px-2 py-1 rounded text-xs font-medium transition cursor-pointer hover:scale-105 focus:ring-2 focus:ring-blue-500 bg-primary-100 text-white-700 border border-black/5 select-none', action: 'deploy' }
      ]
    };
  }


  // Deployment Table Config
  get deploymentTableConfig(): TableConfig {
    return {
      columns: [
        { header: '#', field: 'slNo' },
        { header: 'Environment', field: 'environmentName', badge: true },
        { header: 'Status', field: 'status', badge: true, badgeColorMap: {
            'Success': 'bg-green-100 text-green-700',
            'In Progress': 'bg-yellow-100 text-yellow-700 italic',
            'Failed': 'bg-red-100 text-red-700'
          }},
        { header: 'Triggered By', field: 'triggeredBy', italic: true },
        { header: 'Duration', field: 'duration' },
        { header: 'Timestamp', field: 'timestamp' },
        { header: 'PR/Commit', field: 'prCommit', badge: true },
        { header: 'Branch', field: 'branch', badge: true, italic: true, colorClass: 'text-blue-700' }
      ],
      data: this.deployments,
      actions: [
        { label: 'View', icon: Eye, color: 'bg-white text-gray-600 border border-black/5 select-none', action: 'view' }
      ]
    };
  }

  private buildEnvironments(project: Project): Array<{
    slNo: number;
    environmentName: string;
    status: string;
    lastDeployment: string;
    deployedBy: string;
    branch: string;
    compute: string;
  }> {
    const healthyEnvs = Math.min(project.healthy, project.envs);

    return Array.from({ length: project.envs }, (_, index) => ({
      slNo: index + 1,
      environmentName: index === 0 ? 'Production' : index === 1 ? 'Staging' : `Env ${index + 1}`,
      status: index < healthyEnvs ? 'Healthy' : 'Unhealthy',
      lastDeployment: index === 0 ? project.updated_at : `${index + 1}d ago`,
      deployedBy: index % 2 === 0 ? 'system' : 'developer',
      branch: index === 0 ? 'main' : 'feature/login',
      compute: index === 0 ? '4 vCPU / 8 GB RAM' : '2 vCPU / 4 GB RAM'
    }));
  }

  private buildDeployments(project: Project): Array<{ slNo: number; environmentName: string; status: string; triggeredBy: string; duration: string; timestamp: string; prCommit: string; branch: string }> {
    return Array.from({ length: Math.min(project.deployments, 5) }, (_, index) => ({
      slNo: index + 1,
      environmentName: `Env ${index + 1}`,
      status: index === 0 ? 'Success' : 'In Progress',
      triggeredBy: 'system',
      duration: `${index + 2}m`,
      timestamp: index === 0 ? project.updated_at : `${index + 1}d ago`,
      prCommit: `commit-${project.deployments - index}`,
      branch: 'main'
    }));
  }

  /** Show modal or form to add new environment */
  onAddNewEnvironment() {
    this.showCreateEnvironment = true;
    console.log("Opening environment creation form...");
  }

  handleEnvironmentAction(event: { action: string; row: any }) {
    if (event.action === 'view') {
      console.log("Selected Environment Row:", event.row);
    }
  }

  handleDeploymentAction(event: { action: string; row: any }) {
    if (event.action === 'view') {
      console.log("Selected Deployment Row:", event.row);
    }
  }
}
