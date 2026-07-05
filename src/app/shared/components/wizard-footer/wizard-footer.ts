import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule, SkipBack, CircleCheck, ChevronRight } from 'lucide-angular'; 

import { WizardStep } from '../wizard-steps/wizard-steps';

@Component({
  selector: 'app-wizard-footer',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './wizard-footer.html',
  styleUrls: ['./wizard-footer.css']
})
export class WizardFooter {
  readonly SkipBack = SkipBack;  // expose it to template
  readonly ChevronRight = ChevronRight;
  readonly CircleCheck = CircleCheck; 

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
