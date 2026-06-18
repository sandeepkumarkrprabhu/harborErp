import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button, app-harborButton',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class harborButton {
  @Input() caption = '';
  @Input() buttonHeight = '32px';
  @Output() clicked = new EventEmitter<MouseEvent>();
}
