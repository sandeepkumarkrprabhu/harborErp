import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { Repo } from '../../../Models/Repo';
import { AwsResource } from '../../../Models/AwsResource';

import { AwsService } from '../../../core/aws/services/awsService';
import { RepoService } from '../../../core/aws/services/repoService';

@Component({
  selector: 'app-source-config',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
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
  resources$!: Observable<AwsResource[]>;

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
      this.repos = repos || [];
      this.syncSelectedRepo();
    });

    this.fetchResources();
  }

  fetchResources() {
    const awsService = this.formGroup.get('awsService')?.value;
    const awsRegion = this.formGroup.get('awsRegion')?.value;

    if (!awsService || !awsRegion) {
      this.connectedResources = [];
      return;
    }

    const request$ = this.awsService.fetchResources(awsService, awsRegion);
    this.resources$ = request$;

    request$.subscribe({
      next: (resources) => {
        this.connectedResources = resources || [];
        this.syncSelectedAwsResource();
      },
      error: () => {
        this.connectedResources = [];
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

  private syncSelectedRepo(): void {
    const repoControl = this.formGroup.get('repo');
    const currentValue = repoControl?.value;

    if (!currentValue || !this.repos.length) {
      return;
    }

    const matchedRepo = this.repos.find(
      (repo) =>
        String(repo.id) === String(currentValue) ||
        repo.name === String(currentValue) ||
        repo.full_name === String(currentValue),
    );

    if (matchedRepo) {
      repoControl?.setValue(String(matchedRepo.id), { emitEvent: false });
    }
  }

  private syncSelectedAwsResource(): void {
    const resourceControl = this.formGroup.get('awsResource');
    const currentValue = resourceControl?.value;

    if (!currentValue || !this.connectedResources.length) {
      return;
    }

    const matchedResource = this.connectedResources.find(
      (resource) => String(resource.id) === String(currentValue),
    );

    if (matchedResource) {
      resourceControl?.setValue(String(matchedResource.id), { emitEvent: false });
      if (!this.selectedResources.some((resource) => resource.id === matchedResource.id)) {
        this.selectedResources = [
          ...this.selectedResources.filter(
            (resource) => resource.service !== matchedResource.service,
          ),
          matchedResource,
        ];
      }
    }
  }

  errorFor(controlName: string): string {
    const control = this.formGroup.get(controlName);
    if (!control || !this.showErrors) return '';
    if (control.hasError('required')) return `${controlName} is required.`;
    return '';
  }
}
