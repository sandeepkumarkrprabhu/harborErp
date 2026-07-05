import { Component, Input } from '@angular/core';
import type { CreateProjectData, ValidationErrors } from '../create-project/create-project';
import { AwsResource } from '../../../Models/AwsResource';
import { AwsService } from '../../../core/aws/services/awsService';

type SourceConfigTextField =
  | 'organization'
  | 'repo'
  | 'branch'
  | 'runtime'
  | 'environment'
  | 'awsResource';

type SourceConfigSelectField = 'awsRegion' | 'awsService';

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

  connectedResources: AwsResource[] = [];
  loading = false;

  constructor(private awsService: AwsService) {}

  ngOnInit() {
    this.fetchResources();
  }

  fetchResources() {
    this.loading = true;
    this.awsService.fetchResources().subscribe({
      next: (res) => {
        this.connectedResources = res;
        this.data.awsServiceList = res.map(r => r.type);
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
    this.data[field] = select.value;
    // optional: re-fetch resources when region/service changes
    if (field === 'awsRegion' || field === 'awsService') {
      this.fetchResources();
    }
  }

  addService() {
    if (this.data.awsService && this.data.awsResource) {
      const newId = (this.connectedResources.length + 1).toString();
      this.connectedResources = [
        ...this.connectedResources,
        {
          id: newId,
          name: '',
          service: '',
          region:'',
          type: this.data.awsService,
          owner: 'newOwner',
          handle: '@newOwner',
          bg: 'bg-primary'
        }
      ];
      if (!this.data.awsServiceList.includes(this.data.awsService)) {
        this.data.awsServiceList = [...this.data.awsServiceList, this.data.awsService];
      }
      this.data.awsResource = '';
    }
  }

  errorFor(field: keyof CreateProjectData): string {
    return this.showErrors ? this.errors[field] ?? '' : '';
  }
}
