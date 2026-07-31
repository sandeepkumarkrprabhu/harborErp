import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CreateProjectData, ValidationErrors } from '../../../Models/project';
import { WizardSteps } from '../../../shared/components/wizard-steps/wizard-steps';
import { WizardHeader } from '../../../shared/components/wizard-header/wizard-header';
import { WizardFooter } from '../../../shared/components/wizard-footer/wizard-footer';

import { ProjectIdentity } from '../project-identity/project-identity';
import { SourceConfig } from '../source-config/source-config';
import { ReviewCreate } from '../review-create/review-create';

import { ProjectHelper } from '../../../core/projects/services/project-helper';
import { ProjectService } from '../../../core/projects/services/project.service';

enum ProjectSteps {
  Details = 1,
  SourceConfig = 2,
  Review = 3,
}

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WizardSteps,
    WizardHeader,
    WizardFooter,
    ProjectIdentity,
    SourceConfig,
    ReviewCreate,
  ],
  templateUrl: './create-project.html',
  styleUrls: ['./create-project.css'],
})
export class CreateProject {
  step = ProjectSteps.Details;
  attemptedSteps = new Set<number>();
  submitAttempted = false;

  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  // Inject ProjectHelper service here
  constructor(
    private fb: FormBuilder,
    private projectHelper: ProjectHelper,
    private projectService: ProjectService,
  ) {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(48),
          Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        ],
      ],
      team: ['Platform Engineering', Validators.required],
      type: ['Internal Project', Validators.required],
      description: [''],
      tags: [[], Validators.required],
      members: [[], Validators.required],
      organization: [''],
      repo: ['', Validators.required],
      branch: ['', Validators.required],
      runtime: ['', Validators.required],
      environment: [''],
      awsRegion: ['', Validators.required],
      awsService: ['', Validators.required],
      awsResource: [''],
      awsServiceList: [[]],
    });
  }

  // projectData: CreateProjectData = {
  //   name: '',
  //   team: 'Platform Engineering',
  //   type: 'Internal Project',
  //   description: '',
  //   tags: [],
  //   members: [],
  //   organization: '',
  //   repo: '',
  //   branch: '',
  //   runtime: '',
  //   environment: '',
  //   awsRegion: '',
  //   awsService: '',
  //   awsResource: '',
  //   awsServiceList: [],
  // };

  steps = [
    { number: 1, title: 'Step 1', subtitle: 'Project Identity' },
    { number: 2, title: 'Step 2', subtitle: 'Source & Config' },
    { number: 3, title: 'Step 3', subtitle: 'Review & Create' },
  ];

  nextStep() {
    this.attemptedSteps.add(this.step);
    if (!this.isStepValid(this.step)) return;
    if (this.step < ProjectSteps.Review) this.step++;
  }

  prevStep() {
    if (this.step > ProjectSteps.Details) this.step--;
  }

  goToStep(stepNumber: number) {
    if (stepNumber > this.step && !this.canReachStep(stepNumber)) {
      this.attemptedSteps.add(this.step);
      return;
    }
    this.step = stepNumber;
  }

  onCloseWizard() {
    this.close.emit();
  }

  submit() {
    this.submitAttempted = true;
    this.attemptedSteps.add(ProjectSteps.Details);
    this.attemptedSteps.add(ProjectSteps.SourceConfig);

    if (!this.isStepValid(ProjectSteps.Details) || !this.isStepValid(ProjectSteps.SourceConfig)) {
      this.step = !this.isStepValid(ProjectSteps.Details)
        ? ProjectSteps.Details
        : ProjectSteps.SourceConfig;
      return;
    }

    // Transform UI data into API payload
    const apiObject = this.projectHelper.transformToApiObject(this.form.value);

    this.projectService.createProject(apiObject).subscribe({
      next: () => this.close.emit(),
      error: (err) => console.error('❌ Failed to create project:', err),
    });
  }

  get projectIdentityErrors(): ValidationErrors {
    const errors: ValidationErrors = {};
    const name = this.form.get('name')?.value?.trim();

    if (!name) errors.name = 'Project name is required.';
    else if (name.length < 3 || name.length > 48)
      errors.name = 'Project name must be 3-48 characters.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name))
      errors.name = 'Use lowercase letters, numbers, and single hyphens only.';

    if (!this.form.get('team')?.value) errors.team = 'Team / owner is required.';
    if (!this.form.get('type')?.value) errors.type = 'Project type is required.';

    return errors;
  }

  get sourceConfigErrors(): ValidationErrors {
    const errors: ValidationErrors = {};

    const organization = this.form.get('organization')?.value?.trim();
    const repo = this.form.get('repo')?.value?.trim();
    const branch = this.form.get('branch')?.value?.trim();
    const runtime = this.form.get('runtime')?.value?.trim();
    const awsRegion = this.form.get('awsRegion')?.value;
    const awsService = this.form.get('awsService')?.value;

    if (!organization) errors.organization = 'Organization / project is required.';
    if (!repo) errors.repo = 'GitHub repo is required.';
    if (!branch) errors.branch = 'Branch is required.';
    if (!runtime) errors.runtime = 'Runtime is required.';
    if (!awsRegion) errors.awsRegion = 'AWS region is required.';
    if (!awsService) errors.awsService = 'AWS service is required.';

    return errors;
  }

  get currentStepErrors(): ValidationErrors {
    return this.step === ProjectSteps.Details
      ? this.projectIdentityErrors
      : this.sourceConfigErrors;
  }

  shouldShowErrors(stepNumber: number): boolean {
    return this.submitAttempted || this.attemptedSteps.has(stepNumber);
  }

  private isStepValid(stepNumber: number): boolean {
    if (stepNumber === ProjectSteps.Details) {
      const controls = ['name', 'team', 'type', 'tags', 'members'];
      controls.forEach((c) => this.form.get(c)?.markAsTouched());
      return controls.every((c) => this.form.get(c)?.valid);
    }
    if (stepNumber === ProjectSteps.SourceConfig) {
      const controls = ['organization', 'repo', 'branch', 'runtime', 'awsRegion', 'awsService'];
      controls.forEach((c) => this.form.get(c)?.markAsTouched());
      return controls.every((c) => this.form.get(c)?.valid);
    }
    return true;
  }

  private canReachStep(stepNumber: number): boolean {
    for (let currentStep = ProjectSteps.Details; currentStep < stepNumber; currentStep++) {
      if (!this.isStepValid(currentStep)) return false;
    }
    return true;
  }
}
