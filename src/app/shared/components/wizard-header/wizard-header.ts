import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-wizard-header',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './wizard-header.html',
  styleUrls: ['./wizard-header.css']
})

export class WizardHeader {
  readonly X = X;

  @Input() title: string = '';
  @Input() showClose: boolean = true;

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
