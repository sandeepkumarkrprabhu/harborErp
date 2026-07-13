import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Output, Input } from '@angular/core';

import { WizardFooter } from '../../../shared/components/wizard-footer/wizard-footer';
import { WizardHeader } from '../../../shared/components/wizard-header/wizard-header';
import { WizardSteps } from '../../../shared/components/wizard-steps/wizard-steps';
import { TeamIdentity } from '../team-identity/team-identity';
import { TeamService } from '../../../core/team/team-service';
import { UserService } from '../../../core/users/services/userService';
import {  Team, ValidationErrors } from '../../../Models/Team';
import { User } from '../../../Models/User';
import { TeamMembers } from "../team-members/team-members";

enum teamSteps {
  Details = 1,
  Members = 2,
  Review = 3
}

@Component({
  selector: 'app-createteam',
  imports: [CommonModule, WizardHeader, WizardSteps, WizardFooter, TeamIdentity, TeamMembers],
  templateUrl: './createteam.html',
  styleUrl: './createteam.css',
})

export class Createteam {
  
  @Output() closed = new EventEmitter<void>();

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() existingTeam: Team | null = null;

  showWizard = true;
  step = teamSteps.Details;
  attemptedSteps = new Set<number>();
  submitAttempted = false;

  teamData!: Team;
  users: User[] = [];

  steps = [
    { number: 1, title: 'Step 1', subtitle: 'Team Identity' },
    { number: 2, title: 'Step 2', subtitle: 'Team Members' },    
    { number: 3, title: 'Step 3', subtitle: this.mode === 'edit' ? 'Review & Update' : 'Review & Create' }
  ];

  private existingUserEmails = [
    'alex.k@example.com', 'priya.r@example.com', 'sam.t@example.com',
    'zara.m@example.com', 'john.d@example.com', 'meera.l@example.com',
    'carlos.m@example.com', 'nina.p@example.com', 'omar.q@example.com',
    'sophia.w@example.com', 'rajesh.b@example.com', 'emily.c@example.com'
  ];

  constructor(
    private teamService: TeamService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { 
    if (this.route.snapshot.paramMap.get('id') != null)
    {
      this.mode = "edit";
    }
  }
  
  ngOnInit() {
    // users are loaded by the TeamMembers component when the user opens Step 2
    
    if (this.mode === 'edit') {
      const teamId = this.route.snapshot.paramMap.get('id'); // assumes route like /users/:id/edit
      if (teamId) {
        this.teamService.getTeamById(teamId).subscribe(team => {
          this.teamData = {
            ...team,
          };
          console.log("Selected Team Details:", { ...team });
        });
      }
    } else if (this.existingTeam) {
      this.teamData = { ...this.existingTeam };
    }
    else {
      // initialize empty team for create mode
      this.teamData = {
        teamName: '',
        description: '',
        teamDescription: '',
        created_at: '',
        id: '',
        is_active: true,
        projects: [],
        teamLeadID: '',
        teamLeadName: '',
        teamMembers: [],
        teamMembersIDs: [],
        totalmembers: 0,
        totalProjects: 0,
        updated_at: ''
      };
    }
  }


  get teamMembersErrors(): ValidationErrors {
    const errors: ValidationErrors = {};
    
    if (!this.teamData.teamMembers || this.teamData.teamMembers.length === 0) {
      errors.teamMembers = 'At least one team member is required.';
    }

    return errors;
  }

  onSelectedMembersChange(selectedMembers: User[]): void {
    this.teamData.teamMembers = selectedMembers;
    this.teamData.teamMembersIDs = selectedMembers.map(u => u.id);
    this.teamData.totalmembers = selectedMembers.length;
    console.log('Updated teamData:', this.teamData);
  }

  nextStep() {
    this.attemptedSteps.add(this.step);
    if (!this.isStepValid(this.step)) return;
    if (this.step < teamSteps.Review) this.step++;
  }

  prevStep() {
    if (this.step > teamSteps.Details) this.step--;
  }

  goToStep(stepNumber: number) {
    if (stepNumber > this.step && !this.canReachStep(stepNumber)) {
      this.attemptedSteps.add(this.step);
      return;
    }
    this.step = stepNumber;
  }

  get teamIdentityErrors(): ValidationErrors {
    console.log("Team data:", this.teamData);
    const errors: ValidationErrors = {};
    const name = this.teamData.teamName.trim();   
    const teamLeadId = this.teamData.teamLeadID.trim();
    const projects = this.cleanList(this.teamData.projects.map(p => p.project_name));

    if (!name) {
      errors.teamName = 'Name is required.';
    } else if (name.length < 2 || name.length > 64) {
      errors.teamName = 'Name must be 2-64 characters.';
    }

    if (!teamLeadId) errors.teamLeadID = 'Team Lead is required.';
    if (!this.teamData.is_active) errors.is_active = 'Status is required.';

    // if (projects.length <= 1) {
    //   errors.projects = 'Assign atleast one or more projects or fewer.';
    // } else if (new Set(projects.map(p => p.toLowerCase())).size !== projects.length) {
    //   errors.projects = 'Projects must be unique.';
    // }

    return errors;
  }


  get currentStepErrors(): ValidationErrors {
    return this.teamIdentityErrors;
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
    this.attemptedSteps.add(teamSteps.Details);

    if (!this.isStepValid(teamSteps.Details)) {
      this.step = teamSteps.Details;
      return;
    }

    if (this.mode === 'create') {
      // var registerUser = this.userHelper.toRegisterRequest(this.teamData); 
      // console.log("New user Object:", registerUser)
      // // Call backend to register new user
      // this.authService.registerUser(registerUser).subscribe({
      //   next: (response) => {
      //     console.log('User created successfully:', response);
      //     this.closed.emit();
      //   },
      //   error: (err) => {
      //     console.error('Error creating user:', err);
      //     // Optionally show a UI error message
      //   }
      // });
    } else {
      // For now, just log edit mode until update service is ready
      console.log('Edit mode selected, update service not yet implemented:', this.teamData);
      this.closed.emit();
    }
  }

  // These methods must be inside the class
  private isStepValid(stepNumber: number): boolean {
    let errors: ValidationErrors = {};
    
    if (stepNumber === teamSteps.Details) {
      errors = this.teamIdentityErrors;
    } else if (stepNumber === teamSteps.Members) {
      errors = this.teamMembersErrors;
    }
    
    return Object.keys(errors).length === 0;
  }

  private canReachStep(stepNumber: number): boolean {
    for (let currentStep = teamSteps.Details; currentStep < stepNumber; currentStep++) {
      if (!this.isStepValid(currentStep)) return false;
    }
    return true;
  }

  private cleanList(values: string[]): string[] {
    return values.map(v => v.trim()).filter(Boolean);
  }
}
