import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

export interface WizardStep {
  number: number;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-wizard-footer',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './wizard-footer.html',
  styleUrls: ['./wizard-footer.css']
})
export class WizardFooter {
  @Input() currentStep: number = 1;
  @Input() steps: WizardStep[] = [];

  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  get nextLabel(): string {
    const nextStep = this.steps.find(s => s.number === this.currentStep + 1);
    return nextStep ? `Next: ${nextStep.subtitle}` : 'Submit';
  }

  get isLastStep(): boolean {
    return this.currentStep === this.steps.length;
  }
}
