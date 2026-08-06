import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { User } from '../../../Models/User';
import { UserService } from '../../../core/users/services/userService';
import { UserHelper } from '../../../core/users/services/user-helper';
import { InputField } from '../../../shared/components/input-field/input-field';

/**
 * ProjectIdentity Component
 * -------------------------
 * Handles project identity form section including suggested members.
 * Provides user selection, validation, and error handling.
 */
@Component({
  selector: 'app-project-identity',
  standalone: true,
  imports: [InputField, ReactiveFormsModule],
  templateUrl: './project-identity.html',
  styleUrls: ['./project-identity.css'],
})
export class ProjectIdentity {
  /** Reactive form group passed from parent */
  @Input({ required: true }) formGroup!: FormGroup;

  /** Flag to control error message visibility */
  @Input() showErrors = false;

  /** Suggested members list populated from backend */
  suggestedMembers: User[] = [];

  /** Static helper reference for user utilities */
  userHelper = UserHelper;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  /** Lifecycle hook: load users on init */
  ngOnInit() {
    this.loadUsers();
  }

  /**
   * Fetch active users from backend and assign background colors
   */
  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.suggestedMembers = data
          .filter((u) => u.is_active)
          .map((u, idx) => ({
            ...u,
            bg: this.getBgColor(idx),
          }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Failed to load users', err),
    });
  }

  /**
   * Assign background color based on index for visual distinction
   */
  private getBgColor(index: number): string {
    const shades = [
      'bg-primary',
      'bg-primary/80',
      'bg-primary/60',
      'bg-primary/40',
      'bg-primary/20',
      'bg-primary/70',
    ];
    return shades[index % shades.length];
  }

  /**
   * Toggle member selection inside the form control
   * - Adds member if not selected
   * - Removes member if already selected
   */
  toggleMember(member: User): void {
    const membersControl = this.formGroup.get('members');
    if (!membersControl) return;

    const currentMembers = (membersControl.value || []) as Array<string | User>;
    const memberId = String(member.id);

    // Remove if already selected
    if (currentMembers.some((item) => String(item) === memberId)) {
      membersControl.setValue(currentMembers.filter((item) => String(item) !== memberId));
      return;
    }

    // Add new member
    membersControl.setValue([...currentMembers, memberId]);
  }

  /**
   * Check if a member is currently selected
   */
  isSelected(member: User): boolean {
    const membersControl = this.formGroup.get('members');
    if (!membersControl) return false;

    const currentMembers = (membersControl.value || []) as Array<string | User>;
    return currentMembers.some((item) => String(item) === String(member.id));
  }

  /**
   * Generate user-friendly error messages for form controls
   */
  errorFor(controlName: string): string {
    const control = this.formGroup.get(controlName);
    if (!control || !this.showErrors) return '';

    if (control.hasError('required')) return `${controlName} is required.`;
    if (control.hasError('minlength')) return `${controlName} is too short.`;
    if (control.hasError('maxlength')) return `${controlName} is too long.`;
    if (control.hasError('pattern')) return `Invalid ${controlName} format.`;

    return '';
  }
}
