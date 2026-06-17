import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button, app-harborButton',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class harborButton {
  @Input() caption = '';
  @Output() clicked = new EventEmitter<MouseEvent>();
}
