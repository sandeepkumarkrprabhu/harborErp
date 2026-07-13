import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateProjectData, ValidationErrors } from '../../../Models/project';
import { WizardSteps } from '../../../shared/components/wizard-steps/wizard-steps';
import { WizardHeader } from '../../../shared/components/wizard-header/wizard-header';
import { ProjectIdentity } from '../project-identity/project-identity';
import { WizardFooter } from '../../../shared/components/wizard-footer/wizard-footer';
import { SourceConfig } from "../source-config/source-config";
import { ReviewCreate } from '../review-create/review-create';
import { ProjectHelper } from '../../../core/projects/services/project-helper'
import { ProjectService } from '../../../core/projects/services/project.service';

enum ProjectSteps {
  Details = 1,
  SourceConfig = 2,
  Review = 3
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
    ReviewCreate
  ],
  templateUrl: './create-project.html',
  styleUrls: ['./create-project.css']
})
  
export class CreateProject {
  showWizard = true;
  step = ProjectSteps.Details;
  attemptedSteps = new Set<number>();
  submitAttempted = false;

  // Inject ProjectHelper service here
  constructor(private projectHelper: ProjectHelper,
    private projectService: ProjectService
  ) {}
  
  projectData: CreateProjectData = {
    name: '',
    team: 'Platform Engineering',
    type: 'Internal Project',
    description: '',
    tags: [],
    members: [],
    organization: '',
    repo: '',
    branch: '',
    runtime: '',
    environment: '',
    awsRegion: '',
    awsService: '',
    awsResource: '',
    awsServiceList: []
  };

  steps = [
    { number: 1, title: 'Step 1', subtitle: 'Project Identity' },
    { number: 2, title: 'Step 2', subtitle: 'Source & Config' },
    { number: 3, title: 'Step 3', subtitle: 'Review & Create' }
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
    this.showWizard = false;
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
    const apiObject = this.projectHelper.transformToApiObject(this.projectData);

    // Call backend service
    this.projectService.createProject(apiObject).subscribe({
      next: (createdProject) => {
        //console.log('✅ Project created successfully:', createdProject);
        this.showWizard = false; // optionally close wizard
        // TODO: navigate to project detail page or show success message
      },
      error: (err) => {
        console.error('❌ Failed to create project:', err);
        // TODO: show error banner/toast in UI
      }
    });
  }


  get projectIdentityErrors(): ValidationErrors {
    const errors: ValidationErrors = {};
    const name = this.projectData.name.trim();

    if (!name) errors.name = 'Project name is required.';
    else if (name.length < 3 || name.length > 48) errors.name = 'Project name must be 3-48 characters.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) errors.name = 'Use lowercase letters, numbers, and single hyphens only.';

    if (!this.projectData.team) errors.team = 'Team / owner is required.';
    if (!this.projectData.type) errors.type = 'Project type is required.';

    return errors;
  }

  get sourceConfigErrors(): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!this.projectData.organization.trim()) errors.organization = 'Organization / project is required.';
    if (!this.projectData.repo.trim()) errors.repo = 'GitHub repo is required.';
    if (!this.projectData.branch.trim()) errors.branch = 'Branch is required.';
    if (!this.projectData.runtime.trim()) errors.runtime = 'Runtime is required.';
    if (!this.projectData.awsRegion) errors.awsRegion = 'AWS region is required.';
    if (!this.projectData.awsService) errors.awsService = 'AWS service is required.';
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
    const errors = stepNumber === ProjectSteps.Details
      ? this.projectIdentityErrors
      : this.sourceConfigErrors;
    return Object.keys(errors).length === 0;
  }

  private canReachStep(stepNumber: number): boolean {
    for (let currentStep = ProjectSteps.Details; currentStep < stepNumber; currentStep++) {
      if (!this.isStepValid(currentStep)) return false;
    }
    return true;
  }
}
