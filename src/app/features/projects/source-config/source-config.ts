import { Component, Input } from '@angular/core';
import type { CreateProjectData, ValidationErrors } from '../create-project/create-project';
import { AwsResource } from './model/AwsResource';

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

  connectedResources: AwsResource[] = [
    { id: '1', type: 'EC2', owner: 'liamCloud', handle: '@liamCloud', bg: 'bg-[#e3f2fd]' },
    { id: '2', type: 'RDS', owner: 'liamCloud', handle: '@liamCloud', bg: 'bg-[#e8f5e9]' },
    { id: '3', type: 'S3', owner: 'noraSky', handle: '@noraSky', bg: 'bg-[#fff3e0]' },
    { id: '4', type: 'ECR', owner: 'ethanNebula', handle: '@ethanNebula', bg: 'bg-[#ffebee]' },
    { id: '5', type: 'EC2', owner: 'zaraStellar', handle: '@zaraStellar', bg: 'bg-[#e3f2fd]' },
    { id: '6', type: 'EC2', owner: 'owenCosmic', handle: '@owenCosmic', bg: 'bg-[#e3f2fd]' }
  ];

  // Specialized handlers with proper typing
  onInput(field: SourceConfigTextField, event: Event) {
    const input = event.target as HTMLInputElement;
    this.data[field] = input.value;
  }

  onSelect(field: SourceConfigSelectField, event: Event) {
    const select = event.target as HTMLSelectElement;
    this.data[field] = select.value;
  }

  addService() {
    if (this.data.awsService && this.data.awsResource) {
      const newId = (this.connectedResources.length + 1).toString();
      this.connectedResources = [
        ...this.connectedResources,
        {
          id: newId,
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
