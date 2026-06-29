import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WizardSteps } from '../../../shared/components/wizard-steps/wizard-steps';
import { WizardHeader } from '../../../shared/components/wizard-header/wizard-header';
import { ProjectIdentity } from '../project-identity/project-identity';
import { WizardFooter } from '../../../shared/components/wizard-footer/wizard-footer';
import { SourceConfig } from "../source-config/source-config";
import { ReviewCreate } from '../review-create/review-create';

enum ProjectSteps {
  Details = 1,
  SourceConfig = 2,
  Review = 3
}

export interface CreateProjectData {
  name: string;
  team: string;
  type: string;
  description: string;
  tags: string[];
  members: string[];
  organization: string;
  repo: string;
  branch: string;
  runtime: string;
  environment: string;
  awsRegion: string;
  awsService: string;
  awsResource: string;
  awsServiceList: string[];
}

export type ValidationErrors = Partial<Record<keyof CreateProjectData, string>>;

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, WizardSteps, WizardHeader, WizardFooter, ProjectIdentity, SourceConfig, ReviewCreate],
  templateUrl: './create-project.html',
  styleUrls: ['./create-project.css']
})
export class CreateProject {

  showWizard = true;
  step = ProjectSteps.Details;
  attemptedSteps = new Set<number>();
  submitAttempted = false;

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

  private existingProjectNames = [
    'harbor-api',
    'harbor-frontend',
    'auth-service',
    'notification-worker',
    'payment-gateway',
    'analytics-service',
    'inventory-service',
    'user-profile',
    'search-service',
    'logging-service',
    'recommendation-engine',
    'file-storage'
  ];
  
  nextStep() {
    this.attemptedSteps.add(this.step);

    if (!this.isStepValid(this.step)) {
      return;
    }

    if (this.step < ProjectSteps.Review) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > ProjectSteps.Details) {
      this.step--;
    }
  }

  goToStep(stepNumber: number) {
    if (stepNumber > this.step && !this.canReachStep(stepNumber)) {
      this.attemptedSteps.add(this.step);
      return;
    }

    this.step = stepNumber;
  }

  onCloseWizard() {
    // Option 1: Hide the wizard modal
    this.showWizard = false;
  }

  submit() {
    this.submitAttempted = true;
    this.attemptedSteps.add(ProjectSteps.Details);
    this.attemptedSteps.add(ProjectSteps.SourceConfig);

    if (!this.isStepValid(ProjectSteps.Details) || !this.isStepValid(ProjectSteps.SourceConfig)) {
      this.step = !this.isStepValid(ProjectSteps.Details) ? ProjectSteps.Details : ProjectSteps.SourceConfig;
      return;
    }

    console.log('Project created:', this.projectData);
    // TODO: integrate with backend service
  }

  get projectIdentityErrors(): ValidationErrors {
    const errors: ValidationErrors = {};
    const name = this.projectData.name.trim();
    const tags = this.cleanList(this.projectData.tags);
    const members = this.cleanList(this.projectData.members);

    if (!name) {
      errors.name = 'Project name is required.';
    } else if (name.length < 3 || name.length > 48) {
      errors.name = 'Project name must be 3-48 characters.';
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      errors.name = 'Use lowercase letters, numbers, and single hyphens only.';
    } else if (this.existingProjectNames.includes(name)) {
      errors.name = 'A project with this name already exists.';
    }

    if (!this.projectData.team) {
      errors.team = 'Team / owner is required.';
    }

    if (!this.projectData.type) {
      errors.type = 'Project type is required.';
    }

    if (tags.length > 6) {
      errors.tags = 'Use 6 tags or fewer.';
    } else if (tags.some(tag => !/^[a-z0-9-]+$/.test(tag))) {
      errors.tags = 'Tags can only use lowercase letters, numbers, and hyphens.';
    }

    if (members.length > 8) {
      errors.members = 'Assign 8 members or fewer.';
    } else if (new Set(members.map(member => member.toLowerCase())).size !== members.length) {
      errors.members = 'Members must be unique.';
    }

    return errors;
  }

  get sourceConfigErrors(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.projectData.organization.trim()) {
      errors.organization = 'Organization / project is required.';
    } else if (!/^[A-Za-z0-9_.-]+$/.test(this.projectData.organization.trim())) {
      errors.organization = 'Use a valid organization name.';
    }

    if (!this.projectData.repo.trim()) {
      errors.repo = 'GitHub repo is required.';
    } else if (!/^[A-Za-z0-9_.-]+$/.test(this.projectData.repo.trim())) {
      errors.repo = 'Use a valid repository name.';
    }

    if (!this.projectData.branch.trim()) {
      errors.branch = 'Branch is required.';
    } else if (!/^[A-Za-z0-9._/-]+$/.test(this.projectData.branch.trim())) {
      errors.branch = 'Branch cannot include spaces or special shell characters.';
    }

    if (!this.projectData.runtime.trim()) {
      errors.runtime = 'Runtime is required.';
    }

    if (this.projectData.environment && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(this.projectData.environment.trim())) {
      errors.environment = 'Environment name must be lowercase with optional hyphens.';
    }

    if (!this.projectData.awsRegion) {
      errors.awsRegion = 'AWS region is required.';
    }

    if (!this.projectData.awsService) {
      errors.awsService = 'AWS service is required.';
    }

    return errors;
  }

  get currentStepErrors(): ValidationErrors {
    return this.step === ProjectSteps.Details ? this.projectIdentityErrors : this.sourceConfigErrors;
  }

  shouldShowErrors(stepNumber: number): boolean {
    return this.submitAttempted || this.attemptedSteps.has(stepNumber);
  }

  private isStepValid(stepNumber: number): boolean {
    const errors = stepNumber === ProjectSteps.Details ? this.projectIdentityErrors : this.sourceConfigErrors;
    return Object.keys(errors).length === 0;
  }

  private canReachStep(stepNumber: number): boolean {
    for (let currentStep = ProjectSteps.Details; currentStep < stepNumber; currentStep++) {
      if (!this.isStepValid(currentStep)) {
        return false;
      }
    }

    return true;
  }

  private cleanList(values: string[]): string[] {
    return values.map(value => value.trim()).filter(Boolean);
  }
}
