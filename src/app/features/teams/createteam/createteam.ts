import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

/* Shared Components */
import { WizardFooter } from '../../../shared/components/wizard-footer/wizard-footer';
import { WizardHeader } from '../../../shared/components/wizard-header/wizard-header';
import { WizardSteps } from '../../../shared/components/wizard-steps/wizard-steps';
import { TeamIdentity } from '../team-identity/team-identity';
import { TeamMembers } from '../team-members/team-members';
import { ReviewTeam } from '../team-review/team-review';

/* services for Team */
import { TeamPayload, TeamService } from '../../../core/team/team-service';

/* Team model */
import { Team } from '../../../Models/Team';
import { User } from '../../../Models/User';

enum teamSteps {
  Details = 1,
  Members = 2,
  Review = 3,
}

function atLeastOneMember(control: AbstractControl | null) {
  const val = control?.value || [];
  return Array.isArray(val) && val.length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-create-team',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardHeader,
    WizardSteps,
    WizardFooter,
    TeamIdentity,
    TeamMembers,
    ReviewTeam,
  ],
  templateUrl: './createteam.html',
  styleUrls: ['./createteam.css'],
})
export class CreateTeam implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() existingTeam: Team | null = null;

  showWizard = true;
  step = teamSteps.Details;
  attemptedSteps = new Set<number>();
  submitAttempted = false;

  form!: FormGroup;
  teamData!: Team;
  isSaving = false;

  steps: { number: number; title: string; subtitle: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
  ) {}

  private normalizeLeadValue(value: unknown): string {
    if (value == null || value === '') {
      return '';
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }

    if (typeof value === 'object') {
      const record = value as { id?: unknown; name?: unknown };
      if (record.id != null) {
        return String(record.id);
      }
      if (typeof record.name === 'string') {
        return record.name;
      }
    }

    return String(value);
  }

  ngOnInit(): void {
    // initialize steps after mode is known
    this.steps = [
      { number: 1, title: 'Step 1', subtitle: 'Team Identity' },
      { number: 2, title: 'Step 2', subtitle: 'Team Members' },
      {
        number: 3,
        title: 'Step 3',
        subtitle: this.mode === 'edit' ? 'Review & Update' : 'Review & Create',
      },
    ];

    this.form = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(64)]],
      teamLeadID: ['', Validators.required],
      teamDescription: [''],
      teamMembers: [[], atLeastOneMember],
    });

    if (this.mode === 'edit' && this.existingTeam) {
      this.teamData = { ...this.existingTeam };
      this.form.patchValue({
        teamName: this.existingTeam.teamName,
        teamLeadID: this.normalizeLeadValue(this.existingTeam.teamLeadID),
        teamDescription: this.existingTeam.teamDescription,
        teamMembers: this.existingTeam.teamMembers || [],
      });
    } else {
      this.teamData = {
        id: '',
        teamName: '',
        teamDescription: '',
        description: '',
        created_at: '',
        updated_at: '',
        is_active: true,
        projects: [],
        teamLeadID: '',
        teamLeadName: '',
        teamMembers: [],
        teamMembersIDs: [],
        totalmembers: 0,
        totalProjects: 0,
      } as Team;
    }
  }

  onSelectedMembersChange(selectedMembers: User[]): void {
    this.form.patchValue({ teamMembers: selectedMembers });
    this.teamData.teamMembersIDs = selectedMembers.map((u) => u.id);
    this.teamData.totalmembers = selectedMembers.length;
  }

  private buildTeamPayload(): TeamPayload {
    const formValue = this.form.getRawValue();
    const selectedMembers = Array.isArray(formValue.teamMembers)
      ? (formValue.teamMembers as User[])
      : [];

    return {
      teamName: formValue.teamName || this.teamData?.teamName || '',
      teamDescription: formValue.teamDescription || this.teamData?.teamDescription || '',
      teamLeadID: this.normalizeLeadValue(formValue.teamLeadID),
      teamMembersIDs: selectedMembers.map((member) => String(member.id)).filter(Boolean),
    };
  }

  nextStep() {
    this.attemptedSteps.add(this.step);
    if (!this.isStepValid(this.step)) return;
    if (this.step < teamSteps.Review) this.step++;
  }

  prevStep() {
    if (this.step > teamSteps.Details) this.step--;
  }

  submit() {
    this.submitAttempted = true;
    this.form.markAllAsTouched();

    if (!this.isStepValid(teamSteps.Details)) {
      this.step = teamSteps.Details;
      return;
    }

    const finalTeam = this.buildTeamPayload();
    const teamId = this.mode === 'edit' ? this.existingTeam?.id || this.teamData?.id : '';

    this.isSaving = true;

    const request$ =
      this.mode === 'create'
        ? this.teamService.createUser(finalTeam)
        : this.teamService.updateUser(teamId, finalTeam);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.saved.emit();
        this.closed.emit();
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Failed to save team', error);
      },
    });
  }

  private isStepValid(stepNumber: number): boolean {
    if (stepNumber === teamSteps.Details) {
      return (this.form.get('teamName')?.valid && this.form.get('teamLeadID')?.valid) || false;
    } else if (stepNumber === teamSteps.Members) {
      const members = this.form.get('teamMembers')?.value || [];
      return Array.isArray(members) && members.length > 0;
    }
    return true;
  }

  private canReachStep(stepNumber: number): boolean {
    for (let currentStep = teamSteps.Details; currentStep < stepNumber; currentStep++) {
      if (!this.isStepValid(currentStep)) return false;
    }
    return true;
  }

  onCloseWizard() {
    this.showWizard = false;
    this.closed.emit();
  }
}
