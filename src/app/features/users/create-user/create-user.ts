import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { WizardFooter } from '../../../shared/components/wizard-footer/wizard-footer';
import { WizardHeader } from '../../../shared/components/wizard-header/wizard-header';
import { WizardSteps } from '../../../shared/components/wizard-steps/wizard-steps';
import { ReviewCreate } from '../review-create/review-create';
import { UserIdentity } from '../user-identity/user-identity';

enum UserSteps {
  Details = 1,
  Review = 2
}

export interface CreateUserData {
  memberName: string;
  email: string;
  role: string;
  status: string;
  projects: string[];
  notes: string;
}

export type ValidationErrors = Partial<Record<keyof CreateUserData, string>>;

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, WizardSteps, WizardHeader, WizardFooter, UserIdentity, ReviewCreate],
  templateUrl: './create-user.html',
  styleUrls: ['./create-user.css'],
})
export class CreateUser {
  @Output() closed = new EventEmitter<void>();

  showWizard = true;
  step = UserSteps.Details;
  attemptedSteps = new Set<number>();
  submitAttempted = false;

  userData: CreateUserData = {
    memberName: '',
    email: '',
    role: '',
    status: 'Active',
    projects: [],
    notes: ''
  };

  steps = [
    { number: 1, title: 'Step 1', subtitle: 'User Identity' },
    { number: 2, title: 'Step 2', subtitle: 'Review & Create' }
  ];

  private existingUserEmails = [
    'alex.k@example.com',
    'priya.r@example.com',
    'sam.t@example.com',
    'zara.m@example.com',
    'john.d@example.com',
    'meera.l@example.com',
    'carlos.m@example.com',
    'nina.p@example.com',
    'omar.q@example.com',
    'sophia.w@example.com',
    'rajesh.b@example.com',
    'emily.c@example.com'
  ];

  nextStep() {
    this.attemptedSteps.add(this.step);

    if (!this.isStepValid(this.step)) {
      return;
    }

    if (this.step < UserSteps.Review) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > UserSteps.Details) {
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

  get userIdentityErrors(): ValidationErrors {
    const errors: ValidationErrors = {};
    const memberName = this.userData.memberName.trim();
    const email = this.userData.email.trim().toLowerCase();
    const projects = this.cleanList(this.userData.projects);

    if (!memberName) {
      errors.memberName = 'Member name is required.';
    } else if (memberName.length < 2 || memberName.length > 64) {
      errors.memberName = 'Member name must be 2-64 characters.';
    }

    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Use a valid email address.';
    } else if (this.existingUserEmails.includes(email)) {
      errors.email = 'A user with this email already exists.';
    }

    if (!this.userData.role) {
      errors.role = 'Role is required.';
    }

    if (!this.userData.status) {
      errors.status = 'Status is required.';
    }

    if (projects.length > 8) {
      errors.projects = 'Assign 8 projects or fewer.';
    } else if (new Set(projects.map(project => project.toLowerCase())).size !== projects.length) {
      errors.projects = 'Projects must be unique.';
    }

    return errors;
  }

  get currentStepErrors(): ValidationErrors {
    return this.userIdentityErrors;
  }

  shouldShowErrors(stepNumber: number): boolean {
    return this.submitAttempted || this.attemptedSteps.has(stepNumber);
  }

  onCloseWizard() {
    this.showWizard = false;
    this.closed.emit();
  }

  submit() {
    this.submitAttempted = true;
    this.attemptedSteps.add(UserSteps.Details);

    if (!this.isStepValid(UserSteps.Details)) {
      this.step = UserSteps.Details;
      return;
    }

    console.log('User created:', this.userData);
    // TODO: integrate with backend service
  }

  private isStepValid(stepNumber: number): boolean {
    const errors = stepNumber === UserSteps.Details ? this.userIdentityErrors : {};
    return Object.keys(errors).length === 0;
  }

  private canReachStep(stepNumber: number): boolean {
    for (let currentStep = UserSteps.Details; currentStep < stepNumber; currentStep++) {
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
