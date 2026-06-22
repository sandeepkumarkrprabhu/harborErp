import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

enum ProjectSteps {
  Details = 1,
  Members = 2,
  Review = 3
}

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-project.html',
  styleUrls: ['./create-project.css']
})
export class CreateProject {

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

  submit() {
    if (this.projectForm.valid) {
      console.log('Project created:', this.projectForm.value);
      // TODO: integrate with backend service
    }
  }
}