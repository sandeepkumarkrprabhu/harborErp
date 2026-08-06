import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../../core/users/services/userService';
import { User } from '../../../Models/User';
import { InputField } from '../../../shared/components/input-field/input-field';

/**
 * TeamIdentity component
 *
 * Responsibilities
 * - Render Team Identity controls (teamName, teamLeadID, teamDescription)
 * - Provide friendly validation helpers for the template
 * - Keep team lead selection in sync with available users
 *
 * Usage
 * <app-team-identity
 *   [form]="form"
 *   [showErrors]="shouldShowErrorsForStep(1)"
 * ></app-team-identity>
 */
@Component({
  selector: 'app-team-identity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputField],
  templateUrl: './team-identity.html',
  styleUrls: ['./team-identity.css'],
})
export class TeamIdentity implements OnInit, OnDestroy {
  /** Reactive form group provided by parent (required) */
  @Input({ required: true }) form!: FormGroup;

  /**
   * Parent toggles this to true when errors should be shown globally
   * (e.g., after submitAttempted or when the user attempted the step).
   */
  @Input() showErrors = false;

  /** Available team lead options loaded from backend */
  teamLeads: User[] = [];

  /** Internal subject to clean up subscriptions */
  private readonly destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Load active users and keep the selected lead normalized
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.teamLeads = (users || []).filter((u) => u.is_active);
          this.syncSelectedLead();
        },
        error: (err) => {
          // Keep logging concise and actionable
          console.error('Failed to load users for team lead list', err);
        },
      });

    // When the control value changes, attempt to normalize it to an ID
    this.form
      .get('teamLeadID')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.syncSelectedLead();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Keep the teamLeadID control normalized to an ID string when possible.
   * - If the control contains a name, try to find the matching user and set the ID.
   * - If the control already contains a valid ID, leave it as-is.
   *
   * This prevents mismatches between stored values and select options.
   */
  private syncSelectedLead(): void {
    const control = this.form.get('teamLeadID');
    const currentValue = control?.value;

    if (!this.teamLeads.length || currentValue == null || currentValue === '') {
      return;
    }

    const normalizedValue = String(currentValue).trim();

    // Prefer matching by id first
    const matchedById = this.teamLeads.find((lead) => String(lead.id) === normalizedValue);
    if (matchedById) {
      control?.setValue(String(matchedById.id), { emitEvent: false });
      return;
    }

    // Fallback: match by name (case-insensitive)
    const matchedByName = this.teamLeads.find(
      (lead) => String(lead.name || '').toLowerCase() === normalizedValue.toLowerCase(),
    );
    if (matchedByName) {
      control?.setValue(String(matchedByName.id), { emitEvent: false });
    }
  }

  /**
   * trackBy function for ngFor to improve rendering performance
   */
  trackById(index: number, item: User): string | number {
    return item?.id ?? index;
  }

  /**
   * Determine whether a control should display an error message.
   * - showErrors (from parent) forces visibility (used after submit/step attempt)
   * - otherwise show when control is touched or dirty
   */
  controlInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;
    return control.invalid && (this.showErrors || control.touched || control.dirty);
  }

  /**
   * Return a friendly, localized error message for a control.
   * Keep messages short and actionable.
   */
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) return 'This field is required.';
    if (control.hasError('minlength')) {
      const min = control.getError('minlength')?.requiredLength;
      return `Minimum ${min} characters required.`;
    }
    if (control.hasError('maxlength')) {
      const max = control.getError('maxlength')?.requiredLength;
      return `Maximum ${max} characters allowed.`;
    }
    if (control.hasError('pattern')) return 'Invalid format.';
    return 'Invalid value.';
  }
}
