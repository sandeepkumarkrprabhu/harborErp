import { Component, Input } from '@angular/core';

export interface WizardStep {
  number: number;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-wizard-steps',
  standalone: true,
  templateUrl: './wizard-steps.html',
  styleUrls: ['./wizard-steps.css']
})
export class WizardSteps {
  @Input() steps: WizardStep[] = [];
  @Input() currentStep: number = 1;
}
