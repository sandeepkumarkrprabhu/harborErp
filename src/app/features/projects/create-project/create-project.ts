import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WizardSteps } from '../../../shared/components/wizard-steps/wizard-steps';
import { WizardHeader } from '../../../shared/components/wizard-header/wizard-header';
import { ProjectIdentity } from '../project-identity/project-identity';
import { WizardFooter } from '../../../shared/components/wizard-footer/wizard-footer';

enum ProjectSteps {
  Details = 1,
  Members = 2,
  Review = 3
}

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, WizardSteps, WizardHeader, WizardFooter, ProjectIdentity],
  templateUrl: './create-project.html',
  styleUrls: ['./create-project.css']
})
export class CreateProject {

  showWizard = true;
  step = ProjectSteps.Details;
  projectForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      team: ['Platform Engineering', Validators.required],
      type: ['Internal Project', Validators.required],
      description: [''],
      tags: [''],
      members: [[]]
    });
  }

  nextStep() {
    if (this.step < 3) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  goToStep(stepNumber: number) {
    this.step = stepNumber;
  }

  onCloseWizard() {
    // Option 1: Hide the wizard modal
    this.showWizard = false;
  }

  submit() {
    if (this.projectForm.valid) {
      console.log('Project created:', this.projectForm.value);
      // TODO: integrate with backend service
    }
  }
}