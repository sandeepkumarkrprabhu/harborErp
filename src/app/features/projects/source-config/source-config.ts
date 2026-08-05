import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EMPTY, merge, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
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
export class SourceConfig implements OnInit, OnDestroy {
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

  repos: Repo[] = [];
  orgs: Orgs[] = [];
  branches: Branch[] = [];

  // resources keyed by targetId
  private deploymentResourcesMap = new Map<string, AwsResource[]>();

  branches$: Observable<Branch[]> | undefined;
  orgs$!: Observable<Orgs[]>;

  // subscriptions keyed by targetId
  private targetSubscriptions = new Map<string, Subscription>();

  // simple incremental id generator for targets
  private nextTargetId = 1;
  private generateTargetId(): string {
    return `t-${Date.now()}-${this.nextTargetId++}`;
  }

  constructor(
    private repoService: RepoService,
    private orgService: OrganizationService,
    private awsService: AwsService,
    private branchService: BranchService,
  ) {}

  ngOnInit() {
    // Ensure the FormArray exists before any operations
    this.ensureDeploymentTargetsControl();

    this.orgs$ = this.orgService.fetchOrganizations();
    this.orgs$.subscribe((orgs) => {
      this.orgs = orgs || [];
      this.restoreSelectedState();
    });

    this.formGroup.get('organization')?.valueChanges.subscribe((orgId) => {
      this.loadReposForOrganization(orgId);
    });

    this.formGroup.get('repo')?.valueChanges.subscribe((repoId) => {
      this.loadBranchesForRepo(repoId);
    });

    // initialize existing targets (if any)
    this.deploymentTargets.controls.forEach((ctrl) => {
      const g = ctrl as FormGroup;
      const id = this.ensureTargetId(g);
      if (!this.deploymentResourcesMap.has(id)) this.deploymentResourcesMap.set(id, []);
      this.watchTargetChanges(g);
      this.loadResourcesForTarget(g);
    });

    if (this.deploymentTargets.length === 0) {
      this.addDeploymentTarget();
    }
  }

  ngOnDestroy() {
    this.targetSubscriptions.forEach((s) => s?.unsubscribe());
    this.targetSubscriptions.clear();
    this.deploymentResourcesMap.clear();
  }

  get deploymentTargets(): FormArray {
    // lazy-guard: ensure control exists if accessed directly
    this.ensureDeploymentTargetsControl();
    return this.formGroup.get('deploymentTargets') as FormArray;
  }

  // Ensure the deploymentTargets FormArray exists on the incoming formGroup
  private ensureDeploymentTargetsControl(): void {
    if (!this.formGroup) return;
    if (!this.formGroup.get('deploymentTargets')) {
      this.formGroup.addControl('deploymentTargets', new FormArray([]));
    }
  }

  // Ensure each group has a stable targetId FormControl and return it
  private ensureTargetId(group: FormGroup): string {
    const ctrl = group.get('targetId');
    if (ctrl) return String(ctrl.value);
    const id = this.generateTargetId();
    group.addControl('targetId', new FormControl(id));
    return id;
  }

  private createDeploymentTargetGroup(): FormGroup {
    const group = new FormGroup({
      awsRegion: new FormControl('', Validators.required),
      awsService: new FormControl('', Validators.required),
      awsResource: new FormControl('', Validators.required),
      // targetId will be added by ensureTargetId when inserted
    });
    return group;
  }

  private insertTargetAtTop(group: FormGroup): void {
    // add stable id
    const id = this.ensureTargetId(group);

    // insert at index 0
    this.deploymentTargets.insert(0, group);

    // initialize resources map for this id
    this.deploymentResourcesMap.set(id, []);

    // rebuild watchers so mapping remains consistent
    this.rebuildTargetWatchers();
  }

  addDeploymentTarget(): void {
    const deploymentTargets = this.deploymentTargets;

    // validate the currently visible top target before adding
    if (deploymentTargets.length > 0) {
      const firstTarget = deploymentTargets.at(0) as FormGroup;
      if (!this.isDeploymentTargetValid(firstTarget)) {
        firstTarget.markAllAsTouched();
        return;
      }
      if (this.hasDuplicateDeploymentTarget(firstTarget, 0)) {
        firstTarget.setErrors({ duplicate: true });
        firstTarget.markAllAsTouched();
        return;
      }
    }

    const newGroup = this.createDeploymentTargetGroup();
    this.insertTargetAtTop(newGroup);
  }

