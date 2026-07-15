import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { WizardFooter } from '../../../shared/components/wizard-footer/wizard-footer';
import { WizardHeader } from '../../../shared/components/wizard-header/wizard-header';
import { WizardSteps } from '../../../shared/components/wizard-steps/wizard-steps';
import { UserHelper } from '../../../core/users/services/user-helper';
import { UserService } from '../../../core/users/services/userService';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ReviewCreate } from '../review-create/review-create';
import { UserIdentity } from '../user-identity/user-identity';
import { RegisterUserRequest } from '../../../core/auth/models/auth';
import { User } from '../../../Models/User';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  // Observable instead of manual subscribe
  userData$!: Observable<User>;

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
    if (this.route.snapshot.paramMap.get('id') != null) {
      this.mode = "edit";
    }
  }

  ngOnInit() {
    if (this.mode === 'edit') {
      const userId = this.route.snapshot.paramMap.get('id');
      if (userId) {
        this.userData$ = this.userService.getUserById(userId).pipe(
          tap(user => console.log("Selected User Details:", user))
        );
      }
    } else if (this.existingUser) {
      this.userData$ = of({ ...this.existingUser });
    } else {
      this.userData$ = of({
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
      });
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
    // NOTE: userData is now async, so this getter should be used inside template with async pipe
    return {};
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

    this.userData$.subscribe(userData => {
      if (this.mode === 'create') {
        const registerUser = this.userHelper.toRegisterRequest(userData);
        console.log("New user Object:", registerUser);

        this.authService.registerUser(registerUser).subscribe({
          next: (response) => {
            console.log('User created successfully:', response);
            this.closed.emit();
          },
          error: (err) => {
            console.error('Error creating user:', err);
          }
        });
      } else {
        console.log('Edit mode selected, update service not yet implemented:', userData);
        this.closed.emit();
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

  private cleanList(values: string[]): string[] {
    return values.map(v => v.trim()).filter(Boolean);
  }
}
