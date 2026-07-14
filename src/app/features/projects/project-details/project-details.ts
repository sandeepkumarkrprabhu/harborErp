import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Eye } from 'lucide-angular';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError, shareReplay, tap, finalize } from 'rxjs/operators';

import { Project } from '../../../Models/project';
import { TableConfig } from '../../../Models/Table';
import { ProjectDetail } from '../../../Models/Composition';

import { DataTable } from '../../../shared/components/data-table/data-table';
import { Badge } from "../../../shared/components/badge/badge";
import { CompositionService } from '../../../core/composition/composition-service';


@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, DataTable, Badge],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.css']
})

export class ProjectDetails implements OnInit {
  @Input() project?: Project;
  showCreateEnvironment = false;
  projectId!: string;
  loading = true; 
  
  // Expose observables
  project$!: Observable<ProjectDetail>;
  environments$!: Observable<any[]>;
  deployments$!: Observable<any[]>;

  constructor(private route: ActivatedRoute, private compositionService: CompositionService) {}

  ngOnInit() {
    if (history.state?.project) {
      this.project = history.state.project as Project;
      this.projectId = this.project.id;
    } else {
      this.projectId = this.route.snapshot.paramMap.get('projectId')!;
    }

    console.log("Fetching the project id for fetching project Detail:", this.projectId);

    // Fetch project as observable
    this.project$ = this.compositionService.getProjectById(this.projectId).pipe(
      tap(detail => console.log("Fetched ProjectDetail:", detail)),
      catchError(err => {
        console.error("Failed to fetch project details:", err);
        return EMPTY;
      }),
      finalize(() => this.loading = false),
      shareReplay(1)
    );

    // Derive environments and deployments from project$
    this.environments$ = this.project$.pipe(
      map(project => this.buildEnvironments(project))
    );

    this.deployments$ = this.project$.pipe(
      map(project => this.buildDeployments(project))
    );
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
      data: [], // bound via async pipe in template
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
      data: [], // bound via async pipe in template
      actions: [
        { label: 'View', icon: Eye, color: 'bg-white text-gray-600 border border-black/5 select-none', action: 'view' }
      ]
    };
  }

  private buildEnvironments(detail: ProjectDetail) {
    console.log("Environments from API:", detail.environments);
    return detail.environments.map((env, index) => ({
      slNo: index + 1,
      environmentName: env.environmentName,
      status: env.status,
      lastDeployment: env.lastDeployment,
      deployedBy: env.deployedBy,
      branch: env.branchName,
      compute: env.compute
    }));
  }


  private buildDeployments(detail: ProjectDetail) {
    console.log("Deployments from API:", detail.recentDeployments);
    if (!detail.recentDeployments) {
      return [];
    }

    return detail.recentDeployments.map((dep, index) => ({
      slNo: index + 1,
      environmentName: dep.environment, 
      status: dep.status,
      triggeredBy: dep.triggeredBy,
      duration: dep.duration,
      timestamp: dep.timestamp,               
      prCommit: dep.commitID
    }));
  }


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
