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

/* Services for Team */
import { TeamPayload, TeamService } from '../../../core/team/team-service';

/* Models */
import { Team } from '../../../Models/Team';
import { User } from '../../../Models/User';

/**
 * Enum representing wizard steps for team creation/editing
 */
enum teamSteps {
  Details = 1,
  Members = 2,
  Review = 3,
}

/**
 * Custom validator: ensures at least one member is selected
 */
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
  /** Emits when wizard is closed */
  @Output() closed = new EventEmitter<void>();

  /** Emits when team is successfully saved */
  @Output() saved = new EventEmitter<void>();

  /** Mode of operation: create or edit */
  @Input() mode: 'create' | 'edit' = 'create';

  /** Existing team data for edit mode */
  @Input() existingTeam: Team | null = null;

  /** Wizard state */
  showWizard = true;
  step = teamSteps.Details;
  attemptedSteps = new Set<number>();
  submitAttempted = false;

  /** Reactive form and team data */
  form!: FormGroup;
  teamData!: Team;
  isSaving = false;

  /** Wizard steps metadata */
  steps: { number: number; title: string; subtitle: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
  ) {}

  /**
   * Normalize lead value to string
   */
  private normalizeLeadValue(value: unknown): string {
    if (value == null || value === '') return '';

    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }

    if (typeof value === 'object') {
      const record = value as { id?: unknown; name?: unknown };
      if (record.id != null) return String(record.id);
      if (typeof record.name === 'string') return record.name;
    }

    return String(value);
  }

  /**
   * Lifecycle hook: initialize wizard and form
   */
  ngOnInit(): void {
    this.steps = [
      { number: 1, title: 'Step 1', subtitle: 'Team Identity' },
      { number: 2, title: 'Step 2', subtitle: 'Team Members' },
      {
        number: 3,
        title: 'Step 3',
        subtitle: this.mode === 'edit' ? 'Review & Update' : 'Review & Create',
      },
    ];

    // Define form controls with validations
    this.form = this.fb.group({
      teamName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(64),
          Validators.pattern(/^[a-zA-Z0-9\s]+$/), // only letters, numbers, spaces
        ],
      ],
      teamLeadID: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_-]+$/), // alphanumeric, underscore, dash
        ],
      ],
      teamDescription: [
        '',
        [Validators.maxLength(256)], // optional, capped length
      ],
      teamMembers: [[], atLeastOneMember],
    });

    // Patch form if editing
    if (this.mode === 'edit' && this.existingTeam) {
      this.teamData = { ...this.existingTeam };
      this.form.patchValue({
        teamName: this.existingTeam.teamName,
        teamLeadID: this.normalizeLeadValue(this.existingTeam.teamLeadID),
        teamDescription: this.existingTeam.teamDescription,
        teamMembers: this.existingTeam.teamMembers || [],
      });
    } else {
      // Initialize blank team data
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

  /**
   * Handle member selection changes
   */
  onSelectedMembersChange(selectedMembers: User[]): void {
    this.form.patchValue({ teamMembers: selectedMembers });
    this.teamData.teamMembersIDs = selectedMembers.map((u) => u.id);
    this.teamData.totalmembers = selectedMembers.length;
  }

  /**
   * Build payload for API submission
   */
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

  /**
   * Navigate to next wizard step
   */
  nextStep(): void {
    // this.attemptedSteps.add(this.step);
    // if (!this.isStepValid(this.step)) return;
    // if (this.step < teamSteps.Review) this.step++;

    // record that user attempted this step
    this.attemptedSteps.add(this.step);

    // mark controls so template shows errors
    this.markStepControlsTouched(this.step);

    // validate step
    if (!this.isStepValid(this.step)) return;

    if (this.step < teamSteps.Review) this.step++;
  }

  /**
   * Navigate to previous wizard step
   */
  prevStep(): void {
    if (this.step > teamSteps.Details) this.step--;
  }

  /**
   * Submit form data to backend
   */
  submit(): void {
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
        console.error('❌ Failed to save team', error);
      },
    });
  }

  /**
   * Validate wizard step
   */
  private isStepValid(stepNumber: number): boolean {
    if (stepNumber === teamSteps.Details) {
      return (this.form.get('teamName')?.valid && this.form.get('teamLeadID')?.valid) || false;
    } else if (stepNumber === teamSteps.Members) {
      const members = this.form.get('teamMembers')?.value || [];
      return Array.isArray(members) && members.length > 0;
    }
    return true;
  }

  /**
   * Check if user can reach a given step
   */
  private canReachStep(stepNumber: number): boolean {
    for (let currentStep = teamSteps.Details; currentStep < stepNumber; currentStep++) {
      if (!this.isStepValid(currentStep)) return false;
    }
    return true;
  }

  /** Called by template to decide whether to show errors for a step */
  shouldShowErrorsForStep(stepNumber: number): boolean {
    return this.submitAttempted || this.attemptedSteps.has(stepNumber);
  }

  /** Mark controls for a specific step as touched so errors render */
  private markStepControlsTouched(stepNumber: number): void {
    if (stepNumber === teamSteps.Details) {
      ['teamName', 'teamLeadID', 'teamDescription'].forEach((name) =>
        this.form.get(name)?.markAsTouched(),
      );
    } else if (stepNumber === teamSteps.Members) {
      this.form.get('teamMembers')?.markAsTouched();
    }
  }

  /**
   * Close wizard
   */
  onCloseWizard(): void {
    this.showWizard = false;
    this.closed.emit();
  }
}
