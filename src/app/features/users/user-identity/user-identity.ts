import { Component, Input, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { User } from '../../../Models/User';
import { Role } from '../../../Models/role';
import { RoleService } from '../../../core/role/role-service';
import { GithubService } from '../../../core/github/github-service';

import { InputField } from '../../../shared/components/input-field/input-field';

import { ValidationErrors } from '../validation-errors';

/**
 * UserIdentity component
 *
 * - Builds a reactive form for user identity fields
 * - Exposes helpers for validation UI: controlInvalid, getErrorMessage
 * - Exposes methods parent can call: saveChanges(), markAllTouched(), getValidationErrors()
 * - Keeps role selection in sync with loaded roles
 */
@Component({
  selector: 'app-user-identity',
  standalone: true,
  imports: [InputField, ReactiveFormsModule, CommonModule],
  templateUrl: './user-identity.html',
  styleUrls: ['./user-identity.css'],
})
export class UserIdentity implements OnInit, OnDestroy {
  /** Input model reference (required) */
  @Input({ required: true }) data!: User;

  /** Optional server-side errors object (keyed by field) */
  @Input() errors: Record<string, string> = {};

  /**
   * Parent toggles this to true when errors should be shown globally
   * (e.g., after submitAttempted or when the user attempted the step).
   */
  @Input() showErrors = false;

  roles: Role[] = [];
  userForm!: FormGroup;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private githubService: GithubService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Initialize reactive form with validators
    this.userForm = this.fb.group({
      name: [
        this.data?.name || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(128)],
      ],
      email: [
        this.data?.email || '',
        [Validators.required, Validators.email, Validators.maxLength(256)],
      ],
      role_id: [this.data?.role_id || '', [Validators.required]],

      // Add requires_github_access
      requires_github_access: [this.data?.requires_github_access || false],

      github_username: [
        this.data?.github_username || '',
        [Validators.maxLength(64), Validators.pattern(/^[a-zA-Z0-9-]+$/)],
      ],
    });

    // Reset GitHub username when checkbox is unchecked
    this.userForm
      .get('requires_github_access')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (!val) {
          this.userForm.get('github_username')?.reset();
          this.data.github_verified = false;
        }
      });

    // Reset verification when username changes due to user input
    this.userForm
      .get('github_username')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.userForm.get('github_username')?.dirty) {
          this.data.github_verified = false;
        }
      });

    // Load roles and sync role_id/role_name
    this.roleService
      .getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roles) => {
          this.roles = roles || [];

          // If role_id not provided but role_name exists, try to resolve it
          if (!this.data?.role_id && this.data?.role_name) {
            const matched = this.roles.find(
              (r) => r.name.toLowerCase() === this.data.role_name.toLowerCase(),
            );
            if (matched) {
              this.data.role_id = matched.id;
              this.userForm.patchValue({ role_id: matched.id }, { emitEvent: false });
            }
          }

          // Patch role_id if present
          if (this.data?.role_id) {
            this.userForm.patchValue({ role_id: this.data.role_id }, { emitEvent: false });
          }

          // Keep data reference in sync with form values
          this.userForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val) => {
            Object.assign(this.data, val);
            const matchedRole = this.roles.find((r) => r.id === val.role_id);
            this.data.role_name = matchedRole ? matchedRole.name : '';
          });

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load roles', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Persist form values back to the `data` object.
   * Returns true if form is valid and changes were applied, false otherwise.
   * Parent should call this on Next/Submit.
   */
  saveChanges(): boolean {
    // Mark touched so validation UI appears
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      // Do not apply invalid values
      return false;
    }

    // Apply values to the data reference
    Object.assign(this.data, this.userForm.getRawValue());

    // Ensure role_name is set from role_id
    const matchedRole = this.roles.find((r) => r.id === this.data.role_id);
    this.data.role_name = matchedRole ? matchedRole.name : '';

    return true;
  }

  /**
   * Mark all controls as touched (used by parent to force validation UI)
   */
  markAllTouched(): void {
    this.userForm.markAllAsTouched();
  }

  /**
   * Return a map of validation errors for parent consumption
   */
  getValidationErrors(): ValidationErrors {
    const errs: ValidationErrors = {};

    // Name validation
    const name = this.userForm.get('name');
    if (name?.invalid) {
      if (name.hasError('required')) errs.name = 'Name is required.';
      else if (name.hasError('minlength')) errs.name = 'Name is too short.';
      else if (name.hasError('maxlength')) errs.name = 'Name is too long.';
    }

    // Email validation
    const email = this.userForm.get('email');
    if (email?.invalid) {
      if (email.hasError('required')) errs.email = 'Email is required.';
      else if (email.hasError('email')) errs.email = 'Invalid email address.';
      else if (email.hasError('maxlength')) errs.email = 'Email is too long.';
    }

    // Role validation
    const role = this.userForm.get('role_id');
    if (role?.invalid) {
      if (role.hasError('required')) errs.role_id = 'Role is required.';
    }

    // Conditional GitHub username validation
    const requiresGithub = this.userForm.get('requires_github_access')?.value;
    const github = this.userForm.get('github_username');
    if (requiresGithub) {
      if (!github?.value) {
        errs.github_username = 'GitHub username is required when access is enabled.';
      } else if (github?.invalid) {
        if (github.hasError('maxlength')) errs.github_username = 'GitHub username is too long.';
        else if (github.hasError('pattern'))
          errs.github_username = 'Invalid GitHub username format.';
      } else if (!this.data.github_verified) {
        errs.github_username = 'GitHub username must be verified.';
      }
    }

    // Merge server-side errors (if any)
    Object.keys(this.errors || {}).forEach((k) => {
      errs[k as keyof ValidationErrors] = this.errors[k] || errs[k as keyof ValidationErrors];
    });

    return errs;
  }

  /**
   * Template helper: whether to show an error for a control
   * - showErrors (from parent) forces visibility (used after submit/step attempt)
   * - otherwise show when control is touched or dirty
   */
  controlInvalid(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    if (!control) return false;
    
    let isInvalid = control.invalid;
    if (controlName === 'github_username' && this.userForm.get('requires_github_access')?.value) {
      if (!this.data.github_verified) {
        isInvalid = true;
      }
    }
    
    return isInvalid && (this.showErrors || control.touched || control.dirty);
  }

  /**
   * Template helper: friendly error messages for a control
   */
  getErrorMessage(controlName: string): string {
    if (controlName === 'github_username' && this.userForm.get('requires_github_access')?.value) {
      const control = this.userForm.get('github_username');
      if (!control?.value) return 'GitHub username is required.';
      if (control?.invalid) {
        if (control.hasError('maxlength')) {
          const max = control.getError('maxlength')?.requiredLength;
          return `Maximum ${max} characters allowed.`;
        }
        if (control.hasError('pattern')) return 'Invalid GitHub username format.';
      }
      if (!this.data.github_verified) {
        return 'GitHub username must be verified.';
      }
    }

    const control = this.userForm.get(controlName);
    if (!control || !control.errors) {
      // fallback to server-side error if present
      return this.errors?.[controlName] || '';
    }

    if (control.hasError('required')) return 'This field is required.';
    if (control.hasError('minlength')) {
      const min = control.getError('minlength')?.requiredLength;
      return `Minimum ${min} characters required.`;
    }
    if (control.hasError('maxlength')) {
      const max = control.getError('maxlength')?.requiredLength;
      return `Maximum ${max} characters allowed.`;
    }
    if (control.hasError('email')) return 'Please enter a valid email address.';
    if (control.hasError('pattern')) return 'Invalid format.';
    return 'Invalid value.';
  }

  /**
   * Verify GitHub username via service and update model on success
   */
  verifyGithubUser(userId: string, username: string) {
    if (!username) return;
    this.githubService.getUserByUsername(username).subscribe({
      next: (res) => {
        console.log('GitHub user verified:', res);
        this.data.github_username = username;
        this.data.github_verified = res.valid;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error verifying GitHub user:', err);
        this.data.github_verified = false;
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * trackBy for role list rendering
   */
  trackByRoleId(index: number, item: Role) {
    return item?.id ?? index;
  }
}
