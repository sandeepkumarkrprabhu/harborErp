import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CompositionService } from '../../../core/composition/composition-service';
import { ProjectDetailEnvironment } from '../../../Models/Composition';
import { TableConfig } from '../../../Models/Table';
import { DataTable } from '../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-environment-detail',
  standalone: true,
  imports: [CommonModule, DataTable],
  templateUrl: './environment-detail.html',
})
export class EnvironmentDetail implements OnInit {
  projectId = input<string>();
  envId = input<string>();

  projectDetail!: ProjectDetailEnvironment;

  constructor(
    private compositionService: CompositionService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Read directly from route params
    const projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    const envId = this.route.snapshot.paramMap.get('environmentName') ?? '';

    this.compositionService.getProjectByIdEnv(projectId, envId).subscribe({
      next: (data) => {
        this.projectDetail = data;
        console.log('Fetched ProjectDetailEnvironment:', this.projectDetail);
      },
      error: (err) => {
        console.error('Failed to load project environment details', err);
      },
    });
  }

  get deploymentTableConfig(): TableConfig {
    return {
      columns: [
        { header: 'Timestamp', field: 'timestamp', bold: true },
        { header: 'Deployer', field: 'deployer' },
        { header: 'PR Title', field: 'prTitle', badge: true },
        { header: 'Duration', field: 'duration' },
        {
          header: 'Outcome',
          field: 'outcome',
          badge: true,
          badgeColorMap: {
            success: 'bg-green-100 text-green-700',
            failure: 'bg-red-100 text-red-700',
            cancelled: 'bg-yellow-100 text-yellow-700',
          },
        },
      ],
      data: (this.projectDetail?.deploymentHistory ?? []).map((deployment) => ({
        ...deployment,
      })),
      actions: [],
    };
  }
}
