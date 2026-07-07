import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Output, Input } from '@angular/core';

import { WizardFooter } from '../../../shared/components/wizard-footer/wizard-footer';
import { WizardHeader } from '../../../shared/components/wizard-header/wizard-header';
import { WizardSteps } from '../../../shared/components/wizard-steps/wizard-steps';
import { ReviewCreate } from '../review-create/review-create';
import { UserIdentity } from '../user-identity/user-identity';
import { UserService } from '../../../core/users/services/userService';
import { AuthService } from '../../../core/auth/services/auth.service';
import { RegisterUserRequest } from '../../../core/auth/models/auth';
import { UserHelper } from '../../../core/users/services/user-helper';
import { User } from '../../../Models/User';

enum UserSteps {
  Details = 1,
  Review = 2
}

export type ValidationErrors = Partial<Record<keyof RegisterUserRequest, string>>;

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, WizardSteps, WizardHeader, WizardFooter, UserIdentity, ReviewCreate],
  templateUrl: './create-user.html',
  styleUrls: ['./create-user.css'],
})

export class CreateUser {
  
  @Output() closed = new EventEmitter<void>();

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() existingUser: User | null = null;

  showWizard = true;
  step = UserSteps.Details;
  attemptedSteps = new Set<number>();
  submitAttempted = false;

  userData!: User;

  steps = [
    { number: 1, title: 'Step 1', subtitle: 'User Identity' },
    { number: 2, title: 'Step 2', subtitle: this.mode === 'edit' ? 'Review & Update' : 'Review & Create' }
  ];

  private existingUserEmails = [
    'alex.k@example.com', 'priya.r@example.com', 'sam.t@example.com',
    'zara.m@example.com', 'john.d@example.com', 'meera.l@example.com',
    'carlos.m@example.com', 'nina.p@example.com', 'omar.q@example.com',
    'sophia.w@example.com', 'rajesh.b@example.com', 'emily.c@example.com'
  ];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userHelper: UserHelper
  ) { 
    if (this.route.snapshot.paramMap.get('id') != null)
    {
      this.mode = "edit";
    }
  }
  
  ngOnInit() {
    if (this.mode === 'edit') {
      const userId = this.route.snapshot.paramMap.get('id'); // assumes route like /users/:id/edit
      if (userId) {
        this.userService.getUserById(userId).subscribe(user => {
          this.userData = { ...user };
          console.log("Selected User Details:", { ...user });
        });
      }
    } else if (this.existingUser) {
      this.userData = { ...this.existingUser };
    }
    else {
      // initialize empty user for create mode
      this.userData = {
        name: '',
        email: '',
        role_name: '',
        status: 'Active',
        projects: [],
        github_user_id: '',
        github_username: '',
        github_verified: false,
        id: "0",
        is_active: true,
        lastActive: '',
        requires_github_access: false,
        role_id: '',
        updated_at: '',
        notes:''
      };
    }
  }

  nextStep() {
    this.attemptedSteps.add(this.step);
    if (!this.isStepValid(this.step)) return;
    if (this.step < UserSteps.Review) this.step++;
  }

  prevStep() {
    if (this.step > UserSteps.Details) this.step--;
  }

  goToStep(stepNumber: number) {
    if (stepNumber > this.step && !this.canReachStep(stepNumber)) {
      this.attemptedSteps.add(this.step);
      return;
    }
    this.step = stepNumber;
  }

  get userIdentityErrors(): ValidationErrors {
    console.log("User data:", this.userData);
    const errors: ValidationErrors = {};
    const name = this.userData.name.trim();   
    const email = this.userData.email.trim().toLowerCase();
    const projects = this.cleanList(this.userData.projects.map(p => p.project_name));

    if (!name) {
      errors.name = 'Name is required.';
    } else if (name.length < 2 || name.length > 64) {
      errors.name = 'Name must be 2-64 characters.';
    }

    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Use a valid email address.';
    } else if (this.mode === 'create' && this.existingUserEmails.includes(email)) {
      errors.email = 'A user with this email already exists.';
    }

    if (!this.userData.role_id) errors.role_id = 'Role is required.';
    if (!this.userData.status) errors.status = 'Status is required.';

    // if (projects.length <= 1) {
    //   errors.projects = 'Assign atleast one or more projects or fewer.';
    // } else if (new Set(projects.map(p => p.toLowerCase())).size !== projects.length) {
    //   errors.projects = 'Projects must be unique.';
    // }

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

    if (this.mode === 'create') {
      var registerUser = this.userHelper.toRegisterRequest(this.userData); 
      console.log("New user Object:", registerUser)
      // Call backend to register new user
      this.authService.registerUser(registerUser).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.closed.emit();
        },
        error: (err) => {
          console.error('Error creating user:', err);
          // Optionally show a UI error message
        }
      });
    } else {
      // For now, just log edit mode until update service is ready
      console.log('Edit mode selected, update service not yet implemented:', this.userData);
      this.closed.emit();
    }
  }


  // These methods must be inside the class
  private isStepValid(stepNumber: number): boolean {
    const errors = stepNumber === UserSteps.Details ? this.userIdentityErrors : {};
    return Object.keys(errors).length === 0;
  }

  private canReachStep(stepNumber: number): boolean {
    for (let currentStep = UserSteps.Details; currentStep < stepNumber; currentStep++) {
      if (!this.isStepValid(currentStep)) return false;
    }
    return true;
  }

  private cleanList(values: string[]): string[] {
    return values.map(v => v.trim()).filter(Boolean);
  }
}
