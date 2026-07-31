import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { User } from '../../../Models/User';
import { UserService } from '../../../core/users/services/userService';
import { UserHelper } from '../../../core/users/services/user-helper';
import { InputField } from '../../../shared/components/input-field/input-field';

@Component({
  selector: 'app-project-identity',
  standalone: true,
  imports: [InputField, ReactiveFormsModule],
  templateUrl: './project-identity.html',
  styleUrls: ['./project-identity.css'],
})
export class ProjectIdentity {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() showErrors = false;

  suggestedMembers: User[] = [];
  userHelper = UserHelper;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  /** Load users from backend */
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.suggestedMembers = data.map((u, idx) => ({
          ...u,
          bg: this.getBgColor(idx),
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load users', err),
    });
  }

  getBgColor(index: number): string {
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

  /** Toggle members array inside the form control */
  toggleMember(memberName: string) {
    const membersControl = this.formGroup.get('members');
    if (!membersControl) return;

    const members = membersControl.value as string[];
    const idx = members.indexOf(memberName);

    if (idx > -1) {
      members.splice(idx, 1);
    } else {
      members.push(memberName);
    }
    membersControl.setValue([...members]);
  }

  /** Helper to show error messages */
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
