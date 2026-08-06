import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { User } from '../../../Models/User';
import { Team } from '../../../Models/Team';

import { UserService } from '../../../core/users/services/userService';
import { UserHelper } from '../../../core/users/services/user-helper';
import { InputField } from '../../../shared/components/input-field/input-field';
import { Suggestedmember } from '../../../shared/components/memberview/suggestedmember/suggestedmember';
import { TeamService } from '../../../core/team/team-service';

@Component({
  selector: 'app-project-identity',
  standalone: true,
  imports: [InputField, Suggestedmember, ReactiveFormsModule, AsyncPipe],
  templateUrl: './project-identity.html',
  styleUrls: ['./project-identity.css'],
})
export class ProjectIdentity {
  /** Reactive form group passed from parent */
  @Input({ required: true }) formGroup!: FormGroup;

  /** Flag to control error message visibility */
  @Input() showErrors = false;

  /** Suggested members list as observable */
  suggestedMembers$!: Observable<User[]>;

  /** Teams list as observable */
  teams$!: Observable<Team[]>;

  /** Static helper reference for user utilities */
  userHelper = UserHelper;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private teamService: TeamService,
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      team: [null, [Validators.required]], // will be set dynamically
      type: ['Internal Project', [Validators.required]], // default value
      description: [''],
      tags: ['', [Validators.required]],
      members: [[]],
    });

    this.loadUsers();
    this.loadTeams();
  }

  /**
   * Fetch teams as observable
   */
  private loadTeams(): void {
    this.teams$ = this.teamService.getTeams().pipe(
      tap((teams) => {
        if (teams && teams.length > 0) {
          // set first team as default
          this.formGroup.get('team')?.setValue(teams[0].id);
        }
      }),
      catchError((error) => {
        console.error('Error loading teams:', error);
        // Return empty array gracefully
        return of([]);
      }),
    );
  }

  /**
   * Fetch active users and assign background colors
   */
  private loadUsers(): void {
    this.suggestedMembers$ = this.userService.getUsers().pipe(
      map((users) =>
        users
          .filter((u) => u.is_active)
          .map((u, idx) => ({
            ...u,
            bg: this.getBgColor(idx),
          })),
      ),
    );
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

  toggleMember(member: User): void {
    const membersControl = this.formGroup.get('members');
    if (!membersControl) return;

    const currentMembers = (membersControl.value || []) as Array<string | User>;
    const memberId = String(member.id);

    if (currentMembers.some((item) => String(item) === memberId)) {
      membersControl.setValue(currentMembers.filter((item) => String(item) !== memberId));
      return;
    }

    membersControl.setValue([...currentMembers, memberId]);
  }

  isSelected(member: User): boolean {
    const membersControl = this.formGroup.get('members');
    if (!membersControl) return false;

    const currentMembers = (membersControl.value || []) as Array<string | User>;
    return currentMembers.some((item) => String(item) === String(member.id));
  }

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
