import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-wizard-header',
  standalone: true,
  templateUrl: './wizard-header.html',
  styleUrls: ['./wizard-header.css']
})
export class WizardHeader {
  @Input() title: string = '';
  @Input() showClose: boolean = true;

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
