import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Repo } from '../../../Models/Repo';

import { AwsResource } from '../../../Models/AwsResource';
import { AwsService } from '../../../core/aws/services/awsService';
import { RepoService } from '../../../core/aws/services/repoService';

@Component({
  selector: 'app-source-config',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './source-config.html',
  styleUrls: ['./source-config.css'],
})
export class SourceConfig implements OnInit {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() showErrors = false;

  regions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
  ];

  services = [
    { value: 'EC2', label: 'EC2' },
    { value: 'RDS', label: 'RDS' },
    { value: 'S3', label: 'S3' },
    { value: 'ECR', label: 'ECR' },
  ];

  connectedResources: AwsResource[] = [];
  selectedResources: AwsResource[] = [];
  repos: Repo[] = [];

  loading = false;

  constructor(
    private repoService: RepoService,
    private awsService: AwsService,
  ) {}

  ngOnInit() {
    // Subscribe to awsRegion and awsService changes to auto-fetch resources
    this.formGroup.get('awsRegion')?.valueChanges.subscribe(() => this.fetchResources());
    this.formGroup.get('awsService')?.valueChanges.subscribe(() => this.fetchResources());

    // Subscribe to awsResource changes to handle selection
    this.formGroup.get('awsResource')?.valueChanges.subscribe((resourceId) => {
      if (resourceId) {
        this.onSelectAwsResource(resourceId);
      }
    });

    this.repoService.fetchRepos().subscribe((repos) => {
      console.log('GitHub Repos:', repos);
      this.repos = repos;
    });
  }

  fetchResources() {
    const awsService = this.formGroup.get('awsService')?.value;
    const awsRegion = this.formGroup.get('awsRegion')?.value;

    if (!awsService || !awsRegion) return;

    this.loading = true;
    this.awsService.fetchResources(awsService, awsRegion).subscribe({
      next: (res) => {
        this.connectedResources = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch AWS resources', err);
        this.loading = false;
      },
    });
  }

  onSelectAwsResource(resourceId: string) {
    this.formGroup.get('awsResource')?.setValue(resourceId);

    const awsService = this.formGroup.get('awsService')?.value;
    const selected = this.connectedResources.find((r) => r.id === resourceId);

    if (selected && !this.selectedResources.some((r) => r.id === selected.id)) {
      this.selectedResources = [
        ...this.selectedResources.filter((r) => r.service === awsService),
        selected,
      ];
    }
  }

  addService() {
    const awsService = this.formGroup.get('awsService')?.value;
    const awsResource = this.formGroup.get('awsResource')?.value;

    if (awsService && awsResource) {
      const selected = this.connectedResources.find((r) => r.id === awsResource);
      if (selected && !this.selectedResources.some((r) => r.id === selected.id)) {
        this.selectedResources = [
          ...this.selectedResources.filter((r) => r.service === awsService),
          selected,
        ];
      }
      this.formGroup.get('awsResource')?.setValue('');
    }
  }

  errorFor(controlName: string): string {
    const control = this.formGroup.get(controlName);
    if (!control || !this.showErrors) return '';
    if (control.hasError('required')) return `${controlName} is required.`;
    return '';
  }
}