  removeDeploymentTarget(index: number): void {
    const group = this.deploymentTargets.at(index) as FormGroup;
    if (!group) return;

    const id = this.ensureTargetId(group);

    // unsubscribe and remove subscription
    const sub = this.targetSubscriptions.get(id);
    if (sub) {
      sub.unsubscribe();
      this.targetSubscriptions.delete(id);
    }

    // remove resources map entry
    this.deploymentResourcesMap.delete(id);

    // remove the form group
    this.deploymentTargets.removeAt(index);

    // rebuild watchers to reattach subscriptions for current groups
    this.rebuildTargetWatchers();
  }

  onDeploymentTargetSelectionChange(index: number): void {
    const group = this.deploymentTargets.at(index) as FormGroup;
    if (!group) return;
    this.loadResourcesForTarget(group);
  }

  getResourceOptions(index: number): AwsResource[] {
    const group = this.deploymentTargets.at(index) as FormGroup;
    const id = this.ensureTargetId(group);
    return this.deploymentResourcesMap.get(id) || [];
  }

  deploymentTargetError(index: number, field: string): string {
    const targetGroup = this.deploymentTargets.at(index) as FormGroup;
    const control = targetGroup.get(field);

    if (!control) return '';

    if (!this.showErrors && !control.touched && !control.dirty) return '';

    if (control.hasError('required')) {
      return `${this.getFieldLabel(field)} is required.`;
    }

    if (targetGroup.hasError('duplicate')) {
      return 'Duplicate target.';
    }

    return '';
  }

  private loadResourcesForTarget(group: FormGroup): void {
    if (!group) return;
    const id = this.ensureTargetId(group);

    const awsService = group.get('awsService')?.value;
    const awsRegion = group.get('awsRegion')?.value;

    if (!awsService || !awsRegion) {
      this.deploymentResourcesMap.set(id, []);
      group.get('awsResource')?.setValue('', { emitEvent: false });
      return;
    }

    const targetId = id;

    this.awsService.fetchResources(awsService, awsRegion).subscribe({
      next: (resources) => {
        // if group was removed, ignore
        const exists = Array.from(this.deploymentTargets.controls).some((c) => {
          const g = c as FormGroup;
          return String(g.get('targetId')?.value) === targetId;
        });
        if (!exists) return;

        this.deploymentResourcesMap.set(targetId, resources || []);

        // preserve previous selection if still present
        const prev = String(group.get('awsResource')?.value || '');
        if (prev) {
          const match = (this.deploymentResourcesMap.get(targetId) || []).find(
            (r) => String(r.id) === prev,
          );
          if (match) {
            group.get('awsResource')?.setValue(String(match.id), { emitEvent: false });
          } else {
            group.get('awsResource')?.setValue('', { emitEvent: false });
          }
        }
      },
      error: () => {
        const exists = Array.from(this.deploymentTargets.controls).some((c) => {
          const g = c as FormGroup;
          return String(g.get('targetId')?.value) === targetId;
        });
        if (!exists) return;

        this.deploymentResourcesMap.set(targetId, []);
        group.get('awsResource')?.setValue('', { emitEvent: false });
      },
    });
  }

  private isDeploymentTargetValid(targetGroup: FormGroup): boolean {
    return ['awsRegion', 'awsService', 'awsResource'].every((field) =>
      Boolean(targetGroup.get(field)?.value),
    );
  }

  private hasDuplicateDeploymentTarget(targetGroup: FormGroup, currentIndex: number): boolean {
    const signature = this.getDeploymentTargetSignature(targetGroup);

    return this.deploymentTargets.controls.some((control, index) => {
      if (index === currentIndex) return false;
      return this.getDeploymentTargetSignature(control as FormGroup) === signature;
    });
  }

  private getDeploymentTargetSignature(targetGroup: FormGroup): string {
    return ['awsRegion', 'awsService', 'awsResource']
      .map((field) => String(targetGroup.get(field)?.value || '').toLowerCase())
      .join('|');
  }

