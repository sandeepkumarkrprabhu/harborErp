import { Component, Input } from '@angular/core';
import type { CreateProjectData, ValidationErrors } from '../create-project/create-project';
import { AwsResource } from '../../../Models/AwsResource';
import { AwsService } from '../../../core/aws/services/awsService';

type SourceConfigTextField =
  | 'organization'
  | 'repo'
  | 'branch'
  | 'runtime'
  | 'environment';

type SourceConfigSelectField = 'awsRegion' | 'awsService' | 'awsResource';

@Component({
  selector: 'app-source-config',
  standalone: true,
  templateUrl: './source-config.html',
  styleUrls: ['./source-config.css']
})
export class SourceConfig {
  @Input({ required: true }) data!: CreateProjectData;
  @Input() errors: ValidationErrors = {};
  @Input() showErrors = false;

  regions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' }
  ];

  services = [
    { value: 'EC2', label: 'EC2' },
    { value: 'RDS', label: 'RDS' },
    { value: 'S3', label: 'S3' },
    { value: 'ECR', label: 'ECR' }
  ];

  /** All resources fetched for the selected region+service */
  connectedResources: AwsResource[] = [];

  /** Only the resources the user has actually selected */
  selectedResources: AwsResource[] = [];

  loading = false;

  constructor(private awsService: AwsService) {}

  // ngOnInit() {
  //   if (this.data.awsRegion && this.data.awsService) {
  //     this.fetchResources();
  //   }
  // }

  fetchResources() {
    this.loading = true;
    this.awsService.fetchResources(this.data.awsService, this.data.awsRegion).subscribe({
      next: (res) => {
        // only set available resources for dropdown
        this.connectedResources = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch AWS resources', err);
        this.loading = false;
      }
    });
  }

  onInput(field: SourceConfigTextField, event: Event) {
    const input = event.target as HTMLInputElement;
    this.data[field] = input.value;
  }

  onSelect(field: SourceConfigSelectField, event: Event) {
    const select = event.target as HTMLSelectElement;
    this.data[field] = select.value as any;

    if (field === 'awsRegion' || field === 'awsService') {
      this.fetchResources();
    }

    if (field === 'awsResource') {
      const selected = this.connectedResources.find(r => r.id === this.data.awsResource);
      if (selected && !this.selectedResources.some(r => r.id === selected.id)) {
        this.selectedResources = [
          ...this.selectedResources.filter(r => r.service === this.data.awsService),
          selected
        ];
      }
    }
  }

  addService() {
    if (this.data.awsService && this.data.awsResource) {
      const selected = this.connectedResources.find(r => r.id === this.data.awsResource);
      if (selected && !this.selectedResources.some(r => r.id === selected.id)) {
        this.selectedResources = [
          ...this.selectedResources.filter(r => r.service === this.data.awsService),
          selected
        ];
      }
      this.data.awsResource = '';
    }
  }

  errorFor(field: keyof CreateProjectData): string {
    return this.showErrors ? this.errors[field] ?? '' : '';
  }
}
