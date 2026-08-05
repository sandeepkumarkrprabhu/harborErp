import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule, AsyncPipe } from '@angular/common';

import { Repo } from '../../../Models/Repo';
import { Branch } from '../../../Models/branch';
import { AwsResource } from '../../../Models/AwsResource';
import { Orgs } from '../../../Models/Organization';

import { AwsService } from '../../../core/aws/services/awsService';
import { RepoService } from '../../../core/aws/services/repoService';
import { OrganizationService } from '../../../core/aws/services/OrganizationService';
import { BranchService } from '../../../core/aws/services/branch-service';

@Component({
  selector: 'app-source-config',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AsyncPipe],
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
  orgs: Orgs[] = [];
  branches: Branch[] = [];

  branches$: Observable<Branch[]> | undefined;
  resources$!: Observable<AwsResource[]>;
  orgs$!: Observable<Orgs[]>;

  loading = false;

  constructor(
    private repoService: RepoService,
    private orgService: OrganizationService,
    private awsService: AwsService,
    private branchService: BranchService,
  ) {}

  ngOnInit() {
    // AWS resource subscriptions (unchanged)
    this.formGroup.get('awsRegion')?.valueChanges.subscribe(() => this.fetchResources());
    this.formGroup.get('awsService')?.valueChanges.subscribe(() => this.fetchResources());
    this.formGroup.get('awsResource')?.valueChanges.subscribe((resourceId) => {
      if (resourceId) {
        this.onSelectAwsResource(resourceId);
      }
    });

    // Load organizations initially
    this.orgs$ = this.orgService.fetchOrganizations();
    this.orgs$.subscribe((orgs) => {
      this.orgs = orgs || [];
    });

    // When organization changes → fetch repos
    this.formGroup.get('organization')?.valueChanges.subscribe((orgId) => {
      const organizationLogin = this.getOrganizationLogin(orgId);

      if (orgId && organizationLogin) {
        this.repoService.fetchRepos(organizationLogin).subscribe((repos) => {
          this.repos = repos || [];
          this.formGroup.get('repo')?.setValue('');
          this.branches = []; // reset branches when org changes
        });
      } else {
        this.repos = [];
        this.branches = [];
      }
    });

    // When repo changes → fetch branches
    this.formGroup.get('repo')?.valueChanges.subscribe((repoId) => {
      const organization = this.formGroup.get('organization')?.value;
      const selectedRepo = this.repos.find(
        (repo) => String(repo.id) === String(repoId) || repo.name === String(repoId),
      );

      if (repoId && organization && selectedRepo) {
        const owner = this.getOrganizationLogin(organization);
        const repoName = selectedRepo.name;

        this.branchService.fetchBranches(owner, repoName).subscribe((branches) => {
          this.branches = branches || [];
          this.formGroup.get('branch')?.setValue('');
        });
      } else {
        this.branches = [];
      }
    });

    // Initial AWS resources fetch
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

  private getOrganizationLogin(organizationValue: string): string {
    const selectedOrg = this.orgs.find((org) => String(org.id) === String(organizationValue));
    return selectedOrg?.login || String(organizationValue || '');
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