  private getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      awsRegion: 'Region',
      awsService: 'Service',
      awsResource: 'Resource',
    };
    return labels[field] || field;
  }

  private getOrganizationLogin(organizationValue: string): string {
    const selectedOrg = this.orgs.find((org) => String(org.id) === String(organizationValue));
    return selectedOrg?.login || String(organizationValue || '');
  }

  private restoreSelectedState(): void {
    const organizationValue = this.formGroup.get('organization')?.value;
    if (organizationValue) {
      this.loadReposForOrganization(organizationValue);
    }
  }

  private loadReposForOrganization(orgId: string | null): void {
    const organizationLogin = this.getOrganizationLogin(orgId ?? '');

    if (orgId && organizationLogin) {
      this.repoService.fetchRepos(organizationLogin).subscribe((repos) => {
        this.repos = repos || [];
        this.syncSelectedRepo();
        this.loadBranchesForRepo(this.formGroup.get('repo')?.value);
      });
    } else {
      this.repos = [];
      this.branches = [];
      this.formGroup.get('repo')?.setValue('', { emitEvent: false });
      this.formGroup.get('branch')?.setValue('', { emitEvent: false });
    }
  }

  private loadBranchesForRepo(repoId: string | null): void {
    const organization = this.formGroup.get('organization')?.value;
    const selectedRepo = this.repos.find(
      (repo) => String(repo.id) === String(repoId) || repo.name === String(repoId),
    );

    if (repoId && organization && selectedRepo) {
      const owner = this.getOrganizationLogin(organization);
      const repoName = selectedRepo.name;

      this.branchService.fetchBranches(owner, repoName).subscribe((branches) => {
        this.branches = branches || [];
        this.syncSelectedBranch();
      });
    } else {
      this.branches = [];
      this.formGroup.get('branch')?.setValue('', { emitEvent: false });
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
    } else {
      repoControl?.setValue('', { emitEvent: false });
    }
  }

  private syncSelectedBranch(): void {
    const branchControl = this.formGroup.get('branch');
    const currentValue = branchControl?.value;

    if (!currentValue || !this.branches.length) {
      return;
    }

    const matchedBranch = this.branches.find(
      (branch) => String(branch.name) === String(currentValue),
    );

    if (matchedBranch) {
      branchControl?.setValue(String(matchedBranch.name), { emitEvent: false });
    } else {
      branchControl?.setValue('', { emitEvent: false });
    }
  }

  errorFor(controlName: string): string {
    const control = this.formGroup.get(controlName);
    if (!control || !this.showErrors) return '';
    if (control.hasError('required')) return `${controlName} is required.`;
    return '';
  }

  private watchTargetChanges(group: FormGroup): void {
    if (!group) return;

    const id = this.ensureTargetId(group);

    // unsubscribe existing subscription for this id
    const existing = this.targetSubscriptions.get(id);
    if (existing) {
      existing.unsubscribe();
      this.targetSubscriptions.delete(id);
    }

    const regionCtrl = group.get('awsRegion');
    const serviceCtrl = group.get('awsService');

    const region$ = regionCtrl ? regionCtrl.valueChanges.pipe(distinctUntilChanged()) : EMPTY;
    const service$ = serviceCtrl ? serviceCtrl.valueChanges.pipe(distinctUntilChanged()) : EMPTY;

    const sub = merge(region$, service$).subscribe(() => {
      // clear resource selection when region/service changes
      group.get('awsResource')?.setValue('', { emitEvent: false });
      this.loadResourcesForTarget(group);
    });

    this.targetSubscriptions.set(id, sub);
  }

  private rebuildTargetWatchers(): void {
    // unsubscribe all
    this.targetSubscriptions.forEach((s) => s?.unsubscribe());
    this.targetSubscriptions.clear();

    // ensure map entries exist for current groups
    this.deploymentTargets.controls.forEach((ctrl) => {
      const g = ctrl as FormGroup;
      const id = this.ensureTargetId(g);
      if (!this.deploymentResourcesMap.has(id)) this.deploymentResourcesMap.set(id, []);
    });

    // remove map entries for groups that no longer exist
    Array.from(this.deploymentResourcesMap.keys()).forEach((k) => {
      const exists = this.deploymentTargets.controls.some((c) => {
        const g = c as FormGroup;
        return String(g.get('targetId')?.value) === k;
      });
      if (!exists) this.deploymentResourcesMap.delete(k);
    });

    // attach watchers for each current group
    this.deploymentTargets.controls.forEach((ctrl) => {
      const g = ctrl as FormGroup;
      this.watchTargetChanges(g);
    });
  }

  trackByDeploymentTarget(index: number, item: AbstractControl): string {
    const g = item as FormGroup;
    return String(g.get('targetId')?.value || index);
  }
}
