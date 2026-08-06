import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { WizardFooter } from '../../../shared/components/wizard-footer/wizard-footer';
import { WizardHeader } from '../../../shared/components/wizard-header/wizard-header';
import { WizardSteps } from '../../../shared/components/wizard-steps/wizard-steps';
import { UserHelper } from '../../../core/users/services/user-helper';
import { UserService } from '../../../core/users/services/userService';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ReviewCreate } from '../review-create/review-create';
import { UserIdentity } from '../user-identity/user-identity';
import { RegisterUserRequest } from '../../../core/auth/models/auth';
import { ValidationErrors } from '../validation-errors';
import { User } from '../../../Models/User';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

enum UserSteps {
  Details = 1,
  Review = 2,
}

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

  @ViewChild(UserIdentity) userIdentityComponent!: UserIdentity;

  showWizard = true;
  step = UserSteps.Details;
  attemptedSteps = new Set<number>();
  submitAttempted = false;

  // Observable instead of manual subscribe
  userData$!: Observable<User>;

  get steps() {
    return [
      { number: 1, title: 'Step 1', subtitle: 'User Identity' },
      {
        number: 2,
        title: 'Step 2',
        subtitle: this.mode === 'edit' ? 'Review & Update' : 'Review & Create',
      },
    ];
  }

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userHelper: UserHelper,
  ) {
    if (this.route.snapshot.paramMap.get('id') != null) {
      this.mode = 'edit';
    }
  }

  ngOnInit() {
    if (this.mode === 'edit' && this.existingUser) {
      // Editing inline from Users table
      this.userData$ = of({
        ...this.existingUser,
      });
    } else if (this.mode === 'edit') {
      // Editing via route navigation (fallback)
      const userId = this.route.snapshot.paramMap.get('id');
      if (userId) {
        this.userData$ = this.userService
          .getUserById(userId)
          .pipe(tap((user) => console.log('Selected User Details:', user)));
      }
    } else {
      // Create mode
      this.userData$ = of({
        name: '',
        email: '',
        role_name: '',
        status: 'Active',
        projects: [],
        github_user_id: '',
        github_username: '',
        github_verified: false,
        id: '0',
        is_active: true,
        lastActive: '',
        requires_github_access: false,
        role_id: '',
        updated_at: '',
        notes: '',
      });
    }
  }

  ngAfterViewInit() {
    console.log('Child component ready:', this.userIdentityComponent);
  }

  /**
   * Mark controls for the given step as touched so child components show errors.
   */
  private markStepControlsTouched(stepNumber: number): void {
    if (stepNumber === UserSteps.Details && this.userIdentityComponent) {
      this.userIdentityComponent.markAllTouched();
    }
  }

  nextStep() {
    this.attemptedSteps.add(this.step);

    // Ensure child controls are marked so errors appear
    this.markStepControlsTouched(this.step);

    // Ask child to persist/validate changes (child returns boolean or handles internal state)
    if (this.step === UserSteps.Details && this.userIdentityComponent) {
      this.userIdentityComponent.saveChanges();
    }

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
    if (this.step === UserSteps.Details && this.userIdentityComponent) {
      this.userIdentityComponent.saveChanges();
    }
    this.step = stepNumber;
  }

  /**
   * Collect validation errors from the UserIdentity child component.
   * The child returns a ValidationErrors object keyed by RegisterUserRequest fields.
   */
  get userIdentityErrors(): ValidationErrors {
    if (
      this.userIdentityComponent &&
      typeof this.userIdentityComponent.getValidationErrors === 'function'
    ) {
      return this.userIdentityComponent.getValidationErrors();
    }
    return {};
  }

  get currentStepErrors(): ValidationErrors {
    return this.userIdentityErrors;
  }

  /**
   * Whether to show errors for a step (used by child components)
   */
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

    // mark controls and persist child changes
    this.markStepControlsTouched(UserSteps.Details);
    if (this.userIdentityComponent) {
      this.userIdentityComponent.saveChanges();
    }

    if (!this.isStepValid(UserSteps.Details)) {
      this.step = UserSteps.Details;
      return;
    }

    this.userData$.subscribe((userData) => {
      if (this.mode === 'create') {
        const registerUser = this.userHelper.toRegisterRequest(userData);
        this.authService.registerUser(registerUser).subscribe({
          next: (response) => {
            console.log('User created successfully:', response);
            this.closed.emit();
          },
          error: (err) => console.error('Error creating user:', err),
        });
      } else {
        this.userService.updateUser(userData.id, userData).subscribe({
          next: (response) => {
            console.log('User updated successfully:', response);
            this.closed.emit();
          },
          error: (err) => console.error('Error updating user:', err),
        });
      }
    });
  }

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

  trackByUser(index: number, user: User) {
    return user.id; // stable unique identifier
  }
}
