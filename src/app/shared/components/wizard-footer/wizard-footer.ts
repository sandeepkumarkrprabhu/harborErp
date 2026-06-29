import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-wizard-footer',
  standalone: true,
  templateUrl: './wizard-footer.html',
  styleUrls: ['./wizard-footer.css']
})
export class WizardFooter {
  @Input() currentStep: number = 1;
  @Input() totalSteps: number = 3;

  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
}
